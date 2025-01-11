import { useState, useEffect } from "react";
// import BudgetTrackApi from "../api/BudgetTrackApi";
import detectionApi from "../api/detectionApi";

const BudgetTableLogic = (initialPage = 1, initialLimit = 10) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  //   const [date, setDate] = useState("");

  const fetchDetectionData = async () => {
    setLoading(true);
    try {
      const response = await detectionApi.getallDetections(
        initialPage,
        initialLimit,
        searchQuery,
        sortBy,
        sortOrder
        // date
      );
      setData(response.data);
      setTotalItems(response.totalItems);
      setTotalPages(Math.ceil(response.totalItems / initialLimit));
      console.log("Detection Data fetched successfully", response.data);
    } catch (error) {
      console.error("Error fetching Detection:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetectionData();
  }, [initialPage, initialLimit, searchQuery, sortBy, sortOrder]);

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
    data,
    totalItems,
    totalPages,
    setBudgets,

    loading,
    searchQuery,
    setSearchQuery,
    fetchDetectionData,
    sortBy,
    sortOrder,
    toggleSortOrder,
    setSortBy,
    setSortOrder,
    // date,
    // setDate,
  };
};

export default BudgetTableLogic;
