import React from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../utils/firebase";
import { signOut } from "firebase/auth";
import SideBar from "../components/sidebar";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log("User signed out");
        navigate("/login"); // Redirect to login after successful logout.
      })
      .catch((error) => {
        console.error("Error signing out:", error); // Handle errors here.
      });
  };

  return (
    <div className="flex h-screen bg-background text-white">
      <SideBar />
    </div>
  );
};

export default Dashboard;
