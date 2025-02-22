const mongoose = require("mongoose");

const monitorSchema = new mongoose.Schema(
  {
    plantInfo: { type: mongoose.Schema.Types.Mixed },
    plantDiseaseInfo: { type: mongoose.Schema.Types.Mixed },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Monitoring", monitorSchema);
