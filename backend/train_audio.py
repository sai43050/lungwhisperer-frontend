import os
import pandas as pd
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader
import torchaudio
import torchaudio.transforms as T
from torchvision import models
import warnings
warnings.filterwarnings("ignore")

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CSV_FILE = os.path.join(BASE_DIR, 'dataset', 'CoughVID', 'tabular_form', 'tabular_form', 'coughvid_v3.csv')
AUDIO_DIR = os.path.join(BASE_DIR, 'dataset', 'CoughVID', 'public_dataset_v3', 'coughvid_20211012')

class CoughDataset(Dataset):
    def __init__(self, csv_file, audio_dir, transform=None):
        self.data = pd.read_csv(csv_file)
        
        # Detect correct label column (status or status_SSL)
        self.label_col = 'status_SSL' if 'status_SSL' in self.data.columns else 'status'
        self.id_col = 'uuid' if 'uuid' in self.data.columns else 'file_name'
        
        print(f"Using {self.label_col} for labels, {self.id_col} for files")
        
        self.data = self.data[self.data[self.label_col].notna()].reset_index(drop=True)
        self.audio_dir = audio_dir
        self.transform = transform
        
        self.classes = sorted(self.data[self.label_col].astype(str).unique().tolist())
        self.class_to_idx = {cls_name: i for i, cls_name in enumerate(self.classes)}
        
        print(f"Loaded {len(self.data)} audio records. Classes: {self.class_to_idx}")

    def __len__(self):
        return len(self.data)

    def __getitem__(self, idx):
        file_id = str(self.data.iloc[idx][self.id_col]).replace('.webm', '').replace('.ogg', '').replace('.wav', '')
        
        audio_path = os.path.join(self.audio_dir, f"{file_id}.webm")
        if not os.path.exists(audio_path):
            audio_path = os.path.join(self.audio_dir, f"{file_id}.ogg")
        if not os.path.exists(audio_path):
            audio_path = os.path.join(self.audio_dir, f"{file_id}.wav")
            
        try:
            waveform, sample_rate = torchaudio.load(audio_path)
            # Convert to mono
            if waveform.shape[0] > 1:
                waveform = torch.mean(waveform, dim=0, keepdim=True)
        except Exception:
            waveform = torch.zeros(1, 16000)
            sample_rate = 16000
            
        if self.transform:
            spectrogram = self.transform(waveform)
        else:
            spectrogram = waveform
            
        import torch.nn.functional as F
        spectrogram = spectrogram.unsqueeze(0)
        # Handle zero length
        if spectrogram.shape[-1] > 0 and spectrogram.shape[-2] > 0:
            spectrogram = F.interpolate(spectrogram, size=(224, 224), mode='bilinear', align_corners=False)
        else:
            spectrogram = torch.zeros(1, 1, 224, 224)
            
        spectrogram = spectrogram.squeeze(0).repeat(3, 1, 1)

        label_str = str(self.data.iloc[idx][self.label_col])
        label = self.class_to_idx.get(label_str, 0)
        
        return spectrogram, label

def train_ensemble_audio():
    mel_spectrogram = T.MelSpectrogram(sample_rate=16000, n_mels=128)
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Device: {device}")

    dataset = CoughDataset(CSV_FILE, AUDIO_DIR, transform=mel_spectrogram)
    
    train_size = int(0.8 * len(dataset))
    test_size = len(dataset) - train_size
    train_dataset, test_dataset = torch.utils.data.random_split(dataset, [train_size, test_size])
    
    train_loader = DataLoader(train_dataset, batch_size=16, shuffle=True)
    test_loader = DataLoader(test_dataset, batch_size=16, shuffle=False)
    
    num_classes = len(dataset.classes)
    
    model1 = models.resnet18(pretrained=True)
    model1.fc = nn.Linear(model1.fc.in_features, num_classes)
    model1 = model1.to(device)

    model2 = models.mobilenet_v3_small(pretrained=True)
    model2.classifier[3] = nn.Linear(model2.classifier[3].in_features, num_classes)
    model2 = model2.to(device)

    ensemble = [
        {"name": "ResNet18_Audio", "model": model1, "save_path": "audio_model_weights_resnet18.pth"},
        {"name": "MobileNetV3_Audio", "model": model2, "save_path": "audio_model_weights_mobilenet.pth"}
    ]

    for m_info in ensemble:
        m_name = m_info["name"]
        model = m_info["model"]
        save_path = os.path.join(os.path.dirname(__file__), m_info["save_path"])
        print(f"\n--- Training {m_name} ---")

        params_to_update = model.fc.parameters() if hasattr(model, 'fc') else model.classifier.parameters()
        optimizer = optim.Adam(params_to_update, lr=0.001)
        criterion = nn.CrossEntropyLoss()

        best_acc = 0.0

        for epoch in range(1):
            print(f"Epoch {epoch+1}")
            model.train()
            running_loss, val_corrects = 0.0, 0
            
            for batch_idx, (inputs, labels) in enumerate(train_loader):
                inputs, labels = inputs.to(device), labels.to(device)
                optimizer.zero_grad()
                outputs = model(inputs)
                loss = criterion(outputs, labels)
                loss.backward()
                optimizer.step()
                if batch_idx % 10 == 0:
                    print(f"  Batch {batch_idx} Loss: {loss.item():.4f}")
                    
            model.eval()
            with torch.no_grad():
                for inputs, labels in test_loader:
                    inputs, labels = inputs.to(device), labels.to(device)
                    outputs = model(inputs)
                    _, preds = torch.max(outputs, 1)
                    val_corrects += torch.sum(preds == labels.data)
                        
            acc = val_corrects.double() / len(test_dataset)
            print(f"[{m_name}] Val Acc: {acc:.4f}")
            
            if acc > best_acc or epoch == 0:
                best_acc = acc
                torch.save(model.state_dict(), save_path)
                print(f"Saved {m_name} to {save_path}")
        
    with open(os.path.join(os.path.dirname(__file__), 'audio_classes.txt'), 'w') as f:
        f.write(",".join(dataset.classes))

if __name__ == '__main__':
    train_ensemble_audio()
