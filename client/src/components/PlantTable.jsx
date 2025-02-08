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
import PlantModal from "../Modal/PlantModal";

const ExpandedRowComponent = ({ data }) => {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [filteredDiseaseLogs, setFilteredDiseaseLogs] = useState([]);
  const [showAllImages, setShowAllImages] = useState(false);

  useEffect(() => {
    if (data && data.plantDiseases) {
      const updatedFilteredLogs = data.plantDiseases.map((disease) => ({
        diseaseType: disease.diseaseType,
        commonDisease: disease.commonDisease.join(", "),
        // Ensure diseaseImage is always an array
        diseaseImages: disease.diseaseImage ? [disease.diseaseImage] : [],
      }));
      setFilteredDiseaseLogs(updatedFilteredLogs);
    }
  }, [data]);

  const renderData = (value) => (value ? value : "N/A");

  const renderImages = (imageBase64) => {
    if (!imageBase64) return null;
    return (
      <div
        className="relative w-64 h-64 cursor-pointer"
        onClick={() => {
          setSelectedImage(imageBase64);
          setIsImageModalOpen(true);
        }}
      >
        <img
          src={imageBase64}
          alt="Plant"
          className="object-cover w-full h-full rounded-lg shadow-md"
        />
      </div>
    );
  };

  return (
    <div className=" mx-auto p-10 bg-white shadow-lg rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Image Section */}
        <div className="md:col-span-1 flex justify-center">
          {renderImages(data.plantDetails.plantImage)}
        </div>

        {/* Details Section */}
        <div className="md:col-span-2 space-y-4">
          {isImageModalOpen && selectedImage && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              onClick={() => setIsImageModalOpen(false)}
            >
              <div
                className="relative bg-white p-4 rounded-lg shadow-lg"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={selectedImage}
                  alt="Expanded view"
                  className="object-contain w-full h-full"
                />
              </div>
            </div>
          )}

          {/* Plant Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-100 p-4 rounded-lg">
            <div>
              <span className="font-bold text-lg">Common Name:</span>
              <span className="text-gray-700">
                {" "}
                {renderData(data.plantDetails.commonName)}
              </span>
            </div>
            <div>
              <span className="font-bold text-lg">Scientific Name:</span>
              <span className="text-gray-700">
                {" "}
                {renderData(data.plantDetails.scientificName)}
              </span>
            </div>
            <div>
              <span className="font-bold text-lg">Family:</span>
              <span className="text-gray-700">
                {" "}
                {renderData(data.plantDetails.family)}
              </span>
            </div>
            <div>
              <span className="font-bold text-lg">Growth Stage:</span>
              <span className="text-gray-700">
                {" "}
                {renderData(data.plantDetails.growthStage)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Disease Logs */}
        <div className="mt-8 p-6 bg-gray-50 rounded-lg shadow">
          <span className="font-bold text-lg block mb-4">Plant Diseases:</span>
          <div className="space-y-4">
            {filteredDiseaseLogs.map((log, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-md">
                <span className="text-gray-700 font-medium">
                  {log.commonDisease} ({log.diseaseType})
                </span>
                <div
                  className={`grid ${
                    log.diseaseImages.length > 4
                      ? "grid-cols-2"
                      : "flex flex-wrap"
                  } gap-2 mt-2`}
                >
                  {log.diseaseImages
                    .slice(0, showAllImages ? log.diseaseImages.length : 4)
                    .map((img, imgIndex) => (
                      <img
                        key={imgIndex}
                        src={img}
                        alt={`Disease Image ${imgIndex + 1}`}
                        className="w-32 h-32 object-cover rounded-md shadow-md cursor-pointer"
                        onClick={() => {
                          setSelectedImage(img);
                          setIsImageModalOpen(true);
                        }}
                      />
                    ))}
                </div>
                {log.diseaseImages.length > 4 && (
                  <button
                    className="mt-2 text-blue-500 font-semibold"
                    onClick={() => setShowAllImages(!showAllImages)}
                  >
                    {showAllImages ? "Show Less" : "Show More"}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
    </div>
  );
};
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
    setSelectedPlant(null);
  };

  const handleModalOpenForEdit = (data) => {
    setModalMode("edit");
    setSelectedPlant(data);
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
          expandableRows
          expandableRowsComponent={ExpandedRowComponent}
          expandableRowExpanded={(row) => expandedRows.includes(row._id)}
        />

        {isModalOpen && (
          <PlantModal
            mode={modalMode}
            isOpen={isModalOpen}
            onClose={handleModalClose}
            onSaveData={fetchData}
            data={selectedPlant}
            refreshTable={refreshTable}
          />
        )}
      </div>
    </>
  );
};

export default PlantTable;
