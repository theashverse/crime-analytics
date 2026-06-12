import pandas as pd
import os
import glob

dataset_folder = os.getcwd()
csv_files = glob.glob(os.path.join(dataset_folder, '*.csv'))
print(f"Total CSV files found: {len(csv_files)}\n")
for filepath in sorted(csv_files):
    filename = os.path.basename(filepath)
    try:
        df = pd.read_csv(filepath, nrows=2, encoding='unicode_escape')
        print(f"FILE: {filename}")
        print(f"  Columns: {df.columns.tolist()}")
        print()
    except Exception as e:
        print(f"FILE: {filename} -> ERROR: {e}\n")
