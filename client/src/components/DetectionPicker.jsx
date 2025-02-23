import React, { useEffect, useState } from "react";
import Select from "react-select";
import helperApi from "../api/helperApi";

const DetectionPicker = ({ onSelect }) => {
  const [detections, setDetections] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null); // Track selected option
  const [hoveredDetection, setHoveredDetection] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Track modal visibility
  const [selectedImage, setSelectedImage] = useState(null); // Track the image to show in modal

  useEffect(() => {
    const fetchDetections = async () => {
      try {
        const data = await helperApi.getDetections();
        setDetections(data); // Ensure this is an array of detections
      } catch (error) {
        console.error("Failed to fetch detections", error);
      }
    };

    fetchDetections();
  }, []);

  const customOption = (props) => {
    const { data, innerRef, innerProps } = props;
    return (
      <div
        ref={innerRef}
        {...innerProps}
        onMouseEnter={() => setHoveredDetection(data.image)}
        className="flex items-center space-x-2 p-2 cursor-pointer"
      >
        {/* Detection Image */}
        <img
          src={data.image}
          alt="Detection"
          className="w-8 h-8 rounded-full object-cover"
          onClick={() => handleImageClick(data.image)} // Open modal on click
        />
        {/* Detection Details Text */}
        <span className="text-sm font-semibold text-gray-600">
          {data.details}
        </span>
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

  // Transform detections to the format that React Select requires
  const options = detections.map((detection) => ({
    value: detection._id, // Unique identifier for each detection
    label: detection.details, // The text displayed in the dropdown
    image: `data:image/png;base64,${detection.images[0]?.data}`, // Image for hover preview
    details: detection.details, // Add the details for custom rendering
  }));

  return (
    <div className="relative w-64">
      <Select
        options={options}
        value={selectedOption} // Set selected option here
        onChange={(selectedOption) => {
          setSelectedOption(selectedOption); // Update selected option
          if (!selectedOption) {
            setHoveredDetection(null); // Reset hovered detection when going back to default
          } else {
            const selectedDetection = detections.find(
              (detection) => detection._id === selectedOption.value
            );
            console.log("Selected Detection:", selectedDetection);
            onSelect(selectedDetection); // Calls the onSelect function passed as a prop
          }
        }}
        components={{ Option: customOption }} // Custom option renderer with image and details
        placeholder="Select..." // Default placeholder
      />

      {/* {hoveredDetection && !isModalOpen && (
        <div className="absolute top-full left-0 mt-2 p-2 bg-white border shadow-lg rounded-lg w-48">
          <img
            src={hoveredDetection}
            alt="Hovered Detection"
            className="w-full h-auto rounded-md"
          />
        </div>
      )} */}

      {/* {isModalOpen && (
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
              alt="Selected Detection"
              className="w-full h-auto max-h-[80vh] object-contain"
            />
          </div>
        </div>
      )} */}
    </div>
  );
};

export default DetectionPicker;
