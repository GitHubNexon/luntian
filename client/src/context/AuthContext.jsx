import React, { createContext, useState, useContext, useEffect } from "react";
import { useSplash } from "./SplashContext";
import { fetchUser, auth, logoff, createUser } from "../api/authApi";
import { showToast } from "../utils/toastNotifications";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { setShowSplash } = useSplash();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const initializeUser = async () => {
      try {
        const userData = await fetchUser(); // Checks for cookies
        if (userData) {
          setUser(userData);
        }
      } catch (error) {
        console.error(
          "Fetch user failed:",
          error.response ? error.response.data : error.message
        );
      }
      setShowSplash(false);
    };

    initializeUser();
  }, [setShowSplash]);

  const login = async (email, password) => {
    try {
      const { token, userData } = await auth(email, password);
      if (token && userData) {
        setUser(userData);
      } else {
        throw new Error("Invalid token or user data");
      }
    } catch (error) {
      throw error; // Re-throw the error for handling in the Login component
    }
  };

  const logout = async () => {
    try {
      await logoff();
      setUser(null);
    } catch (error) {
      console.error(
        "Logout failed:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const register = async (username, email, password, userType) => {
    try {
      const userData = await createUser(username, email, password, userType);
      setUser(userData); // Set user after successful registration
      showToast("Registration successful!", "success"); // Display success message
      return userData; // Return the newly created user data
    } catch (error) {
      console.error(
        "Registration failed:",
        error.response ? error.response.data : error.message
      );
      showToast("Registration failed. Please try again.", "error"); // Display error message
      throw error; // Rethrow the error for handling in the Register component
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
