import React, { useContext, useState } from "react";
import { TbLayoutSidebarLeftCollapse } from "react-icons/tb";
import { MdOutlineMenuBook } from "react-icons/md";
import { MiscContext } from "../context/MiscContext";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import defaultImg from "../assets/Images/default-img.png";
import TabBar from "../routes/TabBar";
import { AiOutlineLogout } from "react-icons/ai";
import { useAuth } from "../context/AuthContext";
import Mode from "../components/Mode";

const Header = () => {
  // const { expandSidebar, setExpandSidebar } = useContext(MiscContext);
  const [isProfileHoverVisible, setProfileHoverVisible] = useState(false);
  const { profileImage } = useContext(UserContext);
  const { logout } = useAuth();
  const navigate = useNavigate();

  // function toggleSidebar() {
  //   setExpandSidebar(!expandSidebar);
  // }

  const toggleProfileHover = () => {
    setProfileHoverVisible((prev) => !prev);
  };

  const closeProfileHover = () => {
    setProfileHoverVisible(false);
  };

  const handleLogout = () => {
    logout(); // Log the user out
    navigate("/"); // Redirect to the homepage (or login page if applicable)
  };

  return (
    <div className="p-2 flex justify-between items-center">
      {/* <div>
        <button className="text-[1.7em] md:hidden" onClick={toggleSidebar}>
          <MdOutlineMenuBook
            className={`transition duration-300 rotate-${
              expandSidebar ? "0" : "180"
            }`}
          />
        </button>
      </div> */}
      <div className="flex-1 flex justify-center max-md:hidden">
        <TabBar />
      </div>

      <Mode />
      <button
        onClick={handleLogout}
        className="flex items-center p-2 rounded-md  transition-colors max-md:hidden ml-2"
      >
        <AiOutlineLogout size={20} />
        <span className="ml-2 ">Logout</span>
      </button>
    </div>
  );
};

export default Header;
