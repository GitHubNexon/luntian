import cv2
import sys
import os
import time
from ultralytics import YOLO
import mobile  


print("Arguments passed to script:", sys.argv)
# Define the base directory relative to the current script
base_dir = os.path.dirname(os.path.abspath(__file__))

# Load the trained model
# model_path = r"C:\4th Year\Thesis-Projects\YoloV8\ultralytics\runs\CropV1Trained\cropV1\weights\best.pt"
# model_path = os.path.join(base_dir,"runs", "CropV1Trained", "cropV1", "weights", "best.pt")
model_path = os.path.join(base_dir,"runs", "detect", "train", "weights", "best.pt")


model = YOLO(model_path)

# results_path = r"C:\4th Year\Thesis-Projects\YoloV8\ultralytics\results"
results_path = os.path.join(base_dir,"results")
os.makedirs(results_path, exist_ok=True)

def get_incremental_filename(base_path, base_name, extension):
    i = 1
    while True:
        filename = f"{base_name}{i}{extension}"
        if not os.path.exists(os.path.join(base_path, filename)):
            return os.path.join(base_path, filename)
        i += 1

def detect_from_webcam():
    # Open the webcam
    # Try opening /dev/video0 first
    cap = cv2.VideoCapture(0)

    # If /dev/video0 fails, try /dev/video1
    if not cap.isOpened():
      cap = cv2.VideoCapture(1)
    if not cap.isOpened():
        print("Error: Could not access the camera.")
        sys.exit()
    

    # video_filename = get_incremental_filename(results_path, "webcam_result", ".avi")
    video_filename = get_incremental_filename(results_path, "webcam_result", ".mp4")
    # fourcc = cv2.VideoWriter_fourcc(*'XVID')
    fourcc = cv2.VideoWriter_fourcc(*'H264')  # H.264 codec for MP4 files
    frame_size = (int(cap.get(cv2.CAP_PROP_FRAME_WIDTH)), int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT)))
    fps = 20
    out = cv2.VideoWriter(video_filename, fourcc, fps, frame_size)

    print(f"Recording video to {video_filename}. Press 'q' to stop recording.")
    prev_time = time.time()

    frame_count = 0
    target_fps = 20
    frame_interval = int(fps / target_fps)

    while True:
        ret, frame = cap.read()
        if not ret:
            print("Error: Failed to capture image from camera.")
            break
        
        start_time = time.time()

        if frame_count % frame_interval == 0:
            results = model(frame)
            result = results[0]
            frame = result.plot()
            
        frame_count += 1

        # Calculate FPS and MS
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
        
        cv2.imshow('Crop Detection - Webcam', frame)    
        out.write(frame)


        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    
    cap.release()
    out.release()
    cv2.destroyAllWindows()
    print(f"Video saved at {video_filename}")


def detect_from_mobilecam():
   
    # video_url = 'http://192.168.88.25:4747/video'
    video_url = 'http://192.168.0.151:4747/video'
    cap = cv2.VideoCapture(video_url)

    if not cap.isOpened():
        print("Error: Could not access the mobile camera.")
        sys.exit()
    
    # video_filename = get_incremental_filename(results_path, "mobilecam_result", ".avi")
    video_filename = get_incremental_filename(results_path, "mobilecam_result", ".mp4")
    # fourcc = cv2.VideoWriter_fourcc(*'XVID')
    fourcc = cv2.VideoWriter_fourcc(*'H264')  # H.264 codec for MP4 files
    frame_size = (int(cap.get(cv2.CAP_PROP_FRAME_WIDTH)), int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT)))
    fps = 20.0
    out = cv2.VideoWriter(video_filename, fourcc, fps, frame_size)
    print(f"Recording video to {video_filename}. Press 'q' to stop recording.")

    prev_time = time.time()

    
    while True:
        ret, frame = cap.read()
        if not ret:
            print("Error: Failed to capture image from mobile camera.")
            break
        
        start_time = time.time()

        results = model(frame)
        frame = results[0].plot()
         
        elapsed_time = time.time() - start_time
        fps_display = 1.0 / elapsed_time  # FPS
        ms_display = elapsed_time * 1000  # MS

        # Get the frame width and height
        frame_height, frame_width = frame.shape[:2]

        # Set the text position to the upper right
        text_position_fps = (frame_width - 200, 30)
        text_position_ms = (frame_width - 200, 70)

        # Display FPS and MS on the frame
        font = cv2.FONT_HERSHEY_SIMPLEX
        font_scale = 0.7  # Smaller text size
        color = (0, 255, 0)  # Green color
        thickness = 2  # Text thickness

        # Draw FPS and MS on the frame
        cv2.putText(frame, f"FPS: {fps_display:.2f}", text_position_fps, font, font_scale, color, thickness, cv2.LINE_AA)
        cv2.putText(frame, f"MS: {ms_display:.2f}ms", text_position_ms, font, font_scale, color, thickness, cv2.LINE_AA)


        cv2.imshow('Crop Detection - MobileCam', frame)
        out.write(frame)

       
        key = cv2.waitKey(1) & 0xFF
        if key == ord('q'):
            break

    cap.release()
    out.release()
    cv2.destroyAllWindows()
    print(f"Video saved at {video_filename}")


