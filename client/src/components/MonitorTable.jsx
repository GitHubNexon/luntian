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
  FaUndo,
  FaArchive,
} from "react-icons/fa";
import {
  MdDelete,
  MdArchive,
  MdCheckCircle,
  MdOutlineMonitorHeart,
} from "react-icons/md";
import { FaBookSkull } from "react-icons/fa6";
import { RiBankFill } from "react-icons/ri";
import { showToast } from "../utils/toastNotifications";
import showDialog from "../utils/showDialog";
import MonitoringTableLogic from "../hooks/MonitoringTableLogic";
import MonitorApi from "../api/MonitorApi";
import { numberToCurrencyString, formatReadableDate } from "../helper/helper";
import MonitoringModal from "../Modal/MonitoringModal";

const MonitorTable = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [status, setStatus] = useState("");
  const [expandedRows, setExpandedRows] = useState([]);
  const [selectedMonitoring, setSelectedMonitoring] = useState(null);
  const [isMonitoringModalOpen, setIsMonitoringModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");

  const [query, setQuery] = useState("");
  const handleSearch = (searchQuery) => {
    setQuery(searchQuery);
  };

  const {
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
  } = MonitoringTableLogic(page, limit, status);

  function refreshTable() {
    fetchData();
  }

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
    fetchDepreciation();
  };

  const handlePreviewClick = (monitoring) => {
    setSelectedMonitoring(monitoring);
    // setIsBankReconPreviewOpen(true);
  };

  // Debounce the search input
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setSearchQuery(query);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleModalOpen = () => {
    setModalMode("add");
    setIsMonitoringModalOpen(true);
  };

  const handleModalClose = () => {
    setIsMonitoringModalOpen(false);
    setSelectedMonitoring(null);
  };

  const handleDeleteEntry = async (id) => {
    const confirm = await showDialog.confirm(
      "Are you sure you want to delete this Monitoring?"
    );

    if (confirm) {
      try {
        const result = await MonitorApi.deleteMonitoring(id);

        if (result) {
          showDialog.showMessage("Monitoring deleted successfully", "success");
          fetchData();
        }
      } catch (error) {
        console.error("Failed to delete Monitoring:", error);
        showDialog.showMessage("Failed to delete Monitoring", "error");
      }
    }
  };

  const handleUndoDeleteEntry = async (id) => {
    const confirm = await showDialog.confirm(
      "Are you sure you want to undo the deletion of this Monitoring?"
    );

    if (confirm) {
      try {
        const result = await MonitorApi.undoDeleteMonitoring(id);

        if (result) {
          showDialog.showMessage(
            "Monitoring restoration successful",
            "success"
          );
          fetchData();
        }
      } catch (error) {
        console.error("Failed to undo deletion:", error);
        showDialog.showMessage("Failed to undo deletion", "error");
      }
    }
  };

  const handleArchiveEntry = async (id) => {
    const confirm = await showDialog.confirm(
      "Are you sure you want to archive this Monitoring?"
    );

    if (confirm) {
      try {
        const result = await MonitorApi.archiveMonitoring(id);

        if (result) {
          showDialog.showMessage("Monitoring archive successfully", "success");
          fetchDepreciation();
        }
      } catch (error) {
        console.error("Failed to archive Monitoring:", error);
        showDialog.showMessage("Failed to archive Monitoring", "error");
      }
    }
  };

  const handleUndoArchiveEntry = async (id) => {
    const confirm = await showDialog.confirm(
      "Are you sure you want to undo the archive of this Monitoring?"
    );

    if (confirm) {
      try {
        const result = await MonitorApi.undoArchiveMonitoring(id);

        if (result) {
          showDialog.showMessage(
            "Monitoring restoration successful",
            "success"
          );
          fetchData();
        }
      } catch (error) {
        console.error("Failed to undo archive:", error);
        showDialog.showMessage("Failed to undo archive", "error");
      }
    }
  };

  const handleModalOpenForEdit = (monitoring) => {
    setModalMode("edit");
    setSelectedMonitoring(monitoring);
    setIsMonitoringModalOpen(true);
  };

  const handleFetchLatest = async () => {
    fetchData();
    showToast("Updated data fetched successfully", "success");
  };

  const sortByDate = (property) => (rowA, rowB) => {
    const dateA = new Date(rowA[property]);
    const dateB = new Date(rowB[property]);
    return dateA - dateB;
  };

  const sortByAcquisitionDate = (property) => (rowA, rowB) => {
    const dateA = new Date(rowA[property]);
    const dateB = new Date(rowB[property]);
    return dateA - dateB;
  };

  const columns = [
    {
      name: "Status",
      cell: (row) => {
        if (row.Status.isDeleted) {
          return (
            <span className="text-red-500 flex items-center">Deleted</span>
          );
        }
        if (row.Status.isArchived) {
          return (
            <span className="text-orange-500 flex items-center">Archived</span>
          );
        }
        return <span className="text-green-500 flex items-center">Active</span>;
      },
      width: "120px",
    },
    {
      name: "CommonName",
      selector: (row) => row.plantInfo.plantDetails.commonName || "",
      width: "200px",
    },
    {
      name: "Disease Detected",
      selector: (row) => row.plantDiseaseInfo.image_result[0].info || "",
      width: "200px",
    },
    {
      name: "location",
      selector: (row) => row.location || "",
      width: "400px",
    },

    // {
    //   name: "Acquisition Date",
    //   selector: (row) =>
    //     row.AcquisitionDate
    //       ? formatReadableDate(row.AcquisitionDate)
    //       : "No Date Yet",
    // },
    // {
    //   name: "Created At",
    //   id: "createdAt",
    //   selector: (row) => formatReadableDate(row.createdAt),
    //   sortable: true,
    //   sortFunction: sortByDate("createdAt"),
    //   sortDirection: sortOrder,
    //   onClick: () => toggleSortOrder("createdAt"),
    // },
    // {
    //   name: "Prepared By",
    //   selector: (row) => row.PreparedBy?.name || "-",
    // },
    // {
    //   name: "Reference",
    //   cell: (row) => (
    //     <div
    //       className="table-cell text-[0.8em] break-words"
    //       data-full-text={row.Reference}
    //     >
    //       {row.Reference}
    //     </div>
    //   ),
    //   width: "300px",
    // },
    // {
    //   name: "Asset Description",
    //   width: "300px",
    //   selector: (row) => row.AssetDescription || "",
    // },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex space-x-2">
          {/* Edit Button */}
          <div className="group relative">
            <button
              onClick={() => handleModalOpenForEdit(row)}
              className="text-white bg-blue-600 p-2 rounded-md"
            >
              <FaEdit size={16} />
            </button>
            <span className="tooltip-text absolute hidden bg-gray-700 text-white text-nowrap text-[0.8em] p-2 rounded-md bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 group-hover:block transition-all duration-500">
              Edit
            </span>
          </div>

          {/* Conditional Delete or Undo Button */}
          {row.Status?.isDeleted ? (
            // If the record is deleted, show the "Undo Delete" button
            <div className="group relative">
              <button
                onClick={() => handleUndoDeleteEntry(row._id)}
                className="text-white bg-yellow-600 p-2 rounded-md"
              >
                <FaUndo size={16} />
              </button>
              <span className="tooltip-text absolute hidden bg-gray-700 text-white text-nowrap text-[0.8em] p-2 rounded-md bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 group-hover:block transition-all duration-500">
                Undo Delete
              </span>
            </div>
          ) : !row.Status?.isArchived ? (
            <div className="group relative">
              <button
                onClick={() => handleDeleteEntry(row._id)}
                className="text-white bg-red-600 p-2 rounded-md"
              >
                <FaTrash size={16} />
              </button>
              <span className="tooltip-text absolute hidden bg-gray-700 text-white text-nowrap text-[0.8em] p-2 rounded-md bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 group-hover:block transition-all duration-500">
                Delete
              </span>
            </div>
          ) : null}

          {/* Conditional Archive or Undo Button */}
          {row.Status?.isArchived ? (
            <div className="group relative">
              <button
                onClick={() => handleUndoArchiveEntry(row._id)}
                className="text-white bg-yellow-600 p-2 rounded-md"
              >
                <FaUndo size={16} />
              </button>
              <span className="tooltip-text absolute hidden bg-gray-700 text-white text-nowrap text-[0.8em] p-2 rounded-md bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 group-hover:block transition-all duration-500">
                Undo Archive
              </span>
            </div>
          ) : !row.Status?.isDeleted ? (
            // If the record is not deleted and not archived, show the "Archive" button
            <div className="group relative">
              <button
                onClick={() => handleArchiveEntry(row._id)}
                className="text-white bg-orange-600 p-2 rounded-md"
              >
                <FaArchive size={16} />
              </button>
              <span className="tooltip-text absolute hidden bg-gray-700 text-white text-nowrap text-[0.8em] p-2 rounded-md bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 group-hover:block transition-all duration-500">
                Archive
              </span>
            </div>
          ) : null}
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="mx-auto p-8">
        <div className="flex flex-col overflow-auto">
          <MdOutlineMonitorHeart size={20} />
          <h1 className="font-bold">Monitoring</h1>

          <div className="flex flex-wrap space-y-3 md:space-y-0 md:space-x-2 overflow-x-auto p-3 items-center justify-end space-x-2">
            <button
              onClick={handleFetchLatest}
              className="bg-blue-600 text-white rounded-md px-6 py-2 text-sm hover:scale-105 transition transform duration-300 flex items-center"
            >
              <FaSync size={16} className="mr-2" />
              Fetch latest Data
            </button>

            {/* Status Filter Dropdown */}
            <select
              className="border px-2 py-1 rounded-md"
              value={status}
              onChange={handleStatusChange}
            >
              <option value="">All</option>
              <option value="isDeleted">Deleted</option>
              <option value="isArchived">Archived</option>
            </select>

            <input
              type="text"
              placeholder={`Search Entries`}
              className="border px-2 py-1 rounded-md"
              onChange={(e) => setQuery(e.target.value)}
            />
            <button
              onClick={handleModalOpen}
              className="bg-blue-600 text-white rounded-md px-6 py-2 text-sm hover:scale-105 transition transform duration-300 flex items-center"
            >
              <FaPlus size={16} className="mr-2" />
              Create
            </button>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={monitoring}
          pagination
          paginationServer
          paginationTotalRows={totalItems}
          onChangePage={setPage}
          onChangeRowsPerPage={setLimit}
          progressPending={loading}
          //   expandableRows
          //   expandableRowsComponent={ExpandedRowComponent}
          //   expandableRowExpanded={(row) => expandedRows.includes(row._id)}
          // selectableRows
          sortServer={true}
          sortColumn={sortBy}
          sortDirection={sortOrder}
          onSort={(column) => toggleSortOrder(column.id)}
        />

        {isMonitoringModalOpen && (
          <MonitoringModal
            mode={modalMode}
            isOpen={isMonitoringModalOpen}
            onClose={handleModalClose}
            onSaveData={fetchData}
            data={selectedMonitoring}
            refreshTable={refreshTable}
          />
        )}

        {/* {isBankReconPreviewOpen && (
      <BankReconPreview
        isOpen={isBankReconPreviewOpen}
        onClose={() => setIsBankReconPreviewOpen(false)}
        bankRecon={selectedBankRecon}
      />
    )} */}
      </div>
    </>
  );
};

export default MonitorTable;
