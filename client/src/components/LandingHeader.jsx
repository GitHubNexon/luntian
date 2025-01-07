import React from "react";

const LandingHeader = () => {
  return (
    <div>
      {/* header */}
      <div className="flex items-center justify-start bg-[#31AEEC] w-full p-10">
        <h1 className="text-white text-2xl md:text-3xl font-bold">
          Scholarly - AICS
        </h1>
        <p className="text-white text-sm md:text-base ml-4">
          Your Academic Community Hub—Connecting Students and Educators
        </p>
      </div>
    </div>
  );
};

export default LandingHeader;
