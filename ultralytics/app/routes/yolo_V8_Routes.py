from flask import Blueprint, request, jsonify
from controllers.yolo_V8_Controller import YoloV8Controller
from services.detection_services import detect_from_live



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

# New route for updating a detection by ID
@yolo_v8_routes.route('/update_detection/<string:detection_id>', methods=['PATCH'])
def patch_detection(detection_id):
    try:
        # Get the data from the incoming PATCH request
        data = request.get_json()

        # Use the YoloV8Controller to process the update
        response = YoloV8Controller.update_detection_byId(detection_id, data)

        if 'status' in response and response['status'] == 'success':
            return jsonify(response), 200
        else:
            return jsonify(response), 404

    except Exception as e:
        # Return error response in case of any failure
        return jsonify({"status": "error", "message": str(e)}), 500
    

@yolo_v8_routes.route('/get_detection/<string:detection_id>', methods=['GET'])
def get_detection(detection_id):
    try:
        # Use the YoloV8Controller to fetch the detection
        response = YoloV8Controller.get_detection_byId(detection_id)

        if response["status"] == "success":
            return jsonify(response), 200
        else:
            return jsonify(response), 404

    except Exception as e:
        # Return error response in case of any failure
        return jsonify({"status": "error", "message": str(e)}), 500

@yolo_v8_routes.route('/get_all_detections', methods=['GET'])
def get_all_detections():
    try:
        # Get the query parameters
        page = int(request.args.get("page", 1))
        limit = int(request.args.get("limit", 10))
        keyword = request.args.get("keyword", "")
        sort_by = request.args.get("sortBy", "date")
        sort_order = request.args.get("sortOrder", "asc")

        # Use the YoloV8Controller to fetch the detections
        response = YoloV8Controller.get_all_detections(page, limit, keyword, sort_by, sort_order)

        if "status" in response and response["status"] == "success":
            return jsonify(response), 200
        else:
            return jsonify(response), 404

    except Exception as e:
        # Return error response in case of any failure
        return jsonify({"status": "error", "message": str(e)}), 500


# New route for deleting a detection by ID
@yolo_v8_routes.route('/delete_detection/<string:detection_id>', methods=['DELETE'])
def delete_detection(detection_id):
    try:
        response = YoloV8Controller.delete_detection_byId(detection_id)

        if response["status"] == "success":
            return jsonify(response), 200
        else:
            return jsonify(response), 404

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
    

    
@yolo_v8_routes.route('/start_live_detection', methods=['POST'])
def start_live_detection_route():
    try:
        response = YoloV8Controller.start_live_detection()
        if response['status'] == 'success':
            return jsonify(response), 200
        else:
            return jsonify(response), 400
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@yolo_v8_routes.route('/stop_live_detection', methods=['POST'])
def stop_live_detection_route():
    try:
        response = YoloV8Controller.stop_live_detection()
        if response['status'] == 'success':
            return jsonify(response), 200
        else:
            return jsonify(response), 400
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@yolo_v8_routes.route("/video_feed", methods=["GET"])
def video_feed_route():
    return YoloV8Controller.video_feed()

