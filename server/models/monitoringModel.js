const mongoose = require("mongoose");

const StatusSchema = new mongoose.Schema({
  isDeleted: { type: Boolean, default: false },
  isArchived: { type: Boolean, default: false },
});

const monitorSchema = new mongoose.Schema(
  {
    plantInfo: { type: mongoose.Schema.Types.Mixed },
    plantDiseaseInfo: { type: mongoose.Schema.Types.Mixed },
    Status: { type: StatusSchema, required: false },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Monitoring", monitorSchema);
