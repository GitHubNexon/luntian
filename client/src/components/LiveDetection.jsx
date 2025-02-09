import React, { useState } from "react";
import detectionApi from "../api/detectionApi";
import { FaPlay, FaStop } from "react-icons/fa";

const LiveDetection = () => {
  const [isStreaming, setIsStreaming] = useState(false);

  const startStream = async () => {
    try {
      await detectionApi.startLiveDetection();
      setIsStreaming(true);
    } catch (error) {
      console.error("Error starting live detection:", error);
    }
  };

  const stopStream = async () => {
    try {
      await detectionApi.stopLiveDetection();
      setIsStreaming(false);
    } catch (error) {
      console.error("Error stopping live detection:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 ">
      <h1 className="text-3xl font-semibold  mb-6">Live Plant Disease Detection</h1>
      <div className="flex flex-col items-center bg-white shadow-lg rounded-lg p-6 w-full max-w-lg modeDiv">
        {isStreaming ? (
          <img
            src={`${detectionApi.getVideoFeed()}?t=${new Date().getTime()}`}
            alt="Live Object Detection Feed"
            className="w-full max-w-md h-auto border-2 border-black rounded-md"
          />
        ) : (
          <p className="text-gray-600">Click "Start" to begin the stream</p>
        )}
        <div className="flex gap-4 mt-4">
          <button
            onClick={startStream}
            disabled={isStreaming}
            className={`flex items-center gap-2 px-4 py-2 text-white font-medium rounded-lg transition-all duration-300 ${
              isStreaming
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600"
            }`}
          >
            <FaPlay size={20} /> Start Detection
          </button>
          <button
            onClick={stopStream}
            disabled={!isStreaming}
            className={`flex items-center gap-2 px-4 py-2 text-white font-medium rounded-lg transition-all duration-300 ${
              !isStreaming
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-500 hover:bg-red-600"
            }`}
          >
            <FaStop size={20} /> Stop Detection
          </button>
        </div>
      </div>
    </div>
  );
};

export default LiveDetection;
