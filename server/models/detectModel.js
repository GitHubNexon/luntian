const mongoose = require("mongoose");

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
      type: [
        {
          commonName: { type: String, required: true },
          scientificName: { type: String, required: true },
          family: { type: String, required: true },
          genus: { type: String, required: true },
          species: { type: String, required: true },
          variety: { type: String, required: true },
          age: { type: Number, required: true },
          growthStage: { type: String, required: true },
        },
      ],
      required: true,
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
      type: [
        {
          temp: { type: String },
          humidity: { type: String },
          soilMoisture: { type: String },
        },
      ],
    },
    detect: {
      type: [
        {
          detectionDate: {
            type: String,
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
        },
      ],
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
    timestamps: true, // This enables createdAt and updatedAt automatically
  }
);

module.exports = mongoose.model("Detection", detectionSchema);
