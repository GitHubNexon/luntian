import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaHome, FaUsers } from "react-icons/fa"; // Import the icons

const ReportNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="border-b overflow-auto">
      <ul className="flex text-[0.9em] pt-4 mb-2 space-x-8 justify-center sm:justify-start">
        <li
          className={`py-1 px-4 border-b-[5px] whitespace-nowrap transition-all duration-300 ${
            location.pathname === "/"
              ? "border-green-500"
              : "border-transparent"
          } hover:border-green-400 hover:text-green-500`}
        >
          <button onClick={() => navigate("/")}>
            <FaHome className="inline mr-2" /> {/* Icon added here */}
            Dashboard
          </button>
        </li>

        <li
          className={`py-1 px-4 border-b-[5px] whitespace-nowrap transition-all duration-300 ${
            location.pathname === "/admin"
              ? "border-green-500"
              : "border-transparent"
          } hover:border-green-400 hover:text-green-500`}
        >
          <button onClick={() => navigate("/admin")}>
            <FaUsers className="inline mr-2" /> {/* Icon added here */}
            Admin
          </button>
        </li>
      </ul>
    </div>
  );
};

export default ReportNavigation;
