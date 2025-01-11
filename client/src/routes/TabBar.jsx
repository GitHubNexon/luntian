import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaHome, FaUsers } from "react-icons/fa";
import { FaMagnifyingGlass } from "react-icons/fa6";
import {
  AiOutlineClose,
  AiOutlineHome,
  AiOutlineMessage,
  AiOutlineBell,
  AiOutlineTeam,
  AiOutlineSetting,
  AiOutlineUser,
  AiOutlineLogout,
} from "react-icons/ai";
import { RiAdminFill } from "react-icons/ri";
import { useAuth } from "../context/AuthContext";

const ReportNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const isAdmin =
    user &&
    user.accessTypes &&
    user.accessTypes.some((type) => type.code === "administrator");

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
            location.pathname === "/Detection"
              ? "border-green-500"
              : "border-transparent"
          } hover:border-green-400 hover:text-green-500`}
        >
          <button onClick={() => navigate("/Detection")}>
            <FaMagnifyingGlass className="inline mr-2" />
            Detection
          </button>
        </li>

        {isAdmin && (
          <li
            className={`py-1 px-4 border-b-[5px] whitespace-nowrap transition-all duration-300 ${
              location.pathname === "/admin"
                ? "border-green-500"
                : "border-transparent"
            } hover:border-green-400 hover:text-green-500`}
          >
            <button onClick={() => navigate("/admin")}>
              <RiAdminFill className="inline mr-2" />
              Admin
            </button>
          </li>
        )}
      </ul>
    </div>
  );
};

export default ReportNavigation;
