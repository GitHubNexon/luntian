import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import showDialog from "../utils/showDialog";
import { showToast } from "../utils/toastNotifications";
import MonitorApi from "../api/MonitorApi";
import { numberToCurrencyString, formatReadableDate } from "../helper/helper";
import { format } from "timeago.js";
import PlantsPicker from "../components/PlantsPicker";
import DetectionPicker from "../components/DetectionPicker";

const MonitoringModal = ({ isOpen, onClose, onSaveData, data, mode }) => {
  const [imageModal, setImageModal] = useState(false);
  const [imageDiseaseModal, setImageDiseaseModal] = useState(false);
  const [formData, setFormData] = useState({
    plantInfo: null,
    plantDiseaseInfo: null,
    location: "",
    description: "",
    Status: { isDelete: false, isArchived: false },
  });

  const handleGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData({
            ...formData,
            location: `Latitude: ${latitude}, Longitude: ${longitude}`,
          });
        },
        (error) => {
          console.error("Error getting geolocation", error);
          setFormData({
            ...formData,
            location: "Unable to retrieve location",
          });
        }
      );
    } else {
      setFormData({
        ...formData,
        location: "Geolocation not supported by this browser.",
      });
    }
  };

  const handleImageDiseaseClick = () => {
    setImageDiseaseModal(true); // Open modal when image is clicked
  };

  const handleCloseDiseaseModal = () => {
    setImageDiseaseModal(false); // Close modal
  };

  const handleImageClick = () => {
    setImageModal(true); // Open modal when image is clicked
  };

  const handleCloseModal = () => {
    setImageModal(false); // Close modal
  };

  useEffect(() => {
    if (mode === "edit" && data) {
      console.log("Editing data:", data);
      setFormData({ ...data });
    }
  }, [mode, data]);

  const handlePlantDiseaseSelect = (selectedPlant) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      plantDiseaseInfo: selectedPlant,
    }));
    console.log("Updated formData:", formData);
  };

  const handlePlantSelect = (selectedPlant) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      plantInfo: selectedPlant, // Store the whole selected object
    }));
    console.log("Updated formData:", formData); // Debugging
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value || "",
    }));
  };

  const validateForm = () => {
    // if (!formData.details) {
    //   showToast("Details are required.", "warning");
    //   return false;
    // }
    // if (formData.description.length === 0) {
    //   showToast("Description is required.", "warning");
    //   return false;
    // }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    try {
      if (mode === "edit") {
        showToast("Monitor data updated successfully!", "success");
        await MonitorApi.updateMonitoring(formData._id, formData);
        console.log("Monitor Updated", formData);
      } else {
        showToast("Monitor data saved successfully!", "success");
        await MonitorApi.createMonitoring(formData);
        console.log("Monitor Created", formData);
      }
      onSaveData(formData); // Save the data
      onClose();
    } catch (error) {
      console.error("Error submitting Monitor data:", error);
      showToast("Something went wrong. Please try again.", "error");
    }
  };
  if (!isOpen) return null;
  return (
    <>
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50 ">
        <div
          className="p-6 rounded-lg w-1/2 m-10 max-h-[90vh] bg-[#dff6d8] overflow-x-auto"
          data-aos="zoom-in"
          data-aos-duration="500"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">
              {mode === "edit" ? "Edit Monitoring" : "Add Monitoring"}
            </h2>
            <button
              onClick={async () => {
                const confirmed = await showDialog.confirm(
                  "Are you sure you want to close without saving?"
                );
                if (confirmed) {
                  onClose();
                }
              }}
            >
              <FaTimes size={25} />
            </button>
          </div>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <div className="flex flex-row item-start space-x-5">
              <div className="flex flex-col ">
                <label className="text-gray-700">Select a Plant</label>
                <PlantsPicker onSelect={handlePlantSelect} />
              </div>
              <div className="flex flex-col ">
                <label className="text-gray-700">Select a Detection</label>
                <DetectionPicker onSelect={handlePlantDiseaseSelect} />
              </div>
            </div>
            <div className="flex item-center flex-row ">
              {formData.plantInfo && (
                <div className="mt-6 max-w-md mx-auto p-8 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-bold text-gray-800">
                      Selected Plant
                    </h3>
                    <img
                      src={formData.plantInfo.plantDetails.plantImage}
                      alt={formData.plantInfo.plantDetails.commonName}
                      className="w-24 h-24 object-cover rounded-full border-2 border-gray-300 cursor-pointer transform transition-transform duration-300 ease-in-out hover:scale-110 "
                      onClick={handleImageClick} // Show modal on click
                    />
                  </div>
                  <div className="space-y-3">
                    <p>
                      <strong className="font-medium">Common Name:</strong>{" "}
                      {formData.plantInfo.plantDetails.commonName}
                    </p>
                    <p>
                      <strong className="font-medium">Scientific Name:</strong>{" "}
                      {formData.plantInfo.plantDetails.scientificName}
                    </p>
                    <p>
                      <strong className="font-medium">Family:</strong>{" "}
                      {formData.plantInfo.plantDetails.family}
                    </p>
                    <p>
                      <strong className="font-medium">Genus:</strong>{" "}
                      {formData.plantInfo.plantDetails.genus}
                    </p>
                    <p>
                      <strong className="font-medium">Species:</strong>{" "}
                      {formData.plantInfo.plantDetails.species}
                    </p>
                    <p>
                      <strong className="font-medium">Variety:</strong>{" "}
                      {formData.plantInfo.plantDetails.variety}
                    </p>
                    <p>
                      <strong className="font-medium">Age:</strong>{" "}
                      {formData.plantInfo.plantDetails.age}
                    </p>
                    <p>
                      <strong className="font-medium">Growth Stage:</strong>{" "}
                      {formData.plantInfo.plantDetails.growthStage}
                    </p>
                    <p>
                      <strong className="font-medium">Trivia:</strong>{" "}
                      {formData.plantInfo.plantDetails.trivia}
                    </p>
                  </div>
                </div>
              )}
              {formData.plantDiseaseInfo && (
                <div className="mt-6 max-w-md mx-auto p-8 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-bold text-gray-800">
                      Selected Disease Detection
                    </h3>
                    <img
                      src={
                        formData.plantDiseaseInfo.images[0].data.startsWith(
                          "data:image/jpeg;base64,"
                        )
                          ? formData.plantDiseaseInfo.images[0].data
                          : `data:image/jpeg;base64,${formData.plantDiseaseInfo.images[0].data}`
                      }
                      alt={formData.plantDiseaseInfo.description}
                      className="w-24 h-24 object-cover rounded-full border-2 border-gray-300 cursor-pointer transform transition-transform duration-300 ease-in-out hover:scale-110 "
                      onClick={handleImageDiseaseClick} // Show modal on click
                    />
                  </div>
                  <div className="space-y-3">
                    <p>
                      <strong className="font-medium">Date Detected:</strong>{" "}
                      {formatReadableDate(
                        formData.plantDiseaseInfo.images[0].date
                      )}
                    </p>
                    <p>
                      <strong className="font-medium">Image Result:</strong>{" "}
                      {formData.plantDiseaseInfo.image_result[0].count} -{" "}
                      {formData.plantDiseaseInfo.image_result[0].info}
                    </p>

                    <p>
                      <strong className="font-medium">Description:</strong>{" "}
                      {formData.plantDiseaseInfo.description}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col">
              <label htmlFor="description">Description</label>
              <textarea
                type="text"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded-md bg-gray-100 text-gray-500 resize-none h-[100px"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="location">Location</label>
              <div className="flex">
                <textarea
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  readOnly
                  className="border border-gray-300 p-2 rounded-md bg-gray-100 text-gray-500 resize-none h-[100px"
                />
                <button
                  type="button"
                  onClick={handleGeolocation}
                  className="ml-2 p-2 bg-blue-500 text-white rounded-md"
                >
                  Get Location
                </button>
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={handleSubmit}
                className="bg-[#38572ACC] text-white py-2 px-4 rounded-md hover:bg-[#213318cc]"
              >
                {mode === "edit" ? "Save Changes" : "Save"}
              </button>
            </div>
          </form>
        </div>
        {/* Modal for zoomed-in image */}
        {imageModal && (
          <div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            onClick={handleCloseModal}
          >
            <div
              className="bg-white p-6 rounded-lg shadow-lg max-w-4xl max-h-full overflow-auto relative"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on the image
            >
              <div className="relative">
                <img
                  src={formData.plantInfo.plantDetails.plantImage}
                  alt={formData.plantInfo.plantDetails.commonName}
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>
            </div>
          </div>
        )}

        {imageDiseaseModal && (
          <div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            onClick={handleCloseDiseaseModal}
          >
            <div
              className="bg-white p-6 rounded-lg shadow-lg max-w-4xl max-h-full overflow-auto relative"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on the image
            >
              <div className="relative">
                <img
                  src={
                    formData.plantDiseaseInfo.images[0].data.startsWith(
                      "data:image/jpeg;base64,"
                    )
                      ? formData.plantDiseaseInfo.images[0].data
                      : `data:image/jpeg;base64,${formData.plantDiseaseInfo.images[0].data}`
                  }
                  alt={formData.plantDiseaseInfo.description}
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MonitoringModal;
