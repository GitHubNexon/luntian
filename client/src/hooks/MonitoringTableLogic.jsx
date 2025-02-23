import { useState, useEffect } from "react";
import MonitorApi from "../api/MonitorApi";

const MonitoringTableLogic = (initialPage = 1, initialLimit = 10, status = "") => {
  const [monitoring, setMonitoring] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [date, setDate] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await MonitorApi.getAllMonitoring(
        initialPage,
        initialLimit,
        searchQuery,
        sortBy,
        sortOrder,
        date,
        status
      );
      setMonitoring(response.monitoring);
      setTotalItems(response.totalItems);
      setTotalPages(Math.ceil(response.totalItems / initialLimit));
      console.log("monitoring fetched successfully", response.monitoring);
    } catch (error) {
      console.error("Error fetching monitoring:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [initialPage, initialLimit, searchQuery, sortBy, sortOrder, date, status]);

  const toggleSortOrder = (column) => {
    if (sortBy === column) {
      setSortOrder((prevOrder) => {
        const newOrder = prevOrder === "asc" ? "desc" : "asc";
        console.log(column, newOrder);
        return newOrder;
      });
    } else {
      setSortBy(column);
      setSortOrder("asc");
      console.log(column, "asc");
    }
  };

  return {
    monitoring,
    totalItems,
    totalPages,
    setMonitoring,
    loading,
    searchQuery,
    setSearchQuery,
    fetchData,
    sortBy,
    sortOrder,
    toggleSortOrder,
    setSortBy,
    setSortOrder,
    date,
    setDate,
  };
};

export default MonitoringTableLogic;
