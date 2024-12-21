const express = require("express");
const router = express.Router();
const {
  createDetection,
  updateDetectionById,
  getAllDetectionData,
  getDetectionById,
  deleteDetectionById,
} = require("../controllers/detectController"); // Importing the controller

// POST route for creating a new detection
router.post("/", createDetection);

//Patch route for updating a detection
router.patch("/update/:id", updateDetectionById);

// GET route for getting all detection data
router.get("/all", getAllDetectionData);

// GET route for getting a single detection by id
router.get("/get/:id", getDetectionById);

//Delete route for deleting a detectionBy id
router.delete("/delete/:id", deleteDetectionById);

module.exports = router;
