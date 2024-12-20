import os
from roboflow import Roboflow
import shutil

# Variable for the dataset
dataset_name = "cropV1"
dataset_dir = f"OnlineDataset/{dataset_name}"

# Ensure the folder exists
os.makedirs(dataset_dir, exist_ok=True)

# Download the dataset from Roboflow
rf = Roboflow(api_key="6RQvKj2kNvy7f4t3M1f6")
project = rf.workspace("project-ekn7w").project("plante-ommko")
version = project.version(2)
dataset = version.download("yolov8")

# Move the downloaded dataset to the desired location
# The downloaded dataset is typically stored in the `Roboflow` directory by default
downloaded_path = dataset.location  # Path where the dataset was downloaded to by Roboflow

# Move the contents to OnlineDataset/cropV1
shutil.move(downloaded_path, dataset_dir)

print(f"Dataset {dataset_name} downloaded and moved to {dataset_dir}")
