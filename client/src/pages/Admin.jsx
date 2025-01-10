import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { FaEdit, FaTrash, FaPlus, FaFileExcel, FaUnlock } from "react-icons/fa";
import UserModal from "../Modal/UserModal";
import { showToast } from "../utils/toastNotifications";
import * as XLSX from "xlsx";
import useAdminTable from "../context/useAdminTable"; // Adjust the import path if needed
import FileNameModal from "../Modal/FileNameModal"; // Ensure this path is correct
import axios from "axios";
import Sidebar from "../routes/Sidebar";
import { formatReadableDate } from "../helper/helper";

const Admin = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedUser, setSelectedUser] = useState(null);
  const [query, setQuery] = useState("");
  const [isFileNameModalOpen, setIsFileNameModalOpen] = useState(false);
  const [fileName, setFileName] = useState("");
  const [refreshTable, setRefreshTable] = useState(false);

  // Using custom hook for fetching users
  const {
    users,
    totalItems,
    loading,
    setSearchQuery,
    setUsers,
    setLoading,
    refetchUsers,
  } = useAdminTable(page, limit, query); // Pass query to the custom hook

  // Effect to handle search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setSearchQuery(query);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [query, setSearchQuery]);

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleModalOpenForAdd = () => {
    setModalMode("add");
    setIsModalOpen(true);
  };

  const handleModalOpenForEdit = (user) => {
    setModalMode("edit");
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = async (userId) => {
    setLoading(true);
    try {
      await axios.delete(`/user/${userId}`, { withCredentials: true });
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
      refresh(); // Optionally call refresh here if needed.
      showToast("User deleted successfully!", "success");
    } catch (error) {
      console.error("Error deleting user:", error);
      showToast("Error deleting user. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  // New handleUnlock function
  const handleUnlock = async (userId) => {
    setLoading(true);
    try {
      const response = await axios.patch(
        `/user/${userId}/unlock`,
        {},
        { withCredentials: true }
      );
      if (response.status === 200) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === userId ? { ...user, lockoutUntil: null } : user
          )
        );
        showToast("User unlocked successfully!", "success");
      }
    } catch (error) {
      console.error("Error unlocking user:", error);
      showToast("Error unlocking user. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAddOrEditUser = async (user) => {
    setLoading(true);
    try {
      if (modalMode === "add") {
        const response = await axios.post("/user", user, {
          withCredentials: true,
        });
        setUsers((prevUsers) => [...prevUsers, response.data]);
        refresh(); // Optionally call refresh here if needed.
        showToast("User added successfully!", "success");
      } else {
        const response = await axios.patch(`/user/${selectedUser._id}`, user, {
          withCredentials: true,
        });
        setUsers((prevUsers) =>
          prevUsers.map((u) => (u._id === selectedUser._id ? response.data : u))
        );
        showToast("User updated successfully!", "success");
      }
    } catch (error) {
      console.error("Error saving user:", error);
      showToast("Error saving user. Please try again.", "error");
    } finally {
      setLoading(false);
      handleModalClose();
      refresh(); // Call the refresh function after adding/editing user
    }
  };

  function refresh() {
    setRefreshTable(!refreshTable);
  }

  const exportToExcel = (name) => {
    const ws = XLSX.utils.json_to_sheet(
      users.map((user) => ({
        Username: user.username,
        Email: user.email,
        UserType: user.userType,
        schoolNumber: user.schoolNumber,
        DateCreated: new Date(user.dateTimestamp).toLocaleString(), // Corrected to dateTimestamp
        DateUpdated: new Date(user.dateUpdated).toLocaleString(),
      }))
    );

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Users");
    XLSX.writeFile(wb, `${name}.xlsx`);
  };

  const handleExportClick = () => {
    setIsFileNameModalOpen(true);
  };

  const handleFileNameSave = (name) => {
    setFileName(name);
    exportToExcel(name);
    setIsFileNameModalOpen(false); // Close the file name modal after saving
  };

  const columns = [
    { name: "Username", selector: (row) => row.username, sortable: true },
    { name: "Email", selector: (row) => row.email, sortable: true },
    { name: "User Type", selector: (row) => row.userType, sortable: true },
    {
      name: "Date Created",
      selector: (row) => formatReadableDate(row.dateTimestamp),
      sortable: true,
    },
    {
      name: "Date Updated",
      selector: (row) => formatReadableDate(row.dateUpdated),
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => (row.lockoutUntil ? "Locked" : "Active"),
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleModalOpenForEdit(row)}
            className="text-white bg-blue-600 p-2 rounded-md"
          >
            <FaEdit size={16} />
          </button>
          <button
            onClick={() => handleDelete(row._id)}
            className="text-white bg-red-600 p-2 rounded-md"
          >
            <FaTrash size={16} />
          </button>
          {/* Unlock button */}
          {row.lockoutUntil && (
            <button
              onClick={() => handleUnlock(row._id)}
              className="text-white bg-yellow-600 p-2 rounded-md"
            >
              <FaUnlock size={16} />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <Sidebar />
      <div className="p-4">
        <div className="flex flex-col sm:flex-row items-center mt-12 mx-4 sm:justify-between space-y-4 sm:space-y-0">
          <button
            onClick={handleModalOpenForAdd}
            className="bg-green-600 text-white rounded-md px-6 py-2 text-sm hover:scale-105 transition transform duration-300 flex items-center"
          >
            <FaPlus className="mr-2" /> Add User
          </button>

          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Search users..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="border p-2 rounded-md"
            />
            <button
              onClick={handleExportClick}
              className="bg-green-600 text-white p-2 rounded-md flex items-center"
            >
              <FaFileExcel size={16} className="mr-2" /> Export to Excel
            </button>
          </div>
        </div>

        <div className="overflow-x-auto m-4 scrollable-table-container overflow-y-auto truncate">
          <DataTable
            columns={columns}
            data={users}
            pagination
            paginationServer
            paginationPerPage={limit}
            paginationTotalRows={totalItems}
            onChangePage={(page) => setPage(page)}
            onChangeRowsPerPage={(newLimit) => {
              setLimit(newLimit);
              setPage(1);
            }}
            className="min-w-full bg-white border border-gray-200"
            progressPending={loading}
          />
        </div>

        <UserModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          mode={modalMode}
          user={selectedUser}
          onSaveUser={handleAddOrEditUser}
          refresh={refresh} // Pass the refresh function here
        />

        <FileNameModal
          isOpen={isFileNameModalOpen}
          onClose={() => setIsFileNameModalOpen(false)}
          onSave={handleFileNameSave}
        />
      </div>
    </>
  );
};

export default Admin;
