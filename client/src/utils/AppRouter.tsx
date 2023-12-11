import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "../pages/Landing";
import Registration from "../pages/auth/registration";
import ProtectedRoute from "./ProtectedRoute";
import { AuthProvider } from "../context/authContext";

import Setup from "../pages/Setup";
import Login from "../pages/auth/login";
import Dashboard from "../pages/Dashboard";
import ForgotPassword from "../pages/auth/resetPass";
import ManagePortfolio from "../pages/ManagePortfolio";
import Optimize from "../pages/Optimize";
import Results from "../pages/Results";
import Account from "../pages/Account";

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
          <Route
            path="/manage"
            element={
              <ProtectedRoute>
                <ManagePortfolio />
              </ProtectedRoute>
            }
          />
          <Route
            path="/optimize"
            element={
              <ProtectedRoute>
                <Optimize />
              </ProtectedRoute>
            }
          />
          <Route
            path="/results"
            element={
              <ProtectedRoute>
                <Results />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <Account />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default AppRouter;
