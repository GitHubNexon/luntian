const Detection = require('../models/detectModel'); 

const createDetection = async (req, res) => {
  try {
    const { title, description, contentType, plantDetails, detectionDate, location, symptomsObserved, suspectedDisease, detectedImage, environmentalConditions, userID, username } = req.body;
    // Create a new Detection record
    const newDetection = new Detection({
      title,
      description,
      contentType,
      plantDetails,
      detectionDate,
      location,
      symptomsObserved,
      suspectedDisease,
      detectedImage,
      environmentalConditions,
      userID,
      username
    });

    // Save the detection to the database
    const savedDetection = await newDetection.save();

    // Send a success response
    return res.status(201).json({
      message: 'Detection created successfully',
      data: savedDetection,
    });
  } catch (error) {
    // If an error occurs, send an error response
    return res.status(500).json({
      message: 'Error creating detection',
      error: error.message,
    });
  }
};



module.exports = { createDetection };
