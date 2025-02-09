from models.yolo_V8_model import YoloV8Model  # Adjust import path if necessary
from datetime import datetime
from bson import ObjectId
from flask import jsonify
from pymongo import MongoClient
import os
from dotenv import load_dotenv
from services.detection_services import detect_from_image
from services.detection_services import (
    start_live_detection,
    stop_live_detection,
    video_feed,
)
import pytz
import cv2
import threading
import base64

philippines_tz = pytz.timezone("Asia/Manila")


load_dotenv()
MONGODB_URI = os.getenv("MONGODB_URI")

# MongoDB client setup
client = MongoClient(MONGODB_URI)
db = client.get_database()
collection = db["yolo_v8_detection"]

# base64 encoder


# Utility function to convert all ObjectId fields to strings
def convert_objectid_to_string(doc):
    """Recursively converts ObjectId fields to string in the document."""
    if isinstance(doc, dict):
        return {k: convert_objectid_to_string(v) for k, v in doc.items()}
    elif isinstance(doc, list):
        return [convert_objectid_to_string(item) for item in doc]
    elif isinstance(doc, ObjectId):
        return str(doc)
    return doc


class YoloV8Controller:
    @staticmethod
    def create_detection(data):
        try:
            # Check if 'images' is provided and is a list of dictionaries with 'data' and 'date'
            if not isinstance(data["images"], list):
                raise ValueError("The 'images' field must be an array of objects.")

            images = []
            for img in data["images"]:
                if not isinstance(img, dict) or "data" not in img:
                    raise ValueError(
                        "Each image must be an object with a 'data' field."
                    )

            # Decode date
            date_value = img.get("date", datetime.now(philippines_tz))
            if isinstance(date_value, str):
                date_value = datetime.fromisoformat(date_value)
            date_value = date_value.astimezone(philippines_tz)
            print(date_value)

            # Perform detection
            base64_data = img["data"]
            # detection_results = detect_from_image(base64_data, is_base64=True)
            detection_results, detected_classes = detect_from_image(
                base64_data, is_base64=True
            )

            images.append(
                {
                    "data": detection_results,
                    "date": date_value,
                }
            )

            # Create a new YoloV8Model instance
            detection = YoloV8Model(
                images=images,
                description=data["description"],
                details=data.get("details", []),
                image_result=detected_classes,
            )

            # Save the detection to MongoDB
            detection.save()

            return {
                "message": "Detection saved successfully",
                "status": "success",
            }

        except Exception as e:
            return {"error": str(e)}

    @staticmethod
    def update_detection_byId(detection_id, data):
        try:
            # Ensure the detection_id is valid
            if not ObjectId.is_valid(detection_id):
                return ({"status": "error", "message": "Invalid detection_id format"},)

            # Prepare the update data
            update_data = {}

            # Handle 'image' field as an array of objects with 'data' and 'date'
            if "images" in data:
                # Ensure 'image' is a list of objects with 'data' and 'date'
                if not isinstance(data["images"], list):
                    return (
                        {
                            "status": "error",
                            "message": "'image' must be an array of objects with 'data' and 'date'",
                        },
                    )
                images = []
                for img in data["images"]:
                    if not isinstance(img, dict) or "data" not in img:
                        return (
                            {
                                "status": "error",
                                "message": "Each image object must contain 'data' field",
                            },
                        )

                    # Ensure the 'date' is stored as a datetime object
                    date_value = img.get("date", datetime.now())
                    if isinstance(date_value, str):
                        # If the date is a string, convert it to a datetime object
                        date_value = datetime.fromisoformat(
                            date_value.replace("Z", "+16:00:00")
                        )
                    # Append the image object with 'data' and 'date'
                    images.append(
                        {
                            "data": img["data"],
                            # "date": date_value,
                        }
                    )
                update_data["images"] = images

            # Handle other fields ('description', 'details', 'date')
            if "description" in data:
                update_data["description"] = data["description"]
            if "details" in data:
                update_data["details"] = data["details"]
            if "updated_at" in data:
                update_data["updated_at"] = data["updated_at"]
            else:
                update_data["updated_at"] = datetime.now(philippines_tz)
            if "--v" in data:
                update_data["--v"] = 1  # Set the increment value to 1

            # If no fields to update, return an error
            if not update_data:
                return ({"status": "error", "message": "No fields to update"},)

            # Update the document in MongoDB
            result = collection.update_one(
                {"_id": ObjectId(detection_id)},
                {"$inc": {"--v": update_data.get("--v", 1)}, "$set": update_data},
            )

            # Check if the document was found and updated
            if result.matched_count == 0:
                return ({"status": "error", "message": "Detection not found"},)

            return {
                "message": "Detection updated successfully",
                "status": "success",
            }

        except Exception as e:
            return ({"status": "error", "message": str(e)},)

    @staticmethod
    def get_detection_byId(detection_id):
        try:
            # Ensure the detection_id is valid
            if not ObjectId.is_valid(detection_id):
                return ({"status": "error", "message": "Invalid detection_id format"},)

            # Find the detection by ID
            detection = collection.find_one({"_id": ObjectId(detection_id)})

            if not detection:
                return ({"status": "error", "message": "Detection not found"},)

            # Format the response as needed (excluding _id from the response)
            detection["_id"] = str(detection["_id"])
            return {
                "message": "Detection get successfully",
                "status": "success",
                "data": detection,
            }

        except Exception as e:
            return ({"status": "error", "message": str(e)},)

    @staticmethod
    def get_all_detections(
        page=1, limit=10, keyword="", sortBy="date", sortOrder="asc"
    ):
        try:
            # Prepare the query with the keyword search
            query = {}
            if keyword:
                query = {
                    "$or": [
                        {"image": {"$regex": keyword, "$options": "i"}},
                        {"details": {"$regex": keyword, "$options": "i"}},
                    ]
                }

            # Sort criteria and order
            sort_order = 1 if sortOrder == "asc" else -1
            sort_criteria = {sortBy: sort_order}

            # Calculate pagination
            total_items = collection.count_documents(query)
            data = (
                collection.find(query)
                .sort(sort_criteria)
                .skip((page - 1) * limit)
                .limit(limit)
            )

            # Convert the results into a list and format _id as string
            data = [convert_objectid_to_string(detection) for detection in data]

            return {
                "status": "success",
                "currentPage": page,
                "totalItems": total_items,
                "totalPages": (total_items // limit)
                + (1 if total_items % limit > 0 else 0),
                "data": data,
            }

        except Exception as e:
            return ({"status": "error", "message": str(e)},)

    @staticmethod
    def delete_detection_byId(detection_id):
        try:
            # Ensure the detection_id is valid
            if not ObjectId.is_valid(detection_id):
                return {"status": "error", "message": "Invalid detection_id format"}

            # Attempt to delete the document
            result = collection.delete_one({"_id": ObjectId(detection_id)})

            # Check if the document was deleted
            if result.deleted_count == 0:
                return {"status": "error", "message": "Detection not found"}

            return {"message": "Detection deleted successfully", "status": "success"}

        except Exception as e:
            return {"status": "error", "message": str(e)}

    @staticmethod
    def start_live_detection():
        try:
            response = start_live_detection()
            return response
        except Exception as e:
            return {"status": "error", "message": str(e)}

    @staticmethod
    def stop_live_detection():
        try:
            response = stop_live_detection()
            return response
        except Exception as e:
            return {"status": "error", "message": str(e)}

    @staticmethod
    def video_feed():
        try:
            return video_feed()
        except Exception as e:
            return {"status": "error", "message": str(e)}
