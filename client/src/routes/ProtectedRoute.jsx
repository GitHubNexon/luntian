import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user } = useAuth();

  // Log the user object for debugging
  console.log("User Data: ", user); // Check the user object in the console

  // Check if the user is defined and if they have the required access
  const isAuthorized =
    user &&
    user.accessTypes &&
    (!requiredRole ||
      user.accessTypes.some((type) => type.code === requiredRole));

  // Redirect if not authorized
  if (!isAuthorized) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
