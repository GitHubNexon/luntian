const mongoose = require("mongoose");

const accessTypeSchema = new mongoose.Schema({
  code: { type: String, unique: true },
  access: { type: String },
});

const userTypeSchema = new mongoose.Schema({
  user: { type: String, required: true, unique: true },
});

const genderTypeSchema = new mongoose.Schema({
  gender: { type: String, enum: ["Male", "Female", "Other"] },
});


const baseSchema = new mongoose.Schema({
  genders: [genderTypeSchema], 
  userTypes: [userTypeSchema],
  accessTypes: [accessTypeSchema],
});

const baseModel = mongoose.model("Bases", baseSchema);

async function insertDefaultValues() {
  // insert default values here
  console.log("inserting system default........");
  await baseModel.deleteMany();


  const defaultBase = new baseModel({
    userTypes: [
      { user: "Administrator" },
      { user: "User" },
      { user: "Researcher" },
      { user: "Agriculturist" },
    ],
    accessTypes: [
      { code: "administrator", access: "full" },
      { code: "user", access: "limited" },
      { code: "researcher", access: "moderate" },
      { code: "agriculturist", access: "moderate" },
    ],
    genders: [{ gender: "Male" }, { gender: "Female" }, { gender: "Other" }],
  });

  defaultBase
    .save()
    .then(() => {
      console.log("Administrator and User types inserted successfully");
    })
    .catch((err) => {
      if (err.code != 11000) {
        console.error("Error inserting default user types:", err);
      }
    });
}

module.exports = {
  insertDefaultValues,
  baseModel,
};
