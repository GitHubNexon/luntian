import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import axios from "axios";
axios.defaults.withCredentials = true;
import useBase from "../context/useBase";
import { showToast } from "../utils/toastNotifications"; // Import the toast utility
import { useLoader } from "../context/useLoader"; // Import the LoaderContext

const UserModal = ({ isOpen, onClose, mode, user, onSaveUser, refresh }) => {
  // const { userTypes } = useBase(); // Fetching userTypes from the custom hook
  const { userTypes } = useBase(); // Fetching data from useBase hook

  // Initialize state for fields
  const { loading } = useLoader(); // Access the loading function from the LoaderContext
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [userType, setUserType] = useState(""); // State for selected userType
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  useEffect(() => {
    console.log("User object:", user); // Log the user object
    if (mode === "edit" && user) {
      setUsername(user.username || "");
      setEmail(user.email || "");
      setUserType(user.userType || ""); // Set the userType if editing
    } else {
      resetFields();
    }
  }, [mode, user]);

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      return "Password must be at least 8 characters long.";
    }
    if (!hasUppercase) {
      return "Password must contain at least 1 uppercase letter.";
    }
    if (!hasLowercase) {
      return "Password must contain at least 1 lowercase letter.";
    }
    if (!hasNumber) {
      return "Password must contain at least 1 number.";
    }
    if (!hasSpecial) {
      return "Password must contain at least 1 special character.";
    }

    return "";
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    const validationError = validatePassword(newPassword);
    setError(validationError);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error state

    const passwordError = validatePassword(password);
    if (mode === "add" && passwordError) {
      setError(passwordError);
      showToast(passwordError, "warning");
      return;
    }

    // Check required fields
    const isMissingFields =
      !username || !email || !userType || (mode === "add" && !password);

    if (isMissingFields) {
      const missingFields = [];
      if (!username) missingFields.push("Username");
      if (!email) missingFields.push("Email");
      if (!userType) missingFields.push("User Type");
      if (mode === "add" && !password) missingFields.push("Password");

      const errorMessage = `Please fill in the following required fields: ${missingFields.join(
        ", "
      )}.`;
      setError(errorMessage);
      showToast(errorMessage, "warning");
      return;
    }

    try {
      const newUser = {
        username,
        email,
        userType, // Add userType here
        ...(mode === "add" && { password }), // Include password if adding a new user
      };

      if (mode === "add") {
        await axios.post("/user", newUser);
        showToast("Added successfully!", "success");
        resetFields();
        refresh();
      } else if (mode === "edit") {
        if (newPassword) {
          const newPasswordError = validatePassword(newPassword);
          if (newPasswordError) {
            setError(newPasswordError);
            showToast(newPasswordError, "warning");
            return;
          }
          newUser.password = newPassword;
        } else {
          delete newUser.password;
        }

        const isUnchanged = Object.keys(newUser).every(
          (key) => newUser[key] === user[key]
        );

        if (isUnchanged) {
          showToast("No changes detected.", "warning");
          return;
        }

        await axios.patch(`/user/${user._id}`, newUser);
        showToast("Edited successfully!", "success");
        refresh();
      }

      setTimeout(() => {
        window.location.reload();
        onClose();
      });
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      console.error("Error response:", error.response);

      setError(
        error.response?.data?.message ||
          "An error occurred while saving the user."
      );
      showToast(error.response?.data?.message || "An error occurred.", "error");
    }
  };

  const handleClear = () => {
    resetFields();
    setError(""); // Clear the error state when cancelling
  };

  const resetFields = () => {
    setUsername("");
    setEmail("");
    setPassword("");
    setNewPassword("");
    setUserType(""); // Reset userType
    setError(""); // Clear the error state
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50 modal transition duration-500 ${
        isOpen ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg relative w-[400px] max-w-full max-h-[90vh] overflow-y-auto"
        data-aos="zoom-in"
        data-aos-duration="500"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-2 text-gray-500 hover:text-gray-800"
        >
          <FaTimes size={25} />
        </button>
        <h2 className="text-lg font-semibold mb-4">
          {mode === "add" ? "Add New User" : "Edit User"}
        </h2>
        <form onSubmit={handleSubmit}>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <div className="mb-4">
            <label className="block text-gray-700">Username *</label>
            <input
              type="text"
              value={username}
              placeholder="Enter Username"
              onChange={(e) => setUsername(e.target.value)}
              className="border border-gray-300 rounded-md px-4 py-2 w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Email *</label>
            <input
              type="email"
              value={email}
              placeholder="Enter Email Address"
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 rounded-md px-4 py-2 w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">User Type *</label>
            <select
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              className="border border-gray-300 rounded-md px-4 py-2 w-full"
              required
            >
              <option value="">Select User Type</option>
              {userTypes.map((type) => (
                <option key={type._id} value={type.user}>
                  {" "}
                  {/* Use type.user instead of type._id */}
                  {type.user} {/* Adjusted to display the user type name */}
                </option>
              ))}
            </select>
          </div>

          {mode === "add" && (
            <div className="mb-4">
              <label className="block text-gray-700">Password *</label>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                placeholder="Enter Password"
                onChange={handlePasswordChange}
                className="border border-gray-300 rounded-md px-4 py-2 w-full"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="mt-1 text-blue-500 hover:text-blue-700"
              >
                {showPassword ? "Hide Password" : "Show Password"}
              </button>
            </div>
          )}
          {mode === "edit" && (
            <div className="mb-4">
              <label className="block text-gray-700">New Password</label>
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                placeholder="Enter New Password (optional)"
                onChange={(e) => setNewPassword(e.target.value)}
                className="border border-gray-300 rounded-md px-4 py-2 w-full"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="mt-1 text-blue-500 hover:text-blue-700"
              >
                {showNewPassword ? "Hide Password" : "Show Password"}
              </button>
            </div>
          )}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => {
                handleClear();
                onClose();
              }}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
              // disabled={loading}
            >
              {loading ? "Save" : mode === "add" ? "Add User" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;
