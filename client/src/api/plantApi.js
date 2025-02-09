import axios from "axios";
import { API_BASE_URL } from "./config.js";

axios.defaults.withCredentials = true;

const plantApi = {
  // Method to fetch all plants with pagination, filtering, and sorting
  getAllPlants: async (
    page = 1,
    limit = 10,
    keyword = "",
    sortBy = "createdAt",
    sortOrder = "desc"
  ) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/plants/Get-All-Plants`,
        {
          params: {
            page,
            limit,
            keyword,
            sortBy,
            sortOrder,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching all plants:", error);
      throw error;
    }
  },

  // Method to add new plant details
  addPlantDetails: async (plantData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/plants`, plantData);
      return response.data;
    } catch (error) {
      console.error("Error adding plant details:", error);
      throw error;
    }
  },

  // Method to update plant details by ID
  updatePlantDetails: async (id, plantData) => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/plants/Update_Plant/${id}`,
        plantData
      );
      return response.data;
    } catch (error) {
      console.error("Error updating plant details:", error);
      throw error;
    }
  },

  // Method to delete plant details by ID
  deletePlantDetails: async (id) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/plants/Delete_Plant/${id}`
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting plant details:", error);
      throw error;
    }
  },
};

export default plantApi;
