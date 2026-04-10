import pandas as pd

df = pd.read_csv('Chest_xray_Corona_Metadata.csv')

def get_composite_label(r):
    if r['Label'] == 'Normal':
        return 'Normal'
    if pd.notna(r['Label_2_Virus_category']):
        return r['Label_2_Virus_category']
    if pd.notna(r['Label_1_Virus_category']):
        return r['Label_1_Virus_category']
    return 'Unknown Pneumonia'

df['Composite'] = df.apply(get_composite_label, axis=1)

with open('classes.txt', 'w') as f:
    f.write(df['Composite'].value_counts(dropna=False).to_string())
