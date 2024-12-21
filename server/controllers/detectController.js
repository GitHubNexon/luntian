const Detection = require("../models/detectModel");

const createDetection = async (req, res) => {
  try {
    const {
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
      username,
    } = req.body;
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
      username,
    });

    // Save the detection to the database
    const savedDetection = await newDetection.save();

    // Send a success response
    return res.status(201).json({
      message: "Detection created successfully",
      data: savedDetection,
    });
  } catch (error) {
    // If an error occurs, send an error response
    return res.status(500).json({
      message: "Error creating detection",
      error: error.message,
    });
  }
};

// update detectionById

const updateDetectionById = async (req, res) => {
  const detectionId = req.params.id;
  const updateData = req.body;

  try {
    //find any detection entries by id and update with new data
    const updatedDetection = await Detection.findByIdAndUpdate(
      detectionId,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedDetection) {
      return res.status(404).json({ message: "Detection not found" });
    }

    return res.json({
      message: "Detection updated successfully",
      data: updatedDetection,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error updating detection",
      error: error.message,
    });
  }
};

//for getting all data of detection in the database
const getAllDetectionData = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const keyword = req.query.keyword || "";
    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? -1 : 1; // default ascending order

    const query = keyword
      ? {
          $or: [
            { title: { $regex: keyword, $options: "i" } },
            { description: { $regex: keyword, $options: "i" } },
            { location: { $regex: keyword, $options: "i" } },
            { symptomsObserved: { $regex: keyword, $options: "i" } },
            { suspectedDisease: { $regex: keyword, $options: "i" } },
          ],
        }
      : {};

    const sortCriteria = sortBy ? { [sortBy]: sortOrder } : {};
    const totalItems = await Detection.countDocuments(query);
    const data = await Detection.find(query)
      .sort(sortCriteria)
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page,
      data,
    });
  } catch (error) {
    console.error("Error on getting all detection data:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

//for getting specific detection data by id

const getDetectionById = async (req, res) => {
  const detectionId = req.params.id;

  try {
    const detection = await Detection.findById(detectionId);
    if (!detection) {
      return res.status(404).json({ message: "Detection not found" });
    }

    return res.json({ data: detection });
  } catch (error) {
    console.error("Error on getting detection by id:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

//for deleting specific detection data by id

const deleteDetectionById = async (req, res) => {
  try {
    const detectionId = req.params.id;

    const data = await Detection.findByIdAndDelete(detectionId);
    if (!data) {
      return res.status(404).json({ message: "Detection not found" });
    }

    return res.status(200).json({ message: "Detection successfully deleted" });
  } catch (error) {
    console.error("Error on deleting detection by id:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createDetection,
  updateDetectionById,
  getAllDetectionData,
  getDetectionById,
  deleteDetectionById,
};
