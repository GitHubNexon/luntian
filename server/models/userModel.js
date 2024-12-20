const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: { type: String, required: true, unique: true },
  password: {
    type: String,
    required: true,
  },
  firstName: { type: String },
  lastName: { type: String },
  middleName: { type: String },
  age: { type: Number },
  gender: { type: String },
  contactNumber: { type: String },
  address: {
    streetAddress: { type: String },
    houseNumber: { type: String },
    zipCode: { type: String },
    region: {
      id: { type: Number },
      region_name: { type: String },
    },
    province: {
      id: { type: Number },
      province_name: { type: String },
    },
    municipality: {
      id: { type: Number },
      municipality_name: { type: String },
    },
    barangay: {
      id: { type: Number },
      barangay_name: { type: String },
    },
  },
  userType: {
    type: String,
    required: true,
  },
  profileImage: { type: String },
  dateTimestamp: { type: Date, default: Date.now },
  dateUpdated: { type: Date, default: Date.now },
  failedAttempts: { type: Number, default: 0 },
  lockoutUntil: { type: Date, default: null },
});




const User = mongoose.model("User", userSchema);

module.exports = User;
