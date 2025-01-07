// UserContext.js
import React, { createContext, useState, useEffect } from "react";
// import { getProfile } from "../api/profileApi";
import { useAuth } from "../context/AuthContext"; // Import your AuthContext

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const { user } = useAuth(); // Get user from AuthContext
  const [profileImage, setProfileImage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      if (user && user.username) {
        try {
          const data = await getProfile(user.username);
          if (data.profileImage) {
            setProfileImage(data.profileImage);
          }
        } catch (error) {
          console.error("Failed to fetch profile image:", error);
        }
      }
    };

    fetchProfile();
  }, [user]); 
  return (
    <UserContext.Provider value={{ profileImage, user }}>
      {children}
    </UserContext.Provider>
  );
};
