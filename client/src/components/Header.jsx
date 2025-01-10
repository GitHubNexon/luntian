import React, { useContext, useEffect, useState } from "react";
import { TbLayoutSidebarLeftCollapse } from "react-icons/tb";
import { MdOutlineMenuBook } from "react-icons/md";
import { MiscContext } from "../context/MiscContext";
import { UserContext } from "../context/UserContext"; // Import the UserContext
import defaultImg from "../assets/Images/default-img.png";


const Header = () => {
  const { expandSidebar, setExpandSidebar } = useContext(MiscContext);
  const [isProfileHoverVisible, setProfileHoverVisible] = useState(false);
  const { profileImage } = useContext(UserContext);

  function toggleSidebar() {
    setExpandSidebar(!expandSidebar);
  }

  const toggleProfileHover = () => {
    setProfileHoverVisible((prev) => !prev);
  };

  const closeProfileHover = () => {
    setProfileHoverVisible(false);
  };

  return (
    <div className="bg-[#38572ACC] text-white p-2 flex justify-between items-center">
      <div>
        <button className="text-[1.7em]" onClick={toggleSidebar}>
          <MdOutlineMenuBook
            className={`transition duration-300 rotate-${
              expandSidebar ? "0" : "180"
            }`}
          />
        </button>
      </div>
      <div className="flex flex-col items-center">
        <h1 className="text-2xl font-bold">Luntian</h1>
        <p className="text-sm mt-1">Plant Make Life Better</p>
      </div>
    </div>
  );
};

export default Header;