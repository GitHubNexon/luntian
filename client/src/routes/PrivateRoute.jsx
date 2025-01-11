// src/routes/PrivateRoute.js
import React from "react";
import { useAuth } from "../context/AuthContext";
import NotFound from "../helpers/NotFound";
import Login from "../admin/Login";
import Register from "../admin/Register";
import Home from "../pages/Home";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

const PrivateRoute = ({ element }) => {
  const { user } = useAuth();

  return user ? (
    element // Render the passed element if the user is authenticated
  ) : (
    <Router basename="/luntian/">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default PrivateRoute;
