import React from "react";
import PlantsPicker from "../components/PlantsPicker";
import DetectionPicker from "../components/DetectionPicker";

const Monitoring = () => {
  return (
    <div className="flex flex-row items-center space-y-4">
      <PlantsPicker />
      <DetectionPicker />
    </div>
  );
};

export default Monitoring;
