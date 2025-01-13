import axios from "axios";
import { API_BASE_URL } from "./configFlask.js";

axios.defaults.withCredentials = true;

const detectionApi = {
  createImageDetection: async (data) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/yolo_v8/post_detection`,
        data
      );
      return response.data;
      console.log(response.data);
    } catch (error) {
      console.error("Error creating image detection:", error);
      throw error;
    }
  },

  getallDetections: async (
    page = 1,
    limit = 10,
    keyword = "",
    sortBy = "created_at",
    sortOrder = "desc"
  ) => {
    try {
      if (!keyword) keyword = null;
      if (!sortBy) sortBy = "created_at";

      const url = `${API_BASE_URL}/yolo_v8/get_all_detections`;

      console.log("Making request to:", url);
      console.log("Params:", { page, limit, keyword, sortBy, sortOrder });

      const response = await axios.get(url, {
        params: { page, limit, keyword, sortBy, sortOrder },
      });

      return response.data;
    } catch (error) {
      console.error("Error fetching detections:", error);
    }
  },

  updateDetectionById: async (id, data) => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/yolo_v8/update_detection/${id}`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error updating budget track:", error);
      throw error;
    }
  },

  deleteDetectionById: async (id) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/yolo_v8/delete_detection/${id}`
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting detection:", error);
      throw error;
    }
  },
};

export default detectionApi;
