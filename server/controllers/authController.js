require("dotenv").config();
// const bcrypt = require("bcrypt");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const User = require("../models/userModel"); // Adjust this path based on your folder structure
const { baseModel } = require("../models/baseModel");

const MAX_FAILED_ATTEMPTS = 5; // Define your max failed attempts
const LOCKOUT_DURATION = 30 * 60 * 1000; // Define lockout duration (30 minutes)

/**
 * Authenticates user account
 * Returns JSON Web Token and user info
 */
async function authenticate(req, res) {
  try {
    const data = req.body;

    // Find user by email
    let findUser = await User.findOne({ email: data.email }).exec();

    if (!findUser) {
      return res.status(404).json({ error: "Account not found" });
    }

    let userInfo = findUser.toObject();

    // Check if the user is currently locked out
    if (findUser.lockoutUntil && findUser.lockoutUntil > Date.now()) {
      return res.status(403).json({
        error: `Account is locked. Try again after ${new Date(
          findUser.lockoutUntil
        ).toLocaleString()}`,
      });
    }

    // Check if password matches
    if (!(await compareHash(data.password, userInfo.password))) {
      // Increment failed attempts
      findUser.failedAttempts += 1;

      // If failed attempts exceed the maximum allowed, set the lockout time
      if (findUser.failedAttempts >= MAX_FAILED_ATTEMPTS) {
        findUser.lockoutUntil = new Date(Date.now() + LOCKOUT_DURATION);
      }

      await findUser.save(); // Save changes (failedAttempts and lockoutUntil)
      return res.status(401).json({ error: "Invalid password" });
    }

    // If login is successful, reset failedAttempts and lockoutUntil
    findUser.failedAttempts = 0;
    findUser.lockoutUntil = null;

    await findUser.save(); // Save changes (failedAttempts and lockoutUntil)

    // Get user access
    const getAccess = await baseModel.findOne({
      "userTypes.user": userInfo.userType,
    });

    if (!getAccess) {
      return res.status(403).json({ error: "Access rights not found" });
    }

    // Get the access associated with the userType
    const userType = getAccess.userTypes.find(
      (type) => type.user === userInfo.userType
    );

    if (!userType) {
      return res.status(403).json({ error: "User type not found." });
    }

    const accessType = getAccess.accessTypes.find(
      (a) => a.code === userType.user.toLowerCase()
    );

    if (!accessType) {
      return res
        .status(403)
        .json({ error: "User does not have valid access rights." });
    }

    const token = generateToken({
      ...userInfo,
      profileImage: "",
      accessTypes: [{ code: accessType.code, access: accessType.access }],
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.json({
      token,
      username: userInfo.username,
      email: userInfo.email,
      _id: userInfo._id,
      userType: userInfo.userType,
      access: accessType.access, // Include access in the response
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * Middleware for token verification in request headers
 * Binds user data to request on successful verification
 * Terminates and returns the request with status code 401 on unsuccessful verification
 */
async function authenticateToken(req, res, next) {
  const token = req.cookies.token; // Get token from cookies
  if (!token) return res.status(401).json({ error: "Access token required" });

  jwt.verify(token, process.env.SECRET_KEY, async (err, user) => {
    if (err) {
      return res.status(401).json({ error: "Access token expired or invalid" });
    }

    req.user = user;

    // Update user's connection status to online
    try {
      await User.findByIdAndUpdate(user._id, { connectStatus: "online" });
    } catch (error) {
      console.error("Error updating user status:", error);
      return res.status(500).json({ error: "Internal server error" });
    }

    next();
  });
}

/**
 * Transforms an object into JWT token
 * @param {object} payload
 * @returns jwt token
 */
function generateToken(payload) {
  try {
    const token = jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: process.env.TOKEN_EXPIRATION,
    });
    return token;
  } catch (error) {
    throw new Error("Error generating token");
  }
}

// Logout
function logoutToken(req, res) {
  res.clearCookie("token");
  res.status(200).json({ message: "Logout successful" });
}

/**
 * Validates a JWT token and returns its data
 * @param {jwt token} token
 * @returns object {valid: boolean, decoded jwt/error message}
 */
function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    return { valid: true, decoded };
  } catch (error) {
    return { valid: false, error: error.message };
  }
}

/**
 * Transforms password string to hash
 * @param {string} password
 * @returns hash string
 */
async function generateHash(password) {
  try {
    const hash = await bcrypt.hash(
      password,
      parseInt(process.env.SALT_ROUNDS, 10)
    );
    return hash;
  } catch (error) {
    console.error(error);
    throw new Error("Error generating hash");
  }
}

/**
 * Check if given string password matches the given hash
 * @param {string} password
 * @param {string} hash
 * @returns boolean
 */
async function compareHash(password, hash) {
  try {
    const isMatch = await bcrypt.compare(password, hash);
    return isMatch;
  } catch (error) {
    console.error(error);
    throw new Error("Error comparing hash");
  }
}

// Creates default user
async function createDefaultUser() {
  try {
    const defaultUser = {
      username: "Administrator",
      email: "admin@mail.com",
      password: "1234",
      userType: "Administrator",
    };
    // check email duplicate
    const check = await User.find({ email: defaultUser.email });
    if (check.length > 0) {
      return;
    }
    // converts password on request to hash
    defaultUser.password = await generateHash(defaultUser.password);
    const user = new User(defaultUser);
    await user.save();
    console.log("default user created");
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  authenticate,
  generateHash,
  authenticateToken,
  createDefaultUser,
  logoutToken,
  verifyToken,
  compareHash,
  cookieParser,
};
