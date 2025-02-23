import axios from "axios";
import { API_BASE_URL } from "./config.js";

axios.defaults.withCredentials = true;

const MonitorApi = {
  createMonitoring: async (data) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/monitoring/create`,
        data
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Error creating monitoring:", error.message);
      throw error;
    }
  },

  updateMonitoring: async (id, data) => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/monitoring/update/${id}`,
        data
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating monitoring:", error.message);
      throw error;
    }
  },

  getAllMonitoring: async (
    page = 1,
    limit = 10,
    keyword = "",
    sortBy = "",
    sortOrder = "asc",
    date = "",
    status = ""
  ) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/monitoring/all`, {
        params: { page, limit, keyword, sortBy, sortOrder, date, status },
      });
      console.log(response);
      return response.data;
    } catch (error) {
      console.error("Error fetching monitoring data:", error);
      throw error;
    }
  },

  deleteMonitoring: async (id) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/monitoring/delete/${id}`
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Error deleting monitoring:", error.message);
      throw error;
    }
  },

  archiveMonitoring: async (id) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/monitoring/archive/${id}`
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Error archiving monitoring:", error.message);
      throw error;
    }
  },

  undoDeleteMonitoring: async (id) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/monitoring/undo-delete/${id}`
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Error undoing delete monitoring:", error.message);
      throw error;
    }
  },

  undoArchiveMonitoring: async (id) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/monitoring/undo-archive/${id}`
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Error undoing archive monitoring:", error.message);
      throw error;
    }
  },
};

export default MonitorApi;
