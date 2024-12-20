const express = require('express');
const router = express.Router();
const { createDetection } = require('../controllers/detectController'); // Importing the controller

// POST route for creating a new detection
router.post('/createDetect', createDetection);

module.exports = router;
