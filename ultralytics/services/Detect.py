import cv2
import sys
import os
import base64
import numpy as np
import threading
import time
from ultralytics import YOLO
from models.yolo_V8_model import YoloV8Model  # Adjust import path if necessary
from datetime import datetime
from flask import Response, stream_with_context

base_dir = os.path.dirname(os.path.abspath(__file__))

root_dir = os.path.abspath(os.path.join(base_dir, "..", ".."))

model_path = os.path.join(
    root_dir, "runs", "detect", "train", "weights", "best.pt"
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


# Global variables
live_detection_active = False
capture_thread = None
latest_frame = None
latest_detections = []


def detect_from_live():
    """Runs live object detection and updates frames."""
    global live_detection_active, latest_frame, latest_detections
    # Open the webcam
    # Try opening /dev/video0 first
    cap = cv2.VideoCapture(0)

    # If /dev/video0 fails, try /dev/video1
    if not cap.isOpened():
      cap = cv2.VideoCapture(1)

    while live_detection_active:
        ret, frame = cap.read()
        if not ret:
            print("Failed to capture frame")
            break
        
        fps = 20
        frame_count = 0
        target_fps = 20
        frame_interval = int(fps / target_fps)

        
        start_time = time.time()

        if frame_count % frame_interval == 0:
            results = model(frame)
            result = results[0]
            frame = result.plot()
            
        frame_count += 1
        
        elapsed_time = time.time() - start_time
        fps_display = 1.0 / elapsed_time  # FPS
        ms_display = elapsed_time * 1000  # MS


        # Get the frame width and height
        frame_height, frame_width = frame.shape[:2]

        
        text_position_fps = (frame_width - 200, 30)
        text_position_ms = (frame_width - 200, 70)

        # Display FPS and MS on the frame
        font = cv2.FONT_HERSHEY_SIMPLEX
        font_scale = 0.7  
        color = (0, 255, 0)  
        thickness = 2  
        # Draw FPS and MS on the frame
        cv2.putText(frame, f"FPS: {fps_display:.2f}", text_position_fps, font, font_scale, color, thickness, cv2.LINE_AA)
        cv2.putText(frame, f"MS: {ms_display:.2f}ms", text_position_ms, font, font_scale, color, thickness, cv2.LINE_AA)

        # Perform detection on the frame
        results = model(frame)
        result = results[0] if isinstance(results, list) else results

        # Update latest frame and detections
        latest_frame = frame
        latest_detections = [result.names[int(box[5])] for box in result.boxes.data]

        # Annotate the frame
        annotated_frame = result.plot() if hasattr(result, "plot") else frame
        latest_frame = annotated_frame  # Store the latest annotated frame

    cap.release()

def start_live_detection():
    """Starts live detection in a separate thread."""
    global live_detection_active, capture_thread
    if not live_detection_active:
        live_detection_active = True
        capture_thread = threading.Thread(target=detect_from_live)
        capture_thread.start()
        return {"status": "success", "message": "Live detection started"}
    else:
        return {"status": "error", "message": "Live detection is already active"}

def stop_live_detection():
    """Stops the live detection thread."""
    global live_detection_active, capture_thread
    if live_detection_active:
        live_detection_active = False
        capture_thread.join()
        return {"status": "success", "message": "Live detection stopped"}
    else:
        return {"status": "error", "message": "Live detection is not active"}

def get_latest_detections():
    """Returns the latest frame and detected objects as base64."""
    global latest_frame, latest_detections
    if latest_frame is not None:
        _, buffer = cv2.imencode(".jpg", latest_frame)
        base64_frame = base64.b64encode(buffer).decode("utf-8")
        return {"status": "success", "frame": base64_frame, "detections": latest_detections}
    else:
        return {"status": "error", "message": "No frame available"}

def video_feed():
    """Streams the latest frames."""
    def generate():
        global latest_frame
        while live_detection_active:
            if latest_frame is not None:
                _, buffer = cv2.imencode(".jpg", latest_frame)
                frame_bytes = buffer.tobytes()
                yield (b"--frame\r\n"
                       b"Content-Type: image/jpeg\r\n\r\n" + frame_bytes + b"\r\n")
            time.sleep(0.03)  # Prevent excessive looping (30 FPS max)
    
    return Response(generate(), mimetype="multipart/x-mixed-replace; boundary=frame")
