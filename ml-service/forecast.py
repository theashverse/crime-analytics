from prophet import Prophet
import pandas as pd
from pymongo import MongoClient
import os

def get_forecast(state=None, crime_type=None, periods=3):
    # Connect to MongoDB
    client = MongoClient(os.environ.get('MONGO_URI', 'mongodb://localhost:27017/'))
    db = client['crime_db']
    collection = db['crimes']

    # Build filter
    match = {}
    if state:
        match['state'] = state
    if crime_type:
        match['crime_type'] = crime_type

    # Aggregate by year
    pipeline = [
        { '$match': match },
        { '$group': { '_id': '$year', 'total': { '$sum': '$total_cases' } } },
        { '$sort': { '_id': 1 } }
    ]

    data = list(collection.aggregate(pipeline))
    client.close()

    if len(data) < 3:
        return None

    # Convert to Prophet format
    df = pd.DataFrame(data)
    df = df.rename(columns={'_id': 'ds', 'total': 'y'})
    df['ds'] = pd.to_datetime(df['ds'], format='%Y')

    # Train Prophet model
    model = Prophet(
        yearly_seasonality=False,
        weekly_seasonality=False,
        daily_seasonality=False,
        changepoint_prior_scale=0.1
    )
    model.fit(df)

    # Make future predictions
    future = model.make_future_dataframe(periods=periods, freq='YE')
    forecast = model.predict(future)

    # Combine historical + forecast
    result = []
    for _, row in forecast.iterrows():
        year = row['ds'].year
        historical = next((d['total'] for d in data if d['_id'] == year), None)
        result.append({
            'year': year,
            'actual': historical,
            'predicted': round(row['yhat']),
            'lower': round(row['yhat_lower']),
            'upper': round(row['yhat_upper']),
            'isForecast': historical is None
        })

    return result