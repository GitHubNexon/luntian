const Plant = require("../models/plantModel");
const mongoose = require("mongoose");

// working
const getPlants = async (req, res) => {
  try {
    const plant = await Plant.aggregate([
      {
        $project: {
          plantDetails: 1,
        },
      },
    ]);
    res.status(200).json(plant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// working
const getDetections = async (req, res) => {
  try {
    const db = mongoose.connection.db; // Access the database
    const detections = await db
      .collection("yolo_v8_detection")
      .aggregate([
        {
          $project: {
            images: 1,
            description: 1,
            details: 1,
            image_result: 1,
            created_at: 1,
            updated_at: 1,
          },
        },
      ])
      .toArray();

    res.status(200).json(detections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPlants,
  getDetections,
};
