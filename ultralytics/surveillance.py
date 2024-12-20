import cv2
from ultralytics import YOLO
import time
import argparse
import os

# Initialize the argument parser
parser = argparse.ArgumentParser(description='Select video input source')
parser.add_argument('--source', type=str, default='webcam', choices=['webcam', 'video', 'mobile'], help="Choose input source: 'webcam', 'video', 'mobile'")
parser.add_argument('--video_file', type=str, default='', help="Path to video file (only needed if source is 'video')")
args = parser.parse_args()

save_dir = r"C:\4th Year\Thesis-Projects\YoloV8\ultralytics\results\Surveillance-Results"
os.makedirs(save_dir, exist_ok=True)

mobile_cam_URL = 'http://192.168.0.151:4747/video'

# Function to get an incremental filename
def get_incremental_filename(base_path, base_name, extension):
    i = 1
    while True:
        filename = f"{base_name}{i}{extension}"
        if not os.path.exists(os.path.join(base_path, filename)):
            return os.path.join(base_path, filename)
        i += 1

output_file = get_incremental_filename(save_dir, "Surveillance-Results", ".avi")

# YOLOv8 model
model = YOLO('yolov8n.pt')  

if args.source == 'webcam':
    cap = cv2.VideoCapture(0)  
elif args.source == 'video':
    if not args.video_file:
        raise ValueError("You must specify a video file path when source is 'video'.")
    cap = cv2.VideoCapture(args.video_file)  # Video file input
elif args.source == 'mobile':
    cap = cv2.VideoCapture(mobile_cam_URL)  # Assuming DroidCam or other mobile camera is the second camera device

# Get the frame width and height for saving the video
frame_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
frame_height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
fps = int(cap.get(cv2.CAP_PROP_FPS)) if cap.get(cv2.CAP_PROP_FPS) > 0 else 30

# Initialize the VideoWriter
fourcc = cv2.VideoWriter_fourcc(*'XVID')
out = cv2.VideoWriter(output_file, fourcc, fps, (frame_width, frame_height))

# Store detection times and tracking data
detection_times = {}  # Stores the start time for each detected person
tracking_data = {}  # Stores the center of detected objects to track them across frames
max_inactive_time = 3  
distance_threshold = max(frame_width, frame_height) * 0.05  #~5% of frame size for pixels and resolution
confidence_threshold = 0.4  # for balancinf of false positive


# People counter
people_count = 0 
active_person_ids = set()  # Tracks currently active person IDs
def get_bounding_box_center(x1, y1, x2, y2):
    return (int((x1 + x2) / 2), int((y1 + y2) / 2))

def calculate_distance(center1, center2):
    return ((center1[0] - center2[0]) ** 2 + (center1[1] - center2[1]) ** 2) ** 0.5

while True:
    ret, frame = cap.read()
    if not ret:
        break

    results = model(frame)

    boxes = results[0].boxes  
    labels = boxes.cls 
    confidences = boxes.conf 

    current_time = time.time()
    detected_person_ids = set() 
    person_center_positions = {}  

    for i, label in enumerate(labels):
        if label == 0:  
            xyxy = boxes[i].xyxy[0]  
            x1, y1, x2, y2 = xyxy.cpu().numpy()  

            score = confidences[i] 
            if score < confidence_threshold:  # Ignore low-confidence detections
                continue

            x1, y1, x2, y2 = map(int, [x1, y1, x2, y2])

            center = get_bounding_box_center(x1, y1, x2, y2)
            person_center_positions[center] = (x1, y1, x2, y2, score)

            matched = False
            for tracked_center in list(tracking_data.keys()):
                distance = calculate_distance(center, tracked_center)
                if distance < distance_threshold: 
                    person_id = tracking_data[tracked_center]
                    matched = True
                    break

            if not matched:
                person_id = f'{center[0]}_{center[1]}'
                tracking_data[center] = person_id
                detection_times[person_id] = current_time  
        
                if person_id not in active_person_ids:  
                    active_person_ids.add(person_id)
                    people_count += 1
        
            elapsed_time = current_time - detection_times[person_id]
            elapsed_minutes = int(elapsed_time // 60)
            elapsed_seconds = int(elapsed_time % 60)
            time_str = f'TIME: {elapsed_minutes}:{elapsed_seconds:02d}'

            label_text = f'PERSON {score:.2f} {time_str}'
            cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
            cv2.putText(frame, label_text, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

            detected_person_ids.add(person_id)

    inactive_ids = [person_id for person_id in detection_times if person_id not in detected_person_ids]
    for person_id in inactive_ids:
        if current_time - detection_times[person_id] > max_inactive_time:
            del detection_times[person_id] 
            if person_id in active_person_ids:
                    active_person_ids.remove(person_id)
                    people_count = max(0, people_count - 1) 

    tracking_data = {center: person_id for center, person_id in tracking_data.items() if person_id in detected_person_ids}

    cv2.putText(frame, f'PEOPLE COUNT: {people_count}', (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 1)

    # Save the processed frame
    out.write(frame)

    # Display the frame with detections
    cv2.imshow('Surveillance Feed', frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
out.release()
print(f"Video successfully saved at: {output_file}")
cv2.destroyAllWindows()


# SCRIPTS TO RUN IT

# python surveillance.py --source webcam
# python surveillance.py --source video --video_file path_to_video.mp4
# python surveillance.py --source mobile
