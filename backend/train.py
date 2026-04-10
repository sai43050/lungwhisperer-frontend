import os
import pandas as pd
from PIL import Image
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader
from torchvision import models, transforms

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CSV_FILE = os.path.join(BASE_DIR, 'Chest_xray_Corona_Metadata.csv')
IMG_DIR = os.path.join(BASE_DIR, 'dataset', 'Coronahack-Chest-XRay-Dataset', 'Coronahack-Chest-XRay-Dataset')

class ChestXRayDataset(Dataset):
    def __init__(self, csv_file, img_dir, dataset_type='TRAIN', transform=None):
        self.data = pd.read_csv(csv_file)
        # Filter by dataset type (TRAIN or TEST)
        self.data = self.data[self.data['Dataset_type'] == dataset_type].reset_index(drop=True)
        self.img_dir = os.path.join(img_dir, dataset_type.lower())
        self.transform = transform

    def __len__(self):
        return len(self.data)

    def __getitem__(self, idx):
        img_name = self.data.iloc[idx]['X_ray_image_name']
        img_path = os.path.join(self.img_dir, img_name)
        
        # Load image and ensure standard RGB encoding
        image = Image.open(img_path).convert('RGB')
        
        # 5-Class Disease Categorization
        label_str = str(self.data.iloc[idx]['Label'])
        virus_1 = str(self.data.iloc[idx]['Label_1_Virus_category'])
        virus_2 = str(self.data.iloc[idx]['Label_2_Virus_category'])
        
        # 0: Normal, 1: Bacterial Pneumonia, 2: Viral Pneumonia, 3: COVID-19, 4: Tuberculosis (or ARDS mapping)
        if label_str == 'Normal':
            label = 0
        elif virus_1 == 'bacteria':
            label = 1
        elif virus_1 == 'Virus':
            if virus_2 == 'COVID-19':
                label = 3
            else:
                label = 2
        else:
            # Fallback for ARDS/SARS/Streptococcus to Tuberculosis category (or catch-all)
            label = 4
        
        if self.transform:
            image = self.transform(image)
            
        return image, label

def train_ensemble_models():
    print("Setting up data transforms...")
    train_transforms = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.RandomHorizontalFlip(),
        transforms.ColorJitter(brightness=0.2, contrast=0.2), 
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
    ])
    
    test_transforms = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
    ])

    print("Loading datasets...")
    train_dataset = ChestXRayDataset(CSV_FILE, IMG_DIR, 'TRAIN', train_transforms)
    test_dataset = ChestXRayDataset(CSV_FILE, IMG_DIR, 'TEST', test_transforms)
    
    train_loader = DataLoader(train_dataset, batch_size=32, shuffle=True, num_workers=0)
    test_loader = DataLoader(test_dataset, batch_size=32, shuffle=False, num_workers=0)

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Using compute device: {device}")

    # Define the models for our ensemble
    print("Initializing Ensemble Models (ResNet-18 & DenseNet-121)...")
    
    model1 = models.resnet18(pretrained=True)
    for param in model1.parameters(): param.requires_grad = False
    model1.fc = nn.Linear(model1.fc.in_features, 5)
    model1 = model1.to(device)

    model2 = models.densenet121(pretrained=True)
    for param in model2.parameters(): param.requires_grad = False
    model2.classifier = nn.Linear(model2.classifier.in_features, 5)
    model2 = model2.to(device)

    ensemble = [
        {"name": "ResNet18", "model": model1, "save_path": "model_weights_resnet18.pth"},
        {"name": "DenseNet121", "model": model2, "save_path": "model_weights_densenet121.pth"}
    ]

    num_epochs = 1 

    for m_info in ensemble:
        m_name = m_info["name"]
        model = m_info["model"]
        save_path = os.path.join(os.path.dirname(__file__), m_info["save_path"])
        print(f"\n--- Training {m_name} ---")
        
        # Use a dynamic optimizer depending on the attribute name (fc vs classifier)
        params_to_update = model.fc.parameters() if hasattr(model, 'fc') else model.classifier.parameters()
        optimizer = optim.Adam(params_to_update, lr=0.001)
        criterion = nn.CrossEntropyLoss()
        
        best_acc = 0.0

        for epoch in range(num_epochs):
            print(f"Epoch {epoch+1}/{num_epochs}")
            model.train()
            running_loss, running_corrects = 0.0, 0
            
            for batch_idx, (inputs, labels) in enumerate(train_loader):
                inputs, labels = inputs.to(device), labels.to(device)
                optimizer.zero_grad()
                outputs = model(inputs)
                _, preds = torch.max(outputs, 1)
                loss = criterion(outputs, labels)
                loss.backward()
                optimizer.step()
                
                running_loss += loss.item() * inputs.size(0)
                running_corrects += torch.sum(preds == labels.data)
                
            epoch_loss = running_loss / len(train_dataset)
            epoch_acc = running_corrects.double() / len(train_dataset)
            
            model.eval()
            val_loss, val_corrects = 0.0, 0
            with torch.no_grad():
                for inputs, labels in test_loader:
                    inputs, labels = inputs.to(device), labels.to(device)
                    outputs = model(inputs)
                    _, preds = torch.max(outputs, 1)
                    loss = criterion(outputs, labels)
                    val_loss += loss.item() * inputs.size(0)
                    val_corrects += torch.sum(preds == labels.data)
                    
            val_epoch_loss = val_loss / len(test_dataset)
            val_epoch_acc = val_corrects.double() / len(test_dataset)
            print(f"[{m_name}] Train Loss: {epoch_loss:.4f} Acc: {epoch_acc:.4f} | Val Loss: {val_epoch_loss:.4f} Acc: {val_epoch_acc:.4f}")

            if val_epoch_acc > best_acc or epoch == num_epochs - 1:
                best_acc = val_epoch_acc
                torch.save(model.state_dict(), save_path)
                print(f"Saved {m_name} to {save_path}")

    print("\nEnsemble Training Complete!")

if __name__ == '__main__':
    train_ensemble_models()
