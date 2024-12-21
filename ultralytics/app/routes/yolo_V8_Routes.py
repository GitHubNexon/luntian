from flask import Blueprint, request, jsonify
from controllers.yolo_V8_Controller import YoloV8Controller

# Define the blueprint for YOLOv8 routes
yolo_v8_routes = Blueprint('yolo_v8', __name__)

@yolo_v8_routes.route('/post_detection', methods=['POST'])
def post_detection():
    try:
        # Get the data from the incoming POST request
        data = request.get_json()

        # Use the YoloV8Controller to process the request
        # Change this line to call `create_detection` instead of `create`
        response = YoloV8Controller.create_detection(data)

        if 'status' in response and response['status'] == 'success':
            return jsonify(response), 201
        else:
            return jsonify(response), 400

    except Exception as e:
        # Return error response in case of any failure
        return jsonify({"status": "error", "message": str(e)}), 500
