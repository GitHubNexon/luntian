import cv2
import sys
import os
import base64
import numpy as np
from ultralytics import YOLO
from models.yolo_V8_model import YoloV8Model  # Adjust import path if necessary
from datetime import datetime

# Define the base directory relative to the current script
base_dir = os.path.dirname(os.path.abspath(__file__))

# Move one level up to access the `runs` folder outside the `app` folder
root_dir = os.path.abspath(os.path.join(base_dir, "..", ".."))

# Load the trained model from the correct path
model_path = os.path.join(
    root_dir, "runs", "CropV1Trained", "cropV1", "weights", "best.pt"
)
model = YOLO(model_path)


def decode_base64_image(base64_string):
    """Decodes a Base64 string into an OpenCV image."""
    try:
        decoded_data = base64.b64decode(base64_string)
        np_data = np.frombuffer(decoded_data, np.uint8)
        image = cv2.imdecode(np_data, cv2.IMREAD_COLOR)
        if image is None:
            raise ValueError("Decoded image is None.")
        return image
    except Exception as e:
        raise ValueError(f"Error decoding Base64 image: {e}")


def detect_from_image(image_data, is_base64=False):
    try:
        if is_base64:
            image = decode_base64_image(image_data)
        else:
            if not os.path.isfile(image_data):
                raise FileNotFoundError(f"Image file not found: {image_data}")
            image = cv2.imread(image_data)

        if image is None:
            raise ValueError("Unable to load the image.")

        # Perform detection
        results = model(image)

        if isinstance(results, list):
            result = results[0]
        else:
            result = results
            
        # Initialize an empty dictionary to track detected classes and their counts
        class_count = {}

        # Access detection boxes and class names
        for box in result.boxes.data:  # Each box contains the detected object info
            class_id = int(box[5])  # Class index
            class_name = result.names[class_id]  # Get class name by index
            if class_name in class_count:
                class_count[class_name] += 1  # Increment count for class
            else:
                class_count[class_name] = 1  # Initialize count for new class

        # Format the detected classes as objects with 'info' and 'count'
        detected_classes = [
            {'info': class_name, 'count': count}
            for class_name, count in class_count.items()
        ]

        # Handle case where no detections are found (detected_classes will be empty)
        if not detected_classes:
            detected_classes = []
        
        
        # Annotate the image (if needed)
        annotated_image = result.plot() if hasattr(result, "plot") else image

        # # Save the annotated image
        # timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        # output_image_path = os.path.join(root_dir, "detected_images", f"detected_{timestamp}.png")
        # os.makedirs(os.path.dirname(output_image_path), exist_ok=True)
        # cv2.imwrite(output_image_path, annotated_image)

        # Optional: Convert the saved image back to base64 for further use if required
        _, buffer = cv2.imencode('.png', annotated_image)
        base64_result = base64.b64encode(buffer).decode('utf-8')

        # # Optional: Display the image for debugging
        # cv2.imshow("Crop Detection - Image", annotated_image)
        # cv2.waitKey(1)  # Adjust waitKey for debugging
        # cv2.destroyAllWindows()

        print(f"Detection results: {results}")
        print(f"Detection results info: {detected_classes}")
        return base64_result, detected_classes 

    except Exception as e:
        print(f"Error during detection: {e}")
        raise



