import React, { useEffect, useState } from "react";
import Select from "react-select";
import helperApi from "../api/helperApi";
import { FaLeaf } from "react-icons/fa";

const PlantsPicker = ({ onSelect, mode }) => {
  const [plants, setPlants] = useState([]);
  const [hoveredPlant, setHoveredPlant] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Track modal visibility
  const [selectedImage, setSelectedImage] = useState(null); // Track the image to show in modal
  
  

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const data = await helperApi.getPlants();
        console.log("Fetched plants data:", data);
        setPlants(data);
      } catch (error) {
        console.error("Failed to fetch plants", error);
      }
    };

    fetchPlants();
  }, []);

  const customOption = (props) => {
    const { data, innerRef, innerProps } = props;
    return (
      <div
        ref={innerRef}
        {...innerProps}
        onMouseEnter={() => setHoveredPlant(data.image)}
        className="flex items-center space-x-2 p-2 cursor-pointer"
      >
        {/* Plant Common Name */}
        <span className="text-sm font-semibold text-gray-600">
          {data.commonName}
        </span>

        {/* Plant Icon */}
        <FaLeaf className="text-green-500" />
      </div>
    );
  };

  const handleImageClick = (image) => {
    setSelectedImage(image); // Set the selected image for the modal
    setIsModalOpen(true); // Open the modal
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close the modal
    setSelectedImage(null); // Reset the selected image
  };

  const options = plants.map((plant) => ({
    value: plant._id,
    label: plant.plantDetails.commonName, // This is the text displayed in the dropdown
    image: plant.plantDetails.plantImage, // Image for hover preview
    commonName: plant.plantDetails.commonName,
  }));

  return (
    <div className="relative w-64">
      <Select
        options={options}
        onChange={(selectedOption) => {
          if (!selectedOption) {
            setHoveredPlant(null); // Reset hovered image when default is selected
          } else {
            const selectedPlant = plants.find(
              (plant) => plant._id === selectedOption.value
            );
            console.log("Selected plant data:", selectedPlant);
            if (onSelect) onSelect(selectedPlant); // Calls the onSelect function passed as a prop
          }
        }}
        components={{ Option: customOption }} // Custom option renderer with image and details
        placeholder="Select..." // Default placeholder
      />

      {/* {hoveredPlant && !isModalOpen && (
        <div className="absolute top-full left-0 mt-2 p-2 bg-white border shadow-lg rounded-lg w-48">
          <img
            src={hoveredPlant}
            alt="Plant"
            className="w-full h-auto rounded-md cursor-pointer"
            onClick={() => handleImageClick(hoveredPlant)} // Open modal on click
          />
        </div>
      )}

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white p-4 rounded-lg max-w-full max-h-full"
            onClick={(e) => e.stopPropagation()} // Prevent modal close on inner click
          >
            <img
              src={selectedImage}
              alt="Selected Plant"
              className="w-full h-auto max-h-[80vh] object-contain"
            />
          </div>
        </div>
      )} */}
    </div>
  );
};

export default PlantsPicker;
