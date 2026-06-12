import pandas as pd
import os

dataset_folder = os.getcwd()
output_path = os.path.join(dataset_folder, 'crime_clean.csv')

file_configs = [
    {'pattern': '32_Murder_victim_age_sex.csv', 'state_col': 'ï»¿Area_Name', 'year_col': 'Year', 'total_col': 'Victims_Total', 'crime_type': 'Murder'},
    {'pattern': '20_Victims_of_rape.csv', 'state_col': 'ï»¿Area_Name', 'year_col': 'Year', 'total_col': 'Victims_of_Rape_Total', 'crime_type': 'Rape'},
    {'pattern': '30_Auto_theft.csv', 'state_col': 'ï»¿Area_Name', 'year_col': 'Year', 'total_col': 'Auto_Theft_Stolen', 'crime_type': 'Auto Theft'},
    {'pattern': '42_Cases_under_crime_against_women.csv', 'state_col': 'ï»¿Area_Name', 'year_col': 'Year', 'total_col': 'Cases_Reported', 'crime_type': 'Crime Against Women'},
    {'pattern': '10_Property_stolen_and_recovered.csv', 'state_col': 'ï»¿Area_Name', 'year_col': 'Year', 'total_col': 'Cases_Property_Stolen', 'crime_type': 'Property Stolen'},
    {'pattern': '39_Specific_purpose_of_kidnapping_and_abduction.csv', 'state_col': 'ï»¿Area_Name', 'year_col': 'Year', 'total_col': 'K_A_Grand_Total', 'crime_type': 'Kidnapping'},
    {'pattern': '19_Motive_or_cause_of_murder_and_culpable_homicide_not_amounting_to_murder.csv', 'state_col': 'ï»¿Area_Name', 'year_col': 'Year', 'total_col': 'Murder_Cause_Total', 'crime_type': 'Murder by Cause'},
]

all_dfs = []

for config in file_configs:
    filepath = os.path.join(dataset_folder, config['pattern'])
    if not os.path.exists(filepath):
        print(f"SKIP (not found): {config['pattern']}")
        continue
    try:
        # on_bad_lines='skip' fixes the tokenizing error
        df = pd.read_csv(filepath, encoding='unicode_escape', on_bad_lines='skip')

        df = df.rename(columns={
            config['state_col']: 'state',
            config['year_col']: 'year',
            config['total_col']: 'total_cases'
        })

        keep_cols = ['state', 'year', 'total_cases']
        for extra in ['Group_Name', 'Sub_Group_Name', 'Subgroup']:
            if extra in df.columns:
                keep_cols.append(extra)

        df = df[[c for c in keep_cols if c in df.columns]].copy()
        df['crime_type'] = config['crime_type']
        df['state'] = df['state'].astype(str).str.strip().str.title()
        df['year'] = pd.to_numeric(df['year'], errors='coerce')
        df['total_cases'] = pd.to_numeric(df['total_cases'], errors='coerce').fillna(0).astype(int)
        df.dropna(subset=['state', 'year'], inplace=True)
        df = df[~df['state'].str.lower().isin(['total', 'grand total', 'nan', 'india', 'nat'])]
        df = df[df['total_cases'] >= 0]
        df['year'] = df['year'].astype(int)

        all_dfs.append(df)
        print(f"OK: {config['pattern']} -> {len(df)} rows")

    except Exception as e:
        print(f"ERROR: {config['pattern']} -> {e}")

merged = pd.concat(all_dfs, ignore_index=True)
print(f"\nTotal rows: {len(merged)}")
print(f"States: {merged['state'].nunique()}")
print(f"Crime types: {merged['crime_type'].unique().tolist()}")

merged.to_csv(output_path, index=False)
print(f"Saved to: {output_path}")
