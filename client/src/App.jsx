import React, { useEffect } from "react";
import Aos from "aos";
import "aos/dist/aos.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import NotFound from "./helpers/NotFound";
import Layout from "./components/Layout";
import Header from "./components/Header";
import ProtectedRoute from "./routes/ProtectedRoute"; // Make sure you import this
import PrivateRoute from "./routes/PrivateRoute";
import Admin from "./pages/Admin";
import Dashboard from "./pages/Dashboard";

function App() {
  useEffect(() => {
    Aos.init({ duration: 1000 });
  }, []);

  return (
    <>
      <PrivateRoute
        element={
          <Router>
            <Routes>
              <Route
                path="/"
                element={
                  <Layout>
                    <Dashboard />
                  </Layout>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requiredRole="administrator">
                    <Layout>
                      <Admin />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        }
      />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}

export default App;
