import React from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../utils/firebase";
import { signOut } from "firebase/auth";
import SideBar from "../components/sidebar";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-background text-white font-inter">
      <SideBar />
      <h1 className="text-3xl font-bold mb-4 mx-auto mt-10">Portfolio</h1>
    </div>
  );
};

export default Dashboard;
