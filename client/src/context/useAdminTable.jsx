import { useState, useEffect } from "react";
import accountApi from "../api/accountApi";

const useAdminTable = (
  initialPage = 1,
  initialLimit = 10,
  initialSearchQuery = ""
) => {
  // State for Users
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery); // Initialize with the passed query

  // Fetch Users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await accountApi.getAllUsers(
        initialPage,
        initialLimit,
        searchQuery
      );
      setUsers(response.users);
      setTotalItems(response.totalItems);
      setTotalPages(Math.ceil(response.totalItems / initialLimit));
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch users on page load and whenever dependencies change
  useEffect(() => {
    fetchUsers();
  }, [initialPage, initialLimit, searchQuery]); // Re-fetch whenever these change

  // Refetch users (could be called after an update)
  const refetchUsers = () => {
    fetchUsers();
  };

  return {
    // User-specific returns
    users,
    totalItems,
    totalPages,
    setUsers,
    setLoading,
    // Shared state and actions
    loading,
    searchQuery,
    setSearchQuery,
    fetchUsers, // In case you need to manually refetch users
    refetchUsers, // Function to refetch users
  };
};

export default useAdminTable;