def detect_from_image(image_path):
    # Read the image
    image = cv2.imread(image_path)
    if image is None:
        print("Error: Image not found.")
        sys.exit()

    
    results = model(image)

  
    if isinstance(results, list):
        result = results[0] 
    else:
        result = results  

   
    image = result.plot()  

    
    image_filename = get_incremental_filename(results_path, "image_output", ".jpg")
    cv2.imwrite(image_filename, image)
    print(f"Image saved at {image_filename}")

    print(f"results {results}")
    cv2.imshow('Crop Detection - Image', image)

    
    cv2.waitKey(0)
    cv2.destroyAllWindows()



def detect_from_video(video_path):
    # Open the video
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        print("Error: Could not open video.")
        sys.exit()

    
    # video_filename = get_incremental_filename(results_path, "video_output", ".avi")
    video_filename = get_incremental_filename(results_path, "mobilecam_result", ".mp4")
    # fourcc = cv2.VideoWriter_fourcc(*'XVID')
    fourcc = cv2.VideoWriter_fourcc(*'H264')  # H.264 codec for MP4 files
    fps = cap.get(cv2.CAP_PROP_FPS)
    frame_size = (int(cap.get(cv2.CAP_PROP_FRAME_WIDTH)), int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT)))

    
    out = cv2.VideoWriter(video_filename, fourcc, fps, frame_size)
    print(f"Saving processed video as {video_filename}")

    while True:
        ret, frame = cap.read()
        if not ret:
            print("Finished processing video.")
            break

        
        results = model(frame)

      
        if isinstance(results, list):
            result = results[0]  
        else:
            result = results 

       
        frame = result.plot()  

        
        cv2.imshow('Crop Detection - Video', frame)

        
        out.write(frame)

       
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    
    cap.release()
    out.release()
    cv2.destroyAllWindows()
    print(f"Video saved at {video_filename}")


def main():
    if len(sys.argv) < 2:
        print("Usage: python crop_detect.py <mode> [file_path]")
        print("Modes: webcam, mobilecam, image, video")
        sys.exit()

    mode = sys.argv[1].lower()

    if mode == 'webcam':
        detect_from_webcam()
    elif mode == 'mobilecam':
        detect_from_mobilecam()
    elif mode == 'image' and len(sys.argv) == 3:
        image_path = sys.argv[2]
        detect_from_image(image_path)
    elif mode == 'video' and len(sys.argv) == 3:
        video_path = sys.argv[2]
        detect_from_video(video_path)
    else:
        print("Invalid usage. For image or video detection, provide a file path.")
        sys.exit()

if __name__ == "__main__":
    main()


# Scripts to start detection

# Webcam detection:
# python crop_detect.py webcam

# MobileCam detection:
# python crop_detect.py mobilecam


# Image detection:
# python crop_detect.py image path/to/your/image.jpg
# python crop_detect.py image "C:\\Users\\Admin\\Downloads\\leaf_1.jpg"

# Video detection:
# python crop_detect.py video path/to/your/video.mp4


# some comment here
