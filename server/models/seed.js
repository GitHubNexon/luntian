require('dotenv').config();
const mongoose = require("mongoose");
const { insertDefaultValues } = require('./baseModel');
const { createDefaultUser } = require('../controllers/authController');

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    return insertDefaultValues();
  })
  .catch((err) => {
    console.error("Error in insertDefaultValues:", err);
    throw err;
  })
  .then(() => {
    return createDefaultUser();
  })
  .catch((err) => {
    console.error("Error in createDefaultUser:", err);
    throw err;
  })
  .then(() => {
    console.log('Seed complete!');
  })
  .catch((error) => {
    console.error("An error occurred during the seeding process:", error);
  })
  .finally(() => {
    mongoose.connection.close();
    process.exit();
  });
