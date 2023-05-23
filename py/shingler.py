import re

class shingler:
    def __init__(self, k):
        
        if k > 0:
            self.k = int(k)
        else:
            self.k = 10
        
    #inner class utility
    def process_doc(self, document):
        return re.sub("( )+|(\n)+"," ",document).lower()
    
    def get_shingles(self, document):
        shingles = set()
        document= self.process_doc(document)
        for i in range(0, len(document)-self.k+1 ):
            shingles.add(document[i:i+self.k])
        return shingles
    
    def get_k(self):
        return self.k
    
    #return sorted hash
    def get_hashed_shingles(self, shingles_set):
        hash_function = hashFamily(0)
        return sorted( {hash_function.get_hash_value(s) for s in shingles_set} )
