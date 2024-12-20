# mobile.py
import cv2

def use_mobile_as_webcam():
    # Replace 'http://<IP>:<PORT>/video' with the IP and port from DroidCam app
    video_url = 'http://192.168.88.25:4747/video'
    cap = cv2.VideoCapture(video_url)

    if not cap.isOpened():
        print("Error: Could not open video stream.")
        return

    while True:
        ret, frame = cap.read()
        if not ret:
            print("Failed to grab frame.")
            break

        cv2.imshow("Mobile Webcam Feed", frame)

        # Exit when 'q' is pressed
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    use_mobile_as_webcam()
