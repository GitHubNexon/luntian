const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv'); // Add this to load .env variables

dotenv.config(); // This loads the environment variables from the .env file

const Plant = require("../models/plantModel");

// Add timestamps to the model schema
const plantSchema = Plant.schema.clone();
plantSchema.set('timestamps', true);

// Check if the model is already compiled
const PlantWithTimestamps = mongoose.models.Plant || mongoose.model("Plant", plantSchema);

// Read the JSON file
const jsonFilePath = path.join(__dirname, "../json/plant.json");

// Connect to MongoDB using the URI from the .env file
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
}).then(() => {
  console.log("MongoDB connected successfully!");

  // Read the JSON data
  fs.readFile(jsonFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error("Error reading the file", err);
      return;
    }

    try {
      // Parse the JSON data
      const plantData = JSON.parse(data);

      // Insert the data into the MongoDB database
      PlantWithTimestamps.insertMany(plantData)
        .then(() => {
          console.log("Data successfully inserted with timestamps.");
        })
        .catch(err => {
          console.error("Error inserting data:", err.message);
        });

    } catch (parseErr) {
      console.error("Error parsing the JSON data", parseErr);
    }
  });
}).catch(err => {
  console.error("Error connecting to MongoDB", err);
});
