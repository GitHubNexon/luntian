import os
from dotenv import load_dotenv
from datetime import datetime
from pymongo import MongoClient
import pytz

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")

# MongoDB client setup
client = MongoClient(MONGODB_URI)
db = client.get_database()
collection = db["yolo_v8_detection"]

philippines_tz = pytz.timezone("Asia/Manila")


class YoloV8Model:
    def __init__(self, images=None, description=None, details=None, image_result=None):
        if not images:
            raise ValueError("Images is a required field.")
        if description is None:
            raise ValueError("Description is a required field.")

        self.images = images if images else []
        self.description = description if description else ""
        self.details = details if details else []
        self.image_result = image_result if image_result else [{"info": "", "count": 0}]

    def save(self):
        timestamp = datetime.now(philippines_tz)

        # Wrapping each image as an object with 'data' and 'date'
        image_objects = []
        for image in self.images:
            date_value = image.get("date", datetime.now(philippines_tz))

            # If date_value is a string, convert to datetime and adjust timezone
            if isinstance(date_value, str):
                date_value = datetime.fromisoformat(date_value)
                date_value = date_value.astimezone(philippines_tz)
            
            # Ensure date_value is always timezone-aware
            elif date_value.tzinfo is None:
                date_value = philippines_tz.localize(date_value)

            image_objects.append(
                {
                    "data": image.get("data"), 
                    "date": timestamp,
                }
            )

        # Document to insert into MongoDB
        document = {
            "images": image_objects,  
            "description": self.description,
            "details": self.details,
            "created_at": timestamp,
            "updated_at": timestamp,
            "image_result": self.image_result,
            "--v": 0,
        }

        result = collection.insert_one(document)
        return result.inserted_id
