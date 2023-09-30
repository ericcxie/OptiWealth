import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "../pages/landing";
import Registration from "../pages/auth/registration";
import Login from "../pages/auth/login";
import CreatePortfolio from "../pages/createPortfolio";
import ResetPassword from "../pages/auth/resetPass";

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<Registration />} />
        <Route path="/login" element={<Login />} />
        <Route path="/createportfolio" element={<CreatePortfolio />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
