import time
from random import randint, seed
from shingler import shingler
from lsh import *
import pandas as pd
from fastapi import FastAPI
from pymongo import MongoClient
import os
from dotenv import load_dotenv
from bson.objectid import ObjectId

load_dotenv()

seed(1631996)


def sig_matrix(texts, target_text):
    # Create an instance of the shingler class with desired shingle size
    shingler_instance = shingler(k=8)

# Create the signature matrix
    signature_matrix = []
    for text in texts:
        shingles = shingler_instance.get_shingles(text)
        hashed_shingles = shingler_instance.get_hashed_shingles(shingles)
        signature_matrix.append(hashed_shingles)

    shingles = shingler_instance.get_shingles(target_text)
    hashed_shingles = shingler_instance.get_hashed_shingles(shingles)
    signature_matrix.append(hashed_shingles)
    return signature_matrix


def compute_lsh(signature_matrix, bands_nr=10, signature_size=50):
    lsh_instance = lsh(threshold=0.8)
    start_time = time.time()

    print("Computing LSH similarity...")

    lsh_similar_itemset = len(lsh_instance.get_similar_items(
        signature_matrix, bands_nr, signature_size))
    end_time = time.time()
    lsh_computation_time = end_time - start_time

    print("LSH Similarity computed in:\t %.2f seconds.\nSimilar Elements Found: %d" % (
        lsh_computation_time, lsh_similar_itemset))

    return (lsh_computation_time, lsh_similar_itemset)


mongourl = os.getenv("MONGODB_URL")
client = MongoClient(mongourl)


try:
    response = client.admin.command('ping')
    if response['ok'] == 1:
        print("Ping successful!")
    else:
        print("Ping failed.")
except Exception as e:
    print("Error:", str(e))

db = client['simhash']
collection = db['Content']

results = collection.find()
documents = collection.find({'Subject': {'$exists': True}})
texts = [document['Subject']
         for document in documents if 'Subject' in document]


app = FastAPI()


@app.on_event("startup")
async def startup_event():
    global client
    client = MongoClient(mongourl)


@app.on_event("shutdown")
async def shutdown_event():
    client.close()


@app.get("/")
async def root():
    return {"message": "hello world"}


@app.get("/detect-similarity/{item_id}")
async def read_item(item_id: str):
    id = ObjectId(item_id)
    target = collection.find_one({'_id': id})
    target['_id'] = str(target['_id'])
    target_text = target["Text"]
    time, similar_items = compute_lsh(sig_matrix(texts, target_text))
    return {'response': {
        'time': time,
        'similar_items': similar_items
    }}
