import json
from typing import Optional
from pymongo import MongoClient
from src.data_sources.base_data_source import BaseDataSource

class MongoDataSource(BaseDataSource):
    def __init__(self, uri: str, db_name: str):
        self.client = MongoClient(uri)
        self.db = self.client[db_name]

    def _get_string_content(self, collection_name: str, query: dict, default_msg: str) -> str:
        try:
            doc = self.db[collection_name].find_one(query)
            if doc:
                # If there's a 'content' field (likely for .txt, .csv, .md), use it
                if "content" in doc:
                    return str(doc["content"])
                
                # Otherwise, serialize the whole document (likely for .json-like data)
                # Remove _id if it's in there to avoid serialization issues or noise
                if "_id" in doc:
                    del doc["id"] # Some people use 'id'
                    if "_id" in doc: del doc["_id"]
                
                return json.dumps(doc, indent=2)
            return default_msg
        except Exception as e:
            return f"Error fetching from MongoDB ({collection_name}): {str(e)}"

    def get_market_benchmarks(self, department: str) -> str:
        return self._get_string_content(
            "market", 
            {"department": department},
            f"WARNING: Specific industry benchmarks for department '{department}' were NOT FOUND. Analysis must be conducted using only the contract data provided. Confidence in benchmarking context is LOW."
        )

    def get_performance_history(self, contract_id: str) -> str:
        return self._get_string_content(
            "performance", 
            {"contract_id": contract_id},
            "No historical performance data found."
        )

    def get_past_reviews(self, contract_id: str) -> str:
        return self._get_string_content(
            "reviews", 
            {"contract_id": contract_id},
            "No past reviews found."
        )

    def get_detailed_incidents(self, contract_id: str) -> str:
        return self._get_string_content(
            "incidents", 
            {"contract_id": contract_id},
            "No detailed incident reports found."
        )

    def list_contracts(self) -> list:
        # Fetching from 'contracts' collection
        return list(self.db.contracts.find({}, {"_id": 0}))
