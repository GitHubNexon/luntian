import React, { useContext, useEffect } from "react";
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
import { FaCircleUser, FaMagnifyingGlass } from "react-icons/fa6";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { MiscContext } from "../context/MiscContext"; // Import MiscContext

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { expandSidebar, setExpandSidebar } = useContext(MiscContext); // Use MiscContext

  const closeNav = () => {
    setExpandSidebar(false); // Close the sidebar
  };

  useEffect(() => {
    // Add or remove 'no-scroll' class based on sidebar state
    if (expandSidebar) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }

    // Clean up
    return () => document.body.classList.remove("no-scroll");
  }, [expandSidebar]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  const isAdmin =
    user &&
    user.accessTypes &&
    user.accessTypes.some((type) => type.code === "administrator");

  const menuItems = [
    { path: "/", label: "DashBoard", icon: <AiOutlineHome size={20} /> },
    {
      path: "/Detection",
      label: "Detection",
      icon: <FaMagnifyingGlass size={20} />,
    },
    // { path: "/profile", label: "Profile", icon: <FaCircleUser size={20} /> },
    // { path: user ? `/profile/${user.username}` : "/profile", label: "Profile", icon: <FaCircleUser size={20} /> },
    // { path: `/profile/${user?.username || "guest"}`, label: "Profile", icon: <FaCircleUser size={20} /> },
    // { path: "/room", label: "Room", icon: <AiOutlineTeam size={20} /> },
    ...(isAdmin
      ? [
          {
            path: "/admin",
            label: "Admin",
            icon: <RiAdminFill size={20} />,
          },
        ]
      : []),
  ];

  return (
    <div className="flex">
      {/* Sidebar Section */}
      <div
        className={`fixed top-0 left-0 w-64 h-full bg-[#38572A] text-white z-50 transition-transform transform ${
          expandSidebar ? "translate-x-0" : "-translate-x-full"
        } shadow-lg`}
      >
        <button
          onClick={closeNav}
          className="absolute top-4 right-4 text-white bg-gray-700 p-2 rounded-full hover:bg-gray-600 transition-colors"
        >
          <AiOutlineClose size={24} />
        </button>

        <ul className="flex flex-col mt-12 space-y-2 pt-10 m-3">
          {menuItems.map(({ path, label, icon }) => (
            <li key={path} className="flex">
              <Link
                to={path}
                className={`flex items-center w-full p-4 text-lg text-white rounded-md hover:bg-gray-700 transition-colors ${
                  location.pathname === path ? "bg-gray-600" : ""
                }`}
                onClick={() => {
                  closeNav(); // Close sidebar when a menu item is clicked
                }}
              >
                {icon}
                <span className="ml-4">{label}</span>
              </Link>
            </li>
          ))}
        </ul>

        {/* Logout Button */}
        <div className="flex justify-center mt-4">
          <button
            onClick={() => {
              logout();
              closeNav(); // Close sidebar on logout
              navigate("/");
            }}
            className="flex items-center w-full p-4 text-lg text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            <AiOutlineLogout size={20} />
            <span className="ml-4">Logout</span>
          </button>
        </div>
      </div>

      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black opacity-50 z-40 transition-opacity ${
          expandSidebar ? "block" : "hidden"
        }`}
        onClick={closeNav} // Close sidebar when overlay is clicked
      ></div>
    </div>
  );
};

export default Sidebar;
