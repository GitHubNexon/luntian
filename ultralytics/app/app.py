import os
from flask import Flask, jsonify
from flask_cors import CORS
from flask_pymongo import PyMongo
from dotenv import load_dotenv

from routes.yolo_V8_Routes import yolo_v8_routes

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

# Enable CORS
CORS(app, origins="http://localhost:5173", supports_credentials=True)

# Set the MongoDB URI from environment variables
app.config["MONGO_URI"] = os.getenv("MONGODB_URI")
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")

mongo = PyMongo(app)

# Register the blueprint for routes
app.register_blueprint(yolo_v8_routes, url_prefix='/api/yolo_v8')

# Basic route to check if the server is running
@app.route("/api", methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD", ])
def check_server():
    return jsonify({"message": "Server is running"}), 200

# Connect to MongoDB and print the status
@app.before_request
def initialize_db():
    # Try to connect to MongoDB and print the status on every request
    try:
        mongo.db.command("ping")
        print("Connected to MongoDB")
    except Exception as e:
        print(f"Error connecting to MongoDB: {e}")


# Run the Flask app
if __name__ == "__main__":
    # Connect to MongoDB when the app starts, not just before requests
    try:
        mongo.db.command("ping")
        print("Connected to MongoDB")
    except Exception as e:
        print(f"Error connecting to MongoDB: {e}")
    
    app.run(debug=True, host="0.0.0.0", port=5000)