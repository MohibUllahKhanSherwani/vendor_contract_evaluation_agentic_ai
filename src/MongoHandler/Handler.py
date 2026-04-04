import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()
MONGO_URI = os.getenv("MONGO_URI")

class MongoHandler:
    def __init__(self):
        self.client = MongoClient(MONGO_URI)
        self.db = self.client["contract_eval_agents"]
    
    def get_db(self):
        return self.db

mongo_handler = MongoHandler()
db = mongo_handler.get_db()