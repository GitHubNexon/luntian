import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaArrowRight,
  FaFileExcel,
  FaEye,
  FaFile,
  FaSync,
  FaChartBar,
  FaBacterium,
  FaVirus,
  FaDisease,
} from "react-icons/fa";
import { showToast } from "../utils/toastNotifications";
import showDialog from "../utils/showDialog";
import PlantTableLogic from "../hooks/PlantTableLogic";
import plantApi from "../api/plantApi";
import { numberToCurrencyString, formatReadableDate } from "../helper/helper";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { format } from "timeago.js";

const PlantTable = () => {
  const [expandedRows, setExpandedRows] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [modalMode, setModalMode] = useState("add");

  const [query, setQuery] = useState("");
  const handleSearch = (searchQuery) => {
    setQuery(searchQuery);
  };

  const {
    data,
    totalItems,
    loading,
    searchQuery,
    setSearchQuery,
    fetchData,
    sortBy,
    sortOrder,
    toggleSortOrder,
  } = PlantTableLogic(page, limit);

  // Debounce the search input
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setSearchQuery(query);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleModalOpen = () => {
    // showToast("Not working Yet!!!", "warning");
    setModalMode("add");
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedDetection(null);
  };

  const handleModalOpenForEdit = (data) => {
    setModalMode("edit");
    setSelectedDetection(data);
    setIsModalOpen(true);
  };

  const handleDeleteDetection = async (id) => {
    const confirmed = await showDialog.confirm(
      `Are you sure you want to delete this Detection?`
    );
    if (!confirmed) return;

    try {
      await plantApi.deletePlantDetails(id);
      fetchData();
      showToast("detection deleted successfully!", "success");
    } catch (error) {
      console.error("Error deleting detection:", error);
      showToast("Failed to delete detection. Please try again.", "error");
    }
  };

  const handleFetchLatest = async () => {
    fetchData();
    showToast("Detection  fetchDetectionData fetched successfully", "success");
  };

  const columns = [
    {
      name: "Common Name",
      cell: (row) => (
        <div
          className="table-cell text-[0.8em] break-words"
          data-full-text={row.plantDetails.commonName}
        >
          {row.plantDetails.commonName}
        </div>
      ),
      width: "300px",
    },
    {
      name: "Scientific Name",
      cell: (row) => (
        <div
          className="table-cell text-[0.8em] break-words"
          data-full-text={row.plantDetails.scientificName}
        >
          {row.plantDetails.scientificName}
        </div>
      ),
      width: "300px",
    },
    {
      name: "Species",
      cell: (row) => (
        <div
          className="table-cell text-[0.8em] break-words"
          data-full-text={row.plantDetails.species}
        >
          {row.plantDetails.species}
        </div>
      ),
      width: "300px",
    },

    {
      name: "Added At",
      cell: (row) => (
        <span
          className="table-cell text-[0.8em] break-words"
          //   data-full-text={
          //     formatReadableDate(row.created_at) -
          //     format(new Date(row.created_at))
          //   }
        >
          <div className="flex flex-col">
            <span>{formatReadableDate(row.createdAt)}</span>
            {/* <span>{format(new Date(row.createdAt))}</span> */}
          </div>
        </span>
      ),
      width: "300px",
    },
    {
      name: "Updated at",
      cell: (row) => (
        <span className="table-cell text-[0.8em] break-words">
          <div className="flex flex-col">
            <span>{formatReadableDate(row.createdAt)}</span>
            {/* <span>{format(new Date(row.createdAt))}</span> */}
          </div>
        </span>
      ),
      width: "300px",
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex space-x-2">
          {/* Edit Button */}
          <div className="group relative">
            <button
              onClick={() => handleModalOpenForEdit(row)}
              className=" p-2 rounded-md"
            >
              <FaEdit size={16} />
            </button>
            <span className="tooltip-text absolute hidden bg-gray-700 text-white text-nowrap text-[0.8em] p-2 rounded-md bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 group-hover:block transition-all duration-500">
              Edit
            </span>
          </div>

          {/* delete Button */}
          <div className="group relative">
            <button
              onClick={() => handleDeleteDetection(row._id)}
              className="0 p-2 rounded-md"
            >
              <FaTrash size={16} />
            </button>
            <span className="tooltip-text absolute hidden bg-gray-700 text-white text-nowrap text-[0.8em] p-2 rounded-md bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 group-hover:block transition-all duration-500">
              Delete
            </span>
          </div>
        </div>
      ),
    },
  ];

  function refreshTable() {
    fetchData();
  }

  return (
    <>
      <div className="mx-auto p-8">
        <div className="flex flex-col overflow-auto">
          <h1 className="font-bold">All Plant Diseases Detection</h1>

          <div className="flex flex-wrap space-y-3 md:space-y-0 md:space-x-2 overflow-x-auto p-3 items-center justify-end space-x-2 modeDiv">
            {/* <label htmlFor="date">Created At</label>
        <input
          type="date"
          value={date}
          onChange={handleDateChange}
          className="border px-2 py-1 rounded-md"
        /> */}
            <button
              onClick={handleFetchLatest}
              className="bg-[#38572ACC] text-white rounded-md px-6 py-2 text-sm hover:scale-105 transition transform duration-300 flex items-center"
            >
              <FaSync size={16} className="mr-2" />
              Fetch latest Data
            </button>
            <input
              type="text"
              placeholder={`Search...`}
              className="border px-2 py-1 rounded-md"
              onChange={(e) => setQuery(e.target.value)}
            />
            <button
              onClick={handleModalOpen}
              className="bg-[#38572ACC] text-white rounded-md px-6 py-2 text-sm hover:scale-105 transition transform duration-300 flex items-center"
            >
              <FaPlus size={16} className="mr-2" />
              Add new Plant
            </button>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={data}
          pagination
          paginationServer
          paginationTotalRows={totalItems}
          onChangePage={setPage}
          onChangeRowsPerPage={setLimit}
          progressPending={loading}
          //   expandableRows
          //   expandableRowsComponent={ExpandedRowComponent}
          //   expandableRowExpanded={(row) => expandedRows.includes(row._id)}
        />

        {/* {isDetectionModalOpen && (
          <DetectionModal
            mode={modalMode}
            isOpen={isDetectionModalOpen}
            onClose={handleModalClose}
            onSaveData={fetchDetectionData}
            data={selectedDetection}
            refreshTable={refreshTable}
          />
        )} */}
      </div>
    </>
  );
};

export default PlantTable;
