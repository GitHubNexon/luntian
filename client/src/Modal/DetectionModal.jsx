import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import showDialog from "../utils/showDialog";
import { showToast } from "../utils/toastNotifications";
import detectionApi from "../api/detectionApi";
import { numberToCurrencyString, formatReadableDate } from "../helper/helper";
import { format } from "timeago.js";

const DetectionModal = ({ isOpen, onClose, onSaveData, data, mode }) => {
  const [formData, setFormData] = useState({
    details: "",
    description: [],
    images: [], // Change images to an array
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
      setFormData({
        details: data.details || "",
        description: data.description || [],
        images: data.images || [], // Make sure the images are an array
      });
    }
  }, [mode, data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleReset = () => {
    setFormData({
      details: "",
      description: [],
      images: [], // Reset images to an empty array
    });
  };

  const validateForm = () => {
    if (!formData.details) {
      showToast("Details are required.", "warning");
      return false;
    }
    if (formData.description.length === 0) {
      showToast("Description is required.", "warning");
      return false;
    }
    return true;
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const imageData = reader.result;
      const currentDate = new Date().toISOString().split("T")[0];
      const newImage = { data: imageData, date: currentDate };

      setFormData((prevData) => ({
        ...prevData,
        images: [newImage],
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    formData.images.forEach((image) => {
      if (image.data.startsWith("data:image")) {
        image.data = image.data.split(",")[1];
      }
    });

    const { images, ...formDataWithoutImages } = formData;

    formData.images.forEach((image) => {
      if (image.data.startsWith("data:image")) {
        image.data = image.data.split(",")[1];
      }
    });

    if (!validateForm()) {
      return;
    }
    try {
      if (mode === "edit") {
        showToast("Detection data updated successfully!", "success");
        await detectionApi.updateDetectionById(data._id, formDataWithoutImages);
        console.log(formDataWithoutImages);
      } else {
        showToast("Detection data saved successfully!", "success");
        await detectionApi.createImageDetection(formData);
        console.log(formData);
      }
      onSaveData(formData); // Save the data
      onClose();
    } catch (error) {
      console.error("Error submitting detection data:", error);
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
        <div className="p-6 rounded-lg w-[500px] m-10 overflow-y-auto max-h-[90vh] modeDiv">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">
              {mode === "edit" ? "Edit Detection" : "Add Detection"}
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
              <div className="flex flex-col">
                <label htmlFor="details" className="text-gray-700">
                  Details
                </label>
                <input
                  type="text"
                  id="details"
                  name="details"
                  value={formData.details}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 rounded-md bg-gray-100 text-gray-500"
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
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="border border-gray-300 p-2 rounded-md text-gray-500 resize-none h-[100px]"
                />
                <button
                  type="button"
                  onClick={handleAddDescription}
                  className=" py-1 px-3 rounded-md mt-2 bg-[var(--primary-color)]"
                >
                  Add Description
                </button>
                <div className="mt-2">
                  <h3>Descriptions:</h3>
                  {formData.description.map((desc, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <p className="text-sm ">{desc}</p>
                      <button
                        type="button"
                        onClick={() => handleRemoveDescription(index)}
                        className=" text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col">
                {mode !== "edit" && (
                  <>
                    <label htmlFor="images" className="text-gray-700">
                      Upload Image
                    </label>
                    <input
                      type="file"
                      id="images"
                      onChange={handleImageUpload}
                      className="border border-gray-300 p-2 rounded-md bg-gray-100 text-gray-500"
                    />
                  </>
                )}
                {formData.images.length > 0 && (
                  <div className="mt-2">
                    <h3>Uploaded Images:</h3>
                    {formData.images.map((image, index) => (
                      <div
                        key={index}
                        className="mt-2 cursor-pointer"
                        onClick={openImageModal}
                      >
                        <img
                          // src={`data:image/jpeg;base64,${image.data}`}
                          src={image.data}
                          alt={`Uploaded ${index}`}
                          className="w-20 h-20 object-cover rounded-md"
                        />
                        <p className="text-xs text-gray-500 mt-5">
                          Uploaded on: {formatReadableDate(image.date)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
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
      {isImageModalOpen && formData.images.length > 0 && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={closeImageModal}
        >
          <div
            className="relative bg-white p-4 rounded-lg max-w-full max-h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              // src={`data:image/jpeg;base64,${formData.images[0].data}`} // Show the first image from the array
              src={formData.images[0].data} // Show the first image from the array
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

export default DetectionModal;
