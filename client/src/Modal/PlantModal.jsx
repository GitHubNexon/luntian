import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import showDialog from "../utils/showDialog";
import { showToast } from "../utils/toastNotifications";
import plantApi from "../api/plantApi";
import { numberToCurrencyString, formatReadableDate } from "../helper/helper";
import { format } from "timeago.js";

const PlantModal = ({ isOpen, onClose, onSaveData, data, mode }) => {
  const [formData, setFormData] = useState({
    plantDetails: {
      commonName: "",
      plantImage: "",
      scientificName: "",
      family: "",
      genus: "",
      species: "",
      variety: "",
      age: 0,
      growthStage: "",
      trivia: "",
      description: "",
    },
    plantDiseases: [
      {
        diseaseImage: "",
        commonDisease: [],
        diseaseType: "",
      },
    ],
  });

  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [newDescription, setNewDescription] = useState("");

  const handleAddDescription = () => {
    if (newDescription.trim()) {
      setFormData((prevData) => ({
        ...prevData,
        description: [...prevData.description, newDescription.trim()],
      }));
      setNewDescription(""); // Reset the input after adding
    }
  };

  const handleRemoveDescription = (indexToRemove) => {
    setFormData((prevData) => ({
      ...prevData,
      description: prevData.description.filter(
        (_, index) => index !== indexToRemove
      ),
    }));
  };

  if (!isOpen) return null;

  useEffect(() => {
    if (mode === "edit" && data) {
      console.log("Editing data:", data); // Debugging log
      setFormData({ ...data });
    }
  }, [mode, data]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      plantDetails: {
        ...prevData.plantDetails,
        [name]: value || "",
      },
    }));
  };

  // Handle changes for plant diseases
  const handleDiseaseChange = (index, e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      plantDiseases: prevData.plantDiseases.map((disease, i) =>
        i === index ? { ...disease, [name]: value } : disease
      ),
    }));
  };

  // Handle image upload for diseases
  const handleDiseaseImageUpload = (index, e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prevData) => ({
        ...prevData,
        plantDiseases: prevData.plantDiseases.map((disease, i) =>
          i === index ? { ...disease, diseaseImage: reader.result } : disease
        ),
      }));
    };
    reader.readAsDataURL(file);
  };

  // Add a new disease entry
  const handleAddDisease = () => {
    setFormData((prevData) => ({
      ...prevData,
      plantDiseases: [
        ...prevData.plantDiseases,
        { commonDisease: "", diseaseType: "", diseaseImage: "" },
      ],
    }));
  };

  // Remove a disease entry
  const handleRemoveDisease = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      plantDiseases: prevData.plantDiseases.filter((_, i) => i !== index),
    }));
  };

  const handleReset = () => {
    setFormData({});
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

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const imageData = reader.result; // Get base64 image data

      setFormData((prevData) => ({
        ...prevData,
        plantDetails: {
          ...prevData.plantDetails,
          plantImage: imageData, // Store it as a string
        },
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    try {
      if (mode === "edit") {
        showToast("Plant data updated successfully!", "success");
        await plantApi.updatePlantDetails(formData._id, formData);
      } else {
        showToast("Plant data saved successfully!", "success");
        await plantApi.addPlantDetails(formData);
        console.log(formData);
      }
      onSaveData(formData); // Save the data
      onClose();
    } catch (error) {
      console.error("Error submitting Plant data:", error);
      showToast("Something went wrong. Please try again.", "error");
    }
  };

  const openImageModal = () => {
    setIsImageModalOpen(true);
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
  };

  return (
    <>
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
        <div className="p-6 rounded-lg m-10 overflow-y-auto max-h-[90vh] modeDiv">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">
              {mode === "edit" ? "Edit Plant" : "Add Plant"}
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
          <form className="space-y-4">
            <div className="flex flex-col items-stretch justify-center text-[0.7em] space-y-2">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ">
                <div className="flex flex-col">
                  <label htmlFor="commonName" className="text-gray-700">
                    Plant Name
                  </label>
                  <input
                    type="text"
                    id="commonName"
                    name="commonName"
                    value={formData.plantDetails.commonName}
                    onChange={handleChange}
                    className="border border-gray-300 p-2 rounded-md bg-gray-100 text-gray-500"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="scientificName" className="text-gray-700">
                    Scientific Name
                  </label>
                  <input
                    type="text"
                    id="scientificName"
                    name="scientificName"
                    value={formData.plantDetails.scientificName}
                    onChange={handleChange}
                    className="border border-gray-300 p-2 rounded-md bg-gray-100 text-gray-500"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="family" className="text-gray-700">
                    Family
                  </label>
                  <input
                    type="text"
                    id="family"
                    name="family"
                    value={formData.plantDetails.family}
                    onChange={handleChange}
                    className="border border-gray-300 p-2 rounded-md bg-gray-100 text-gray-500"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="genus" className="text-gray-700">
                    Genus
                  </label>
                  <input
                    type="text"
                    id="genus"
                    name="genus"
                    value={formData.plantDetails.genus}
                    onChange={handleChange}
                    className="border border-gray-300 p-2 rounded-md bg-gray-100 text-gray-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ">
                <div className="flex flex-col">
                  <label htmlFor="species" className="text-gray-700">
                    Species
                  </label>
                  <input
                    type="text"
                    id="species"
                    name="species"
                    value={formData.plantDetails.species}
                    onChange={handleChange}
                    className="border border-gray-300 p-2 rounded-md bg-gray-100 text-gray-500"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="variety" className="text-gray-700">
                    Variety (seperate by Comma)
                  </label>
                  <input
                    type="text"
                    id="variety"
                    name="variety"
                    value={formData.plantDetails.variety}
                    onChange={handleChange}
                    className="border border-gray-300 p-2 rounded-md bg-gray-100 text-gray-500"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="age" className="text-gray-700">
                    Age
                  </label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    value={formData.plantDetails.age || 0}
                    onChange={handleChange}
                    className="border border-gray-300 p-2 rounded-md bg-gray-100 text-gray-500"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="growthStage" className="text-gray-700">
                    Growth Stage
                  </label>
                  <input
                    type="text"
                    id="growthStage"
                    name="growthStage"
                    value={formData.plantDetails.growthStage}
                    onChange={handleChange}
                    className="border border-gray-300 p-2 rounded-md bg-gray-100 text-gray-500"
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <label htmlFor="trivia" className="text-gray-700">
                  Trivia
                </label>
                <textarea
                  type="text"
                  id="trivia"
                  name="trivia"
                  value={formData.plantDetails.trivia}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 rounded-md bg-gray-100 text-gray-500 resize-none h-[100px]"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="description" className="text-gray-700">
                  Description
                </label>
                <textarea
                  type="text"
                  id="description"
                  name="description"
                  value={formData.plantDetails.description}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 rounded-md bg-gray-100 text-gray-500 resize-none h-[100px]"
                />
              </div>

              {/* plants */}
              <div className="flex flex-col">
                <>
                  <label htmlFor="images" className="text-gray-700">
                    Upload Image for Plant
                  </label>
                  <input
                    type="file"
                    id="images"
                    onChange={handleImageUpload}
                    className="border border-gray-300 p-2 rounded-md bg-gray-100 text-gray-500"
                  />
                </>
                {formData.plantDetails.plantImage && (
                  <div className="mt-2">
                    <h3>Uploaded Image:</h3>
                    <div
                      className="mt-2 cursor-pointer"
                      onClick={openImageModal}
                    >
                      <img
                        src={formData.plantDetails.plantImage}
                        // src={`data:image/jpeg;base64,${formData.plantDetails.plantImage}`}
                        alt="Uploaded Plant"
                        className="w-20 h-20 object-cover rounded-md"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Plant Diseases */}
              <div>
                <h3 className="font-bold">Plant Diseases</h3>
                {formData.plantDiseases.map((disease, index) => (
                  <div key={index} className="border p-2 rounded-md mt-2">
                    <input
                      type="text"
                      name="commonDisease"
                      value={disease.commonDisease}
                      onChange={(e) => handleDiseaseChange(index, e)}
                      placeholder="Common Disease"
                      className="border border-gray-300 p-2 rounded-md bg-gray-100 text-gray-500 w-full mt-2"
                    />
                    <input
                      type="text"
                      name="diseaseType"
                      value={disease.diseaseType}
                      onChange={(e) => handleDiseaseChange(index, e)}
                      placeholder="Disease Type"
                      className="border border-gray-300 p-2 rounded-md bg-gray-100 text-gray-500 w-full mt-2"
                    />
                    <input
                      type="file"
                      onChange={(e) => handleDiseaseImageUpload(index, e)}
                      className="border p-2 rounded-md w-full mt-2"
                    />
                    {/* {disease.diseaseImage && (
                      <img
                        src={disease.diseaseImage}
                        alt="Disease"
                        className="w-20 h-20 object-cover mt-2 rounded-md"
                      />
                    )} */}
                    {disease.diseaseImage && (
                      <div className="mt-2">
                        <h3>Uploaded Image:</h3>
                        <div
                          className="mt-2 cursor-pointer"
                          onClick={() => openImageModal(disease.diseaseImage)}
                        >
                          <img
                            src={disease.diseaseImage}
                            alt="Uploaded Disease"
                            className="w-20 h-20 object-cover rounded-md"
                          />
                        </div>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => handleRemoveDisease(index)}
                      className="bg-red-500 text-white p-2 rounded-md mt-2"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddDisease}
                  className="bg-blue-500 text-white p-2 rounded-md mt-2"
                >
                  Add Disease
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
      </div>

      {/* Image Modal */}
      {isImageModalOpen && formData.plantDetails.plantImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={closeImageModal}
        >
          <div
            className="relative bg-white p-4 rounded-lg max-w-full max-h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={formData.plantDetails.plantImage}
              //   src={`data:image/jpeg;base64,${formData.plantDetails.plantImage}`}
              alt="Expanded view"
              className="object-contain w-full h-full"
              style={{ maxWidth: "100vw", maxHeight: "100vh" }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default PlantModal;
