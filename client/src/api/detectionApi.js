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

  // getallDetections: async (
  //   page = 1,
  //   limit = 10,
  //   keyword = "",
  //   sortBy = "",
  //   sortOrder = "asc"
  // ) => {
  //   const response = await axios.get(
  //     `${API_BASE_URL}/yolo_v8/get_all_detections`,
  //     {
  //       params: { page, limit, keyword, sortBy, sortOrder },
  //     }
  //   );
  //   return response.data;
  // },

  getallDetections: async (
    page = 1,
    limit = 10,
    keyword = "",
    sortBy = "",
    sortOrder = "asc"
  ) => {
    try {
      if (!keyword) keyword = null; 
      if (!sortBy) sortBy = "defaultField"; 

      const url = `${API_BASE_URL}/yolo_v8/get_all_detections`;

      console.log("Making request to:", url);
      console.log("Params:", { page, limit, keyword, sortBy, sortOrder });

      // Perform the GET request
      const response = await axios.get(url, {
        params: { page, limit, keyword, sortBy, sortOrder },
      });

      // Return the response data
      return response.data;
    } catch (error) {
      // Log the error and throw it
      console.error("Error fetching detections:", error);
      throw error; // Rethrow or handle further if needed
    }
  },

  updateDetectionById: async (id, updatedData) => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/yolo_v8/update_detection/${id}`,
        updatedData
      );
      return response.data;
    } catch (error) {
      console.error("Error updating budget track:", error);
      throw error;
    }
  },
};

export default detectionApi;
