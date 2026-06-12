import pandas as pd
from pymongo import MongoClient
import os

dataset_folder = os.getcwd()
csv_path = os.path.join(dataset_folder, 'crime_clean.csv')


from urllib.parse import quote_plus

client = MongoClient(os.environ.get('MONGO_URI', 'mongodb://localhost:27017/'))
db = client['crime_db']
collection = db['crimes']

df = pd.read_csv(csv_path)
df = df.where(pd.notnull(df), None)
records = df.to_dict('records')

collection.delete_many({})
result = collection.insert_many(records)
print(f"Inserted: {len(result.inserted_ids)} documents")

collection.create_index('state')
collection.create_index('year')
collection.create_index('crime_type')
collection.create_index([('state', 1), ('year', 1), ('crime_type', 1)])
print("Indexes created")

print(f"Total in DB: {collection.count_documents({})}")
print(f"Sample: {collection.find_one({}, {'_id': 0})}")
client.close()
print("Done!")