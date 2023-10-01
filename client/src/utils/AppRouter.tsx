import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Landing from "../pages/landing";
import Registration from "../pages/auth/registration";
import Login from "../pages/auth/login";
import Upload from "../pages/createPortfolio";
import ResetPassword from "../pages/auth/resetPass";
import Setup from "../pages/setup";

import { useAuth } from "../context/authContext";

const AppRouter: React.FC = () => {
  const auth = useAuth();
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<Registration />} />
        <Route path="/login" element={<Login />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
        <Route
          path="/setup"
          element={auth ? <Setup /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
};

export default AppRouter;
