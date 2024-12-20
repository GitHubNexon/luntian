# train.py
import os
from ultralytics import YOLO

# Variable for dataset name
dataset_name = "cropV1"
dataset_dir = f"OnlineDataset/{dataset_name}"

# Updated path to the YAML file (the dataset configuration file)
data_yaml = r"C:\4th Year\Thesis-Projects\YoloV8\ultralytics\OnlineDataset\cropV1\plante-2\data.yaml"

# Ensure that the dataset is available
if not os.path.exists(data_yaml):
    raise FileNotFoundError(f"Dataset YAML file not found at {data_yaml}")

# Load the YOLOv8 model (pre-trained on COCO)
model = YOLO('yolov8n.pt')  

# Path to save the trained model and results
save_path = r"C:\4th Year\Thesis-Projects\YoloV8\ultralytics\runs\CropV1Trained"

# Train the model
model.train(
    data=data_yaml,         # Path to the dataset YAML file
    # epochs=50,            # Number of epochs to train
    epochs=10,              # Number of epochs to train --testing
    # imgsz=640,            # Image size for training
    imgsz=416,              # Image size for training --testing
    # batch=16,             # Batch size (adjust based on your system's memory)
    batch=8,                # Batch size (adjust based on your system's memory) --testing
    project=save_path,      # Custom path for saving results
    augment=True,
    weight_decay=0.0005,    # Regularization (to prevent overfitting)
    warmup_epochs=3,        # Warmup epochs (helps stabilize early training)
    name='cropV1',          # Name for the saved model

    patience=3,             # If no improvement in validation mAP after 3 epochs, stop training
    # save_period=3,        # Save the model every 2 epochs (you can adjust this)
    # device='0'            # Explicitly use GPU (if available)
    # device='cpu'          # using the CPU 
)

print(f"Training completed for {dataset_name}!")
