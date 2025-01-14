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
  datePlanted: { type: Date, required: false },
  trivia: { type: String, required: true },
  description: { type: String, required: true },
  temp: {
    type: Number,
    required: true, // Temperature in Celsius or Fahrenheit
  },
  humidity: {
    type: Number,
    required: true, // Relative humidity percentage ex: 60RH
  },
  soilMoisture: {
    type: String,
    required: true, // Soil moisture as a percentage or level (e.g., dry, moist, wet)
  },
});

const plantDiseasesSchema = new mongoose.Schema({
  commonDisease: { type: String, required: true },
  diseaseType: { type: String, required: true },
});

const plantSchema = new mongoose.Schema(
  {
    plantDetails: plantDetailsSchema,
    plantDiseases: [plantDiseasesSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Plant", plantSchema);
