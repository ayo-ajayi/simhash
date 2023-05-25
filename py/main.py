from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
import os
from dotenv import load_dotenv
from bson.objectid import ObjectId
from compute import sig_matrix, compute_lsh
from pydantic import BaseSettings

load_dotenv()
class Settings(BaseSettings):
    openapi_url: str="/openapi.json"
settings = Settings()
app = FastAPI(openapi_url=settings.openapi_url)
origins =[
    "http://localhost:3000",
    "https://simhash-web.onrender.com"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET"],
    allow_headers=["*"],
)
@app.on_event("startup")
async def startup_event():
    mongourl = os.getenv("MONGODB_URL")
    global client
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
    global collection
    collection = db['Content']

    documents = collection.find({'Subject': {'$exists': True}})
    global texts
    texts = [document['Text']
            for document in documents if 'Subject' in document]


@app.on_event("shutdown")
async def shutdown_event():
    client.close()


@app.get("/")
async def root():
    return {"message": "hello world"}


@app.get("/detect-similarity/{item_id}")
async def read_item(item_id: str):
    if len(item_id) != 24:
        raise HTTPException(status_code=400, detail={
            'error':"invalid id"
        })
    id = ObjectId(item_id)
    target = collection.find_one({'_id': id})
    if target == None:
        raise HTTPException(status_code=404, detail={
            'error':"item with id not found"
        })
    target['_id'] = str(target['_id'])
    target_text = target["Text"]
    try:
        time, similar_items = compute_lsh(sig_matrix(texts, target_text))
    except Exception as e:
        print("Error:", str(e))
        raise HTTPException(status_code=404, detail={
            'error': str(e)
        })
    return {'response': {
        'time': time,
        'similar_items': similar_items
    }}
