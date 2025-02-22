const express = require("express");
const router = express.Router();
const { getPlants, getDetections } = require("../controllers/helperController");

router.get("/plants", getPlants);
router.get("/detections", getDetections);


module.exports = router;
