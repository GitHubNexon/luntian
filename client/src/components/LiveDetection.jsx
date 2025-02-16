import React, { useState, useEffect, useRef } from "react";
import detectionApi from "../api/detectionApi";
import { FaPlay, FaStop, FaCamera } from "react-icons/fa";

const LiveDetection = () => {
  const [isStreaming, setIsStreaming] = useState(false);
  const imgRef = useRef(null); // Reference to the image element

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

  const captureFrame = () => {
    if (imgRef.current) {
      const img = imgRef.current;

      // Set the image's crossOrigin to allow the canvas to access it
      img.crossOrigin = "Anonymous";

      // Create a canvas to draw the image
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // Set the canvas size to the image size
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw the image onto the canvas
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Convert canvas to data URL (image)
      const imageUrl = canvas.toDataURL("image/png");

      // Create a link element to download the image
      const link = document.createElement("a");
      link.href = imageUrl;
      link.download = "captured-frame.png";
      link.click();
    }
  };

  // Handle component visibility change (e.g., tab switch or page navigate)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopStream(); // Stop the stream when the tab is not visible
      }
    };

    // Listen for tab visibility changes
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup on unmount
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (isStreaming) {
        stopStream();
      }
    };
  }, [isStreaming]);

  return (
    <div className="flex flex-col items-center justify-center h-full p-4 ">
      <h1 className="text-3xl font-semibold  mb-6">
        Live Plant Disease Detection
      </h1>
      <div className="flex flex-col items-center bg-white shadow-lg rounded-lg p-6 w-full max-w-lg modeDiv">
        {isStreaming ? (
          <img
            ref={imgRef}
            src={`${detectionApi.getVideoFeed()}?t=${new Date().getTime()}`}
            alt="Live Object Detection Feed"
            className="w-full h-full border-2 border-black rounded-md"
          />
        ) : (
          <p className="text-gray-600">Click "Start" to Begin Detection</p>
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
          <button
            onClick={captureFrame}
            disabled={!isStreaming}
            className={`flex items-center gap-2 px-4 py-2 text-white font-medium rounded-lg transition-all duration-300 ${
              !isStreaming
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            <FaCamera size={20} /> Capture
          </button>
        </div>
      </div>
    </div>
  );
};

export default LiveDetection;
