import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "../pages/landing";
import Registration from "../pages/auth/registration";
import ProtectedRoute from "./ProtectedRoute";
import { AuthProvider } from "../context/authContext";
import Setup from "../pages/setup";
import Login from "../pages/auth/login";
import Dashboard from "../pages/dashboard";
import ForgotPassword from "../pages/auth/resetPass";
import ManagePortfolio from "../pages/managePortfolio";

const AppRouter: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signup" element={<Registration />} />
          <Route path="/login" element={<Login />} />
          <Route path="/resetpassword" element={<ForgotPassword />} />
          <Route
            path="/setup"
            element={
              <ProtectedRoute>
                <Setup />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/manage" element={<ManagePortfolio />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default AppRouter;
