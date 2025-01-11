import axios from "axios";
import { API_BASE_URL } from "./config.js";
axios.defaults.withCredentials = true;

// Function to create a new user
export const createUser = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/user`, userData);
    return response.data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

// Function to get a list of users with optional filters
export const getAllUsers = async (page = 1, limit = 10, keyword) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/user`, {
      params: { page, limit, keyword },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

// Function to update a user's details
export const updateUser = async (userId, userData) => {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/user/${userId}`,
      userData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

// Function to unlock a user
export const unlockUser = async (userId) => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/user/unlock/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error unlocking user:", error);
    throw error;
  }
};

// Function to delete a user
export const deleteUser = async (userId) => {
  try {
    await axios.delete(`${API_BASE_URL}/user/${userId}`);
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

export default {
  createUser,
  getAllUsers, // Make sure to export this function
  updateUser,
  unlockUser,
  deleteUser,
};
