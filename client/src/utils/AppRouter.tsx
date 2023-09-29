import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "../pages/landing";
import Registration from "../pages/registration";
import Login from "../pages/login";
import CreatePortfolio from "../pages/createPortfolio";

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<Registration />} />
        <Route path="/login" element={<Login />} />
        <Route path="/createportfolio" element={<CreatePortfolio />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
