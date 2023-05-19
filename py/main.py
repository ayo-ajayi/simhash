from flask import Flask, request, jsonify
import pandas as pd
import re, hashlib, math, time
from random import randint, seed
from shingler import shingler
from lsh import *
from pymongo import MongoClient
import os

seed(1631996)

def sig_matrix(texts, target_text):
	# Create an instance of the shingler class with desired shingle size
	shingler_instance = shingler(k=8)

    #Create the signature matrix
	signature_matrix = []
	for text in texts:
		shingles = shingler_instance.get_shingles(text)
		hashed_shingles = shingler_instance.get_hashed_shingles(shingles)
		signature_matrix.append(hashed_shingles)

	shingles = shingler_instance.get_shingles(target_text)
	hashed_shingles = shingler_instance.get_hashed_shingles(shingles)
	signature_matrix.append(hashed_shingles)
	return signature_matrix

def compute_lsh(signature_matrix, bands_nr = 10, signature_size = 50):
	lsh_instance = lsh(threshold=0.8)
	start_time = time.time()
	
	print("Computing LSH similarity...")
	
	lsh_similar_itemset = len(lsh_instance.get_similar_items(signature_matrix, bands_nr, signature_size))
	end_time = time.time()
	lsh_computation_time = end_time - start_time
	
	print("LSH Similarity computed in:\t %.2f seconds.\nSimilar Elements Found: %d" %(lsh_computation_time, lsh_similar_itemset))

	return (lsh_computation_time, lsh_similar_itemset)


# Establish a connection to MongoDB
client = MongoClient(os.environ.get("MONGODB_URL"))

# Ping the database
try:
    response = client.admin.command('ping')
    if response['ok'] == 1:
        print("Ping successful!")
    else:
        print("Ping failed.")
except Exception as e:
    print("Error:", str(e))

# Access the target database and collection
db = client['simhash']
collection = db['Content']

# Retrieve all documents in the collection
results = collection.find()

# Retrieve documents with 'Subject' field
documents = collection.find({'Subject': {'$exists': True}})

# Create a list of texts
texts = [document['Subject'] for document in documents if 'Subject' in document]

# Close the MongoDB connection
client.close()

app = Flask(__name__)

#Expected JSON input
#{
#  "target_text": "text_to_be_detected"
#}


@app.route('/detect-similarity', methods=['POST'])
def detect_similarity():
	data = request.get_json()
	target_text = data.get('target_text', '')
	time, similar_items = compute_lsh(sig_matrix(texts, target_text))
	if(similar_items > 0):
		results = "LSH Similarity computed in:\t %.2f seconds.\nSimilar Elements Found: %d" %(lsh_computation_time,lsh_similar_itemset)
	else:
		results = "We did not detect any similar items in our database."
    # Placeholder response
	response = {'response' : results
	}
	return jsonify(response)

if __name__ == '__main__':
	app.run(5000)
