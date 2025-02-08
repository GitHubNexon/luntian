const Plant = require("../models/plantModel");

const addPlantDetails = async (req, res) => {
  try {
    const newPlant = await Plant.create(req.body);
    res.status(201).json({
      message: "Plant details added successfully",
      data: newPlant,
    });
  } catch (error) {
    console.error("Error adding plant details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updatePlantDetails = async (req, res) => {
  try {
    const updatedPlant = await Plant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedPlant) {
      return res.status(404).json({ error: "Plant not found" });
    }

    res.json({
      message: "Plant details updated successfully",
      data: updatedPlant,
    });
  } catch (error) {
    console.error("Error updating plant details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
// DELETE method to delete plant by ID
const deletePlantDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedPlant = await Plant.findByIdAndDelete(id);

    if (!deletedPlant) {
      return res.status(404).json({ error: "Plant not found" });
    }

    res.json({ message: "Plant details deleted successfully" });
  } catch (error) {
    console.error("Error deleting plant details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// GET method to fetch all plant details with pagination and filtering
const getAllPlants = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const keyword = req.query.keyword || "";
    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

    const query = keyword
      ? {
          $or: [
            { "plantDetails.commonName": { $regex: keyword, $options: "i" } },
            {
              "plantDetails.scientificName": { $regex: keyword, $options: "i" },
            },
            { "plantDetails.family": { $regex: keyword, $options: "i" } },
            { "plantDetails.genus": { $regex: keyword, $options: "i" } },
            { "plantDetails.species": { $regex: keyword, $options: "i" } },
            { "plantDetails.variety": { $regex: keyword, $options: "i" } },
          ],
        }
      : {};

    const sortCriteria = sortBy ? { [sortBy]: sortOrder } : {};
    const totalItems = await Plant.countDocuments(query);
    const data = await Plant.find(query)
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
    console.error("Error getting all plant data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  addPlantDetails,
  updatePlantDetails,
  deletePlantDetails,
  getAllPlants,
};
