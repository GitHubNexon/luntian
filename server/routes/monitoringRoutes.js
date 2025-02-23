const express = require("express");
const router = express.Router();
const monitorController = require("../controllers/monitorController");

// POST route to add monitoring details
router.post("/create", monitorController.createMonitoring);

//Update monitoring details
router.patch("/update/:id", monitorController.updateMonitoring);

//GET route to get all monitoring details
router.get("/all", monitorController.getAllMonitorings);

router.post("/delete/:id", monitorController.deleteMonitorings);

router.post("/archive/:id", monitorController.archiveMonitorings);

router.post("/undo-delete/:id", monitorController.undoDeleteMonitorings);

router.post("/undo-archive/:id", monitorController.undoArchiveMonitorings);

module.exports = router;
