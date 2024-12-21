import os
from dotenv import load_dotenv
from datetime import datetime
from pymongo import MongoClient

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")

# MongoDB client setup
client = MongoClient(MONGODB_URI)
db = client.get_database()  
collection = db["yolo_v8_detection"]

class YoloV8Model:
    def __init__(self, image=None, date=None, description=None, details=None):
        
        if image is None:
            raise ValueError("Image is a required field.")
        if description is None:
            raise ValueError("Description is a required field.")
        if date is None:
            raise ValueError("Date is a required field.")
        
        self.image = image if image else []
        self.date = date if date else datetime.now()
        self.description = description if description else ""
        self.details = details if details else []

    def save(self):
        document = {
            "image": self.image,
            "date": self.date,
            "description": self.description,
            "details": self.details,
        }
        result = collection.insert_one(document)
        return result.inserted_id
