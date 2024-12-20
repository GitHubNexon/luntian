const express = require("express");
const router = express.Router();

const {
  createUser,
  readUsers,
  deleteUser,
  unlockUser,
  updateUser,
  getProfile,
} = require("../controllers/userController");
const { authenticateToken } = require("../controllers/authController");
const { checkBody, asyncHandler } = require("../helpers/helper");

/**
 * creates new user
 * add Authorization in header with Bearer <token>
 * request body: {
        "username": "<string>",
        "password": "<string>",
    }
 */
router.post(
  "/",
  asyncHandler(async (req, res) => {
    checkBody(["username", "email", "password", "userType"], req, res);
    await createUser(req, res);
  })
);

/**
 * reads user collection
 * has 3 params
 * id: search for user id
 * keyword: performs regex on user's name or email
 * type: search for user with the userType
 * empty params will return all users
 */
router.get(
  "/",
  authenticateToken,
  asyncHandler(async (req, res) => {
    await readUsers(req, res);
  })
);






/**
 * update user info
 * :d = mongodb id
 * request body: {
 *      "username": "<string>",
 *      "email": "<string>",
 *      "password": "<string>",
 *      "userType": "<string>"
 * }
 * request body fields are optional but will check for duplicate email
 */
router.patch(
  "/:id",
  authenticateToken,
  asyncHandler(async (req, res) => await updateUser(req, res))
);

/**
 * delete user
 * :d = mongodb id
 */

router.delete(
  "/:id",
  authenticateToken,
  asyncHandler(async (req, res) => await deleteUser(req, res))
);

router.patch(
  "/:id/unlock",
  authenticateToken,
  asyncHandler(async (req, res) => await unlockUser(req, res))
); // Use unlockUser

router.get("/profile/:username", async (req, res) => {
  try {
    await getProfile(req, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});







module.exports = router;
