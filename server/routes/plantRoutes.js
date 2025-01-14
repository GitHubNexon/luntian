const express = require("express");
const router = express.Router();
const plantController = require("../controllers/plantController");

// POST route to add plant details
router.post("/", plantController.addPlantDetails);

// PATCH route to update plant details by ID
router.patch("/Update_Plant/:id", plantController.updatePlantDetails);

// DELETE route to delete plant details by ID
router.delete("/Delete_Plant/:id", plantController.deletePlantDetails);

// GET route to fetch all plant details with pagination, filtering, and sorting
router.get("/Get-All-Plants", plantController.getAllPlants);

module.exports = router;
