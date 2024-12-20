import cv2
from ultralytics import YOLO 

# Load the YOLOv8 model
model = YOLO("yolov8n.pt")  # Replace with your desired model
results = model.predict(source="0", show=True) # Accepts all formats img/folder/vid.

print(results) # prints the results of every detection
