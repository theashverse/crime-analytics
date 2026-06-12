from pymongo import MongoClient
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.preprocessing import MinMaxScaler
import numpy as np
import os

def get_clusters():
    # Connect to MongoDB
    client = MongoClient(os.environ.get('MONGO_URI', 'mongodb://localhost:27017/'))
    db = client['crime_db']
    collection = db['crimes']

    # Fetch data and close connection cleanly
    data = list(collection.find({}, {'_id': 0, 'state': 1, 'crime_type': 1, 'total_cases': 1}))
    client.close()

    if not data:
        return {}

    df = pd.DataFrame(data)

    # Total crimes per state
    state_totals = df.groupby('state')['total_cases'].sum().reset_index()
    state_totals.columns = ['state', 'total']

    # Pivot by crime type
    pivot = df.groupby(['state', 'crime_type'])['total_cases'].sum().unstack(fill_value=0)

    # Add total column and drop any potential NaN values safely
    pivot['total'] = state_totals.set_index('state')['total']
    pivot = pivot.fillna(0)

    # Sort by total — this is key
    pivot = pivot.sort_values('total', ascending=False)

    # Use MinMaxScaler — preserves relative magnitude
    scaler = MinMaxScaler()
    scaled = scaler.fit_transform(pivot)

    # K-Means
    kmeans = KMeans(n_clusters=4, random_state=42, n_init=10)
    labels = kmeans.fit_predict(scaled)
    pivot['cluster_raw'] = labels

    # Map clusters by total crime — highest total = cluster 0
    cluster_means = pivot.groupby('cluster_raw')['total'].mean().sort_values(ascending=False)
    cluster_rank_map = {old: new for new, old in enumerate(cluster_means.index)}
    pivot['cluster'] = pivot['cluster_raw'].map(cluster_rank_map)

    cluster_names = {
        0: 'High Crime',
        1: 'Medium-High Crime',
        2: 'Medium-Low Crime',
        3: 'Low Crime'
    }

    cluster_colors = {
        0: '#D85A30',
        1: '#EF9F27',
        2: '#7F77DD',
        3: '#1D9E75'
    }

    # 1. Initialize the 4 main group boxes exactly how React expects them
    grouped_result = {
        "0": {"name": cluster_names[0], "color": cluster_colors[0], "states": []},
        "1": {"name": cluster_names[1], "color": cluster_colors[1], "states": []},
        "2": {"name": cluster_names[2], "color": cluster_colors[2], "states": []},
        "3": {"name": cluster_names[3], "color": cluster_colors[3], "states": []}
    }

    # 2. Extract crime category columns dynamically (skipping administrative columns)
    crime_categories = [col for col in pivot.columns if col not in ['cluster', 'cluster_raw', 'total']]

    # 3. Populate the states directly into their respective cluster boxes
    for state, row in pivot.iterrows():
        cluster_id = int(row['cluster'])
        cluster_key = str(cluster_id)
        
        state_data = {
            'state': str(state),
            'totalCrimes': int(row['total']),
            'crimes': {
                category: int(row[category]) for category in crime_categories
            }
        }
        grouped_result[cluster_key]["states"].append(state_data)

    # 4. Sort the list of states inside each box using Python's correct 'reverse=True' parameter
    for cluster_key in grouped_result:
        grouped_result[cluster_key]["states"].sort(key=lambda x: x['totalCrimes'], reverse=True)

    return grouped_result