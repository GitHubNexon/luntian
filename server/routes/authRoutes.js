const express = require("express");
const router = express.Router();
const {
  authenticate,
  authenticateToken,
} = require("../controllers/authController");
const { checkBody, asyncHandler } = require("../helpers/helper");

// Login API
router.post(
  "/",
  asyncHandler(async (req, res) => {
    checkBody(["email", "password"], req, res);
    await authenticate(req, res);
  })
);

// Check Token API
router.post(
  "/check",
  authenticateToken,
  asyncHandler(async (req, res) => res.json(req.user))
);

// Logout API
router.post(
  "/logout",
  asyncHandler(async (req, res) => {
    res.clearCookie("token"); // Adjust this if you're using a different cookie name
    res.status(200).json({ message: "Logged out successfully" });
  })
);

module.exports = router;
