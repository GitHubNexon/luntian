import React from "react";
import PlantsPicker from "../components/PlantsPicker";
import DetectionPicker from "../components/DetectionPicker";
import MonitorTable from "../components/MonitorTable";

const Monitoring = () => {
  return (
    <div className="flex items-center justify-between">
      {/* <PlantsPicker />
      <DetectionPicker /> */}
      <MonitorTable />
    </div>
  );
};

export default Monitoring;
