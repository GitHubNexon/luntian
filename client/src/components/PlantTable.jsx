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
        diseaseName: disease.diseaseName,
        diseaseDescription: disease.diseaseDescription,
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
          className="object-cover w-full h-full rounded-lg shadow-md hover:scale-105 transform transition-all cursor-pointer"
        />
      </div>
    );
  };

  return (
    <div className="mx-auto p-10 shadow-lg rounded-lg ">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image and Plant Details Section */}
        <div className="md:col-span-1 flex flex-col items-center space-y-4 ">
          {renderImages(data.plantDetails.plantImage)}

          <div className="space-y-4 bg-gray-100 p-4 rounded-lg w-full ">
            <div>
              <span className="font-bold text-lg">Common Name:</span>
              <span className="text-gray-700">
                {renderData(data.plantDetails.commonName)}
              </span>
            </div>
            <div>
              <span className="font-bold text-lg">Scientific Name:</span>
              <span className="text-gray-700">
                {renderData(data.plantDetails.scientificName)}
              </span>
            </div>
            <div>
              <span className="font-bold text-lg">Family:</span>
              <span className="text-gray-700">
                {renderData(data.plantDetails.family)}
              </span>
            </div>
            <div>
              <span className="font-bold text-lg">Growth Stage:</span>
              <span className="text-gray-700">
                {renderData(data.plantDetails.growthStage)}
              </span>
            </div>
            <div>
              <span className="font-bold text-lg">Trivia:</span>
              <span className="text-gray-700">
                {renderData(data.plantDetails.trivia)}
              </span>
            </div>
            <div>
              <span className="font-bold text-lg">Description:</span>
              <span className="text-gray-700">
                {renderData(data.plantDetails.description)}
              </span>
            </div>
          </div>
        </div>

        {/* Disease Logs Section */}
        <div className="md:col-span-1  p-6 rounded-lg shadow-lg space-y-6">
          <span className="font-bold text-xl text-gray-800 mb-4">
            Plant Diseases
          </span>
          {filteredDiseaseLogs.map((log, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md grid grid-cols-2 space-x-2"
            >
              <div>
                {log.diseaseImages
                  .slice(0, showAllImages ? log.diseaseImages.length : 4)
                  .map((img, imgIndex) => (
                    <img
                      key={imgIndex}
                      src={img}
                      alt={`Disease Image ${imgIndex + 1}`}
                      className="w-full h-full object-cover rounded-md shadow-md hover:scale-105 transform transition-all cursor-pointer"
                      onClick={() => {
                        setSelectedImage(img);
                        setIsImageModalOpen(true);
                      }}
                    />
                  ))}
              </div>
              <div className="flex flex-col justify-between">
                <p className=" text-sm leading-relaxed text-center">
                  {log.diseaseDescription}
                </p>
                {log.diseaseImages.length > 4 && (
                  <button
                    className="mt-4 font-semibold hover:underline"
                    onClick={() => setShowAllImages(!showAllImages)}
                  >
                    {showAllImages ? "Show Less" : "Show More"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

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
              className="object-fill w-[50vw] h-[50vh] "
            />
          </div>
        </div>
      )}
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
          <h1 className="font-bold">Plant Library</h1>

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
