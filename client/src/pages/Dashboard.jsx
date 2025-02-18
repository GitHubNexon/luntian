// import React from 'react'
// import LiveDetection from '../components/LiveDetection'

// const Dashboard = () => {
//   return (
//     <div className='w-full'>
//       <LiveDetection />
//     </div>
//   )
// }

// export default Dashboard

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment";
import { FaUser, FaAddressCard, FaBell, FaChevronDown } from "react-icons/fa";
import LiveDetection from "../components/LiveDetection";
import { MdDashboard } from "react-icons/md";

const Dashboard = () => {
  const navigate = useNavigate();
  const [lastLoginTime, setLastLoginTime] = useState(null);
  const [loginTime, setLoginTime] = useState(null);
  const [currentTime, setCurrentTime] = useState(moment());
  const [name, setName] = useState("");

  useEffect(() => {
    const storedLastLogin = localStorage.getItem("lastLoginTime");
    const currentLogin = moment();

    if (storedLastLogin) {
      setLastLoginTime(moment(storedLastLogin));
    }
    setLoginTime(currentLogin);
    localStorage.setItem("lastLoginTime", currentLogin);
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(moment()); // Update current time using moment
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const formatDateTime = (date) => {
    if (!date) return "N/A";
    return date.format("MMM D, YYYY h:mm:ss A"); // Example: Feb 18, 2025 2:15 PM
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <main className="flex-1 sm:p-6" data-aos="fade-down">
        <h1 className="text-green-600 text-base sm:text-lg lg:text-xl xl:text-2xl mb-4">
          LUNTIAN
        </h1>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h2 className="text-green-600 text-base sm:text-lg lg:text-xl xl:text-2xl">
            👋 Nice of you to join us again. Current Time:{" "}
            {currentTime.format("h:mm:ss A")}
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
          <InfoCard
            icon={
              <MdDashboard className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl mb-2" />
            }
            title="System Summary"
            message={`Welcome Back! System Summary as of ${formatDateTime(loginTime)}`}
          />
          <InfoCard
            icon={
              <FaBell className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl  mb-2" />
            }
            title="Notifications"
            message="No notifications."
          />
          <div className="-200 p-4 rounded text-center shadow-2xl cursor-pointer overflow-hidden relative transition-all duration-500 hover:translate-y-2 flex flex-col items-center justify-center gap-2 before:absolute before:w-full hover:before:top-0 before:duration-500 before:-top-1 before:h-1 before:bg-green-400">
            <LiveDetection />
          </div>
        </div>
        <section>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-8 "></div>
        </section>
      </main>
    </div>
  );
};

// InfoCard Component
const InfoCard = ({ icon, title, message }) => (
  <div className="-200 p-4 rounded text-center shadow-2xl cursor-pointer overflow-hidden relative transition-all duration-500 hover:translate-y-2 flex flex-col items-center justify-center gap-2 before:absolute before:w-full hover:before:top-0 before:duration-500 before:-top-1 before:h-1 before:bg-green-400">
    {icon}
    <h3 className="text-xs sm:text-sm md:text-base font-light">{title}</h3>
    <p className="text-xs sm:text-sm md:text-base">{message}</p>
  </div>
);

export default Dashboard;
