from src.MongoHandler.Handler import db

class UserRepository:
    def __init__(self):
        self.collection = db['users']

    async def get_user_by_email(self, email: str):
        return self.collection.find_one({"Email": email})

    async def get_user_by_username(self, username: str):
        return self.collection.find_one({"UserName": username})

    async def insert_user(self, user_data: dict):
        result = self.collection.insert_one(user_data)
        return str(result.inserted_id)