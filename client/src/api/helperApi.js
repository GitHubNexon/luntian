import axios from "axios";
import { API_BASE_URL } from "./config.js";

axios.defaults.withCredentials = true;

const helperApi = {
  getPlants: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/helper/plants`);
      return response.data;
    } catch (error) {
      console.error("Error fetching plants:", error);
      throw error;
    }
  },

  getDetections: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/helper/detections`);
      return response.data;
    } catch (error) {
      console.error("Error fetching detections:", error);
      throw error;
    }
  },
};

export default helperApi;
