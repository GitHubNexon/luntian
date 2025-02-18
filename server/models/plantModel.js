const mongoose = require("mongoose");

const plantDetailsSchema = new mongoose.Schema({
  commonName: { type: String, required: false },
  plantImage: { type: String, required: false },
  scientificName: { type: String, required: false },
  family: { type: String, required: false },
  genus: { type: String, required: false },
  species: { type: String, required: false },
  variety: { type: String, required: false },
  age: { type: Number, required: false },
  growthStage: { type: String, required: false },
  trivia: { type: String, required: false },
  description: { type: String, required: false },
});

const plantDiseasesSchema = new mongoose.Schema({
  diseaseImage: { type: String, required: false },
  diseaseName: { type: String, required: false },
  diseaseDescription: { type: String, required: false },
  diseaseType: { type: String, required: false },
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
