from models.yolo_V8_model import YoloV8Model  # Adjust import path if necessary
from datetime import datetime

class YoloV8Controller:
    @staticmethod
    def create_detection(data):
        try:
            
            # Create a new YoloV8Model instance
            detection = YoloV8Model(
                image=data['image'],
                description=data['description'],
                details=data.get('details', []),
                date=data.get('date', datetime.now())
            )

            # Save the detection to MongoDB
            detection.save()

            return {
                "message": "Detection saved successfully",
                "status" : "success",
            }

        except Exception as e:
            return {"error": str(e)}

