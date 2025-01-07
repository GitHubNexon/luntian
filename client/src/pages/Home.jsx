import React from "react";
import { useNavigate } from "react-router-dom";
import Login from "../admin/Login";
import LandingBG from "../assets/Images/landing-bg.png";
import LandingHeader from "../components/LandingHeader";

const Home = () => {
  const navigate = useNavigate(); // Initialize the navigate function

  return (
    <div className="relative flex items-center justify-center h-screen bg-gray-200">
      <img
        src={LandingBG}
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-70"
      />
      <Login />
    </div>
  );
};

export default Home;
