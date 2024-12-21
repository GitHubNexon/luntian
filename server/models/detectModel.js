const mongoose = require("mongoose");

const plantDetailsSchema = new mongoose.Schema({
  commonName: { type: String, required: true },
  scientificName: { type: String, required: true },
  family: { type: String, required: true },
  genus: { type: String, required: true },
  species: { type: String, required: true },
  variety: { type: String, required: true },
  age: { type: Number, required: true },
  growthStage: { type: String, required: true },
  datePlanted: { type: Date, required: true },
});

const environmentalConditionsSchema = new mongoose.Schema({
  temp: {
    type: Number,
    required: true, // Temperature in Celsius or Fahrenheit
    description: "Current temperature around the plant",
  },
  humidity: {
    type: Number,
    required: true, // Relative humidity percentage ex: 60RH
    description: "Percentage of moisture in the air",
  },
  soilMoisture: {
    type: String,
    required: true, // Soil moisture as a percentage or level (e.g., dry, moist, wet)
    description: "Amount of water in the soil",
  },
  date: {
    type: Date,
    description: "Date and time of the recorded environmental conditions",
  },
});

const detectSchema = new mongoose.Schema({
  detectionDate: {
    type: Date,
    required: true,
  },
  detectionEquipmentType: {
    type: String,
    required: true,
  },
  confidence: {
    type: Number,
    required: true,
  },
  detectedNo: {
    type: Number,
    required: true,
  },
  detectedImage: {
    type: [String],
    required: true,
  },
});

const detectionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    contentType: {
      type: String,
      required: true,
    },
    plantDetails: {
      type: [plantDetailsSchema],
      required: false,
    },
    location: {
      type: String,
      required: false,
    },
    symptomsObserved: {
      type: String,
      required: false,
    },
    suspectedDisease: {
      type: String,
      required: false,
    },
    environmentalConditions: {
      type: [environmentalConditionsSchema],
      required: false,
    },
    detect: {
      type: [detectSchema],
      required: false,
    },
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Detection", detectionSchema);
