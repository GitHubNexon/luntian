// UserContext.js
import React, { createContext, useState, useEffect } from "react";
// import { getProfile } from "../api/profileApi";
import { useAuth } from "../context/AuthContext"; // Import your AuthContext

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const { user } = useAuth(); // Get user from AuthContext

  return (
    <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
  );
};
