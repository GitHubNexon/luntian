const User = require("../models/userModel.js");
const { generateHash } = require("./authController.js");
const { checkBody } = require("../helpers/helper.js");
const { baseModel } = require("../models/baseModel.js");
const { default: mongoose } = require("mongoose");

async function createUser(req, res) {
  try {
    // Validate required fields (username, password, email, and userType)
    checkBody(["username", "password", "email", "userType"], req, res);

    // Check if the userType is valid (exists in baseModel)
    const base = await baseModel.findOne({});
    if (!base) {
      return res
        .status(500)
        .json({ message: "Base user types not configured." });
    }

    const validUserType = base.userTypes.find(
      (type) => type.user.toLowerCase() === req.body.userType.toLowerCase()
    );

    if (!validUserType) {
      return res.status(400).json({ message: "Invalid user type" });
    }

    // Check if the username or email already exists
    const existingUser = await User.findOne({
      $or: [{ username: req.body.username }, { email: req.body.email }],
    });

    if (existingUser) {
      return res.status(409).json({
        message:
          existingUser.username === req.body.username
            ? "Username already exists"
            : "Email already exists",
      });
    }

    // Hash the password
    req.body.password = await generateHash(req.body.password);

    // Create the new user object conditionally
    const userData = {
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      userType: validUserType.user, // Set the userType from valid ones
    };

    // Create the user
    const user = new User(userData);

    await user.save();

    // Respond with the newly created user
    res.status(201).json({
      username: user.username,
      email: user.email,
      _id: user._id,
      userType: user.userType,
    });
  } catch (error) {
    // Handle errors
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function readUsers(req, res) {
  try {
    const params = {};
    const page = parseInt(req.query.page, 10) || 1; // Default to page 1
    const limit = parseInt(req.query.limit, 10) || 10; // Default to limit of 10
    const keyword = req.query.keyword || "";

    // Filter by keyword for username and email
    if (keyword) {
      params.$or = [
        { username: { $regex: keyword, $options: "i" } },
        { email: { $regex: keyword, $options: "i" } },
      ];
    }

    // Filter by specific user ID if provided
    if (req.query.id) {
      if (req.query.id.length !== 24) {
        return res.status(400).json({ error: "Invalid ID format" });
      }
      params._id = req.query.id;
    }

    // Filter by user type if provided
    if (req.query.type) {
      params.userType = req.query.type;
    }

    // Count total users matching the params
    const totalItems = await User.countDocuments(params);

    // Retrieve users with pagination
    const users = await User.find(params)
      .select("-password") // Exclude password from the response
      .skip((page - 1) * limit)
      .limit(limit);

    // Respond with pagination and user data
    res.status(200).json({
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page,
      users: users.map((user) => ({
        username: user.username,
        _id: user._id,
        userType: user.userType, // Add userType here
        firstName: user.firstName,
        lastName: user.lastName,
        middleName: user.middleName,
        age: user.age,
        gender: user.gender,
        contactNumber: user.contactNumber,
        address: user.address,
        email: user.email,
        // profileImage: user.profileImage,
        profileImage: user.profileImage
          ? `data:image/jpeg;base64,${user.profileImage}`
          : null, // Change this line
        dateTimestamp: user.dateTimestamp,
        dateUpdated: user.dateUpdated,
        lockoutUntil: user.lockoutUntil,
        access: user.access,
      })),
    });
  } catch (error) {
    console.error("Error reading users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function updateUser(req, res) {
  const { id } = req.params;

  try {
    // Find the existing user first
    const existingUser = await User.findById(id);
    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const updateData = { ...req.body, dateUpdated: new Date() };

    // Handle password separately
    if (updateData.password) {
      // Hash the new password
      updateData.password = await generateHash(updateData.password);
    } else {
      // Remove password from updateData if not provided
      delete updateData.password;
    }

    // Define allowed updates
    const allowedUpdates = [
      "username",
      "firstName",
      "middleName",
      "lastName",
      "age",
      "gender",
      "contactNumber",
      "address",
      "email",
      "userType",
      "password",
      "profileImage",
      "dateUpdated",
    ];

    const updates = Object.keys(updateData);
    const isValidUpdate = updates.every((update) =>
      allowedUpdates.includes(update)
    );

    if (!isValidUpdate) {
      return res.status(400).json({ error: "Invalid updates!" });
    }

    // Update the user with the new data
    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      ...updatedUser.toObject(),
      address: {
        region: updatedUser.address.region,
        province: updatedUser.address.province,
        municipality: updatedUser.address.municipality,
        barangay: updatedUser.address.barangay,
        streetAddress: updatedUser.address.streetAddress,
        houseNumber: updatedUser.address.houseNumber,
        zipcode: updatedUser.address.zipcode,
      },
      createdAt: updatedUser.dateTimestamp.toISOString(),
      updatedAt: updatedUser.dateUpdated.toISOString(),
    });
  } catch (error) {
    console.error("Error updating user:", error);
    if (error.code === 11000) {
      return res.status(409).json({ error: "Email already exists" });
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function unlockUser(req, res) {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.lockoutUntil) {
      return res.status(400).json({ error: "User is not locked" });
    }

    user.lockoutUntil = null; // Clear the lockout time
    user.failedAttempts = 0; // Optionally reset failed attempts
    await user.save();

    res.status(200).json({ message: "User unlocked successfully" });
  } catch (error) {
    console.error("Error unlocking user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function deleteUser(req, res) {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function getProfile(req, res) {
  try {
    // Get the username from the request parameters
    const username = req.params.username;

    const userquery = await User.aggregate([
      {
        $match: { username: username },
      },
      {
        $lookup: {
          from: "bases",
          let: { userType: "$userType" },
          pipeline: [
            { $unwind: "$userTypes" },
            { $match: { $expr: { $eq: ["$userTypes.user", "$$userType"] } } },
            { $project: { _id: 0, access: "$userTypes.access" } },
          ],
          as: "access",
        },
      },
      {
        $project: {
          _id: 1,
          username: 1,
          firstName: 1,
          middleName: 1,
          lastName: 1,
          gender: 1,
          age: 1,
          contactNumber: 1,
          address: 1,
          email: 1,
          profileImage: 1,
          userType: 1,
          access: { $arrayElemAt: ["$access.access", 0] },
          userId: "$_id", // Add userId field
        },
      },
    ]);

    if (!userquery.length) {
      return res.status(404).json({ message: "Profile not found" });
    }

    const user = userquery[0];

    res.json({
      _id: user._id, // Include the user ID in the response
      username: user.username,
      firstName: user.firstName,
      middleName: user.middleName,
      lastName: user.lastName,
      gender: user.gender,
      age: user.age,
      contactNumber: user.contactNumber,
      address: user.address,
      email: user.email,
      profileImage: user.profileImage,
      userType: user.userType,
      access: user.access,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  createUser,
  readUsers,
  updateUser,
  deleteUser,
  unlockUser,
  getProfile,
};
