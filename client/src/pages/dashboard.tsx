import React from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../utils/firebase";
import { signOut } from "firebase/auth";

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
      <nav className="w-64 bg-[#212834] p-6">
        <ul>
          <li className="mb-4">
            <button
              onClick={handleLogout}
              className="text-white text-lg font-semibold"
            >
              Logout
            </button>
          </li>
          <li className="mb-4">
            <button
              onClick={() => navigate("/account")}
              className="text-white text-lg font-semibold"
            >
              Account
            </button>
          </li>
          <li className="mb-4">
            <button
              onClick={() => navigate("/investments")}
              className="text-white text-lg font-semibold"
            >
              Investments
            </button>
          </li>
          <li className="mb-4">
            <button
              onClick={() => navigate("/optimization")}
              className="text-white text-lg font-semibold"
            >
              Optimization
            </button>
          </li>
          <li className="mb-4">
            <button
              onClick={() => navigate("/analytics")}
              className="text-white text-lg font-semibold"
            >
              Analytics
            </button>
          </li>
        </ul>
      </nav>
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-4">Welcome to OptiWealth!</h1>
        <div className="flex flex-col gap-4">
          <div className="p-6 bg-[#212834] rounded-md">
            <p className="font-semibold text-lg">Investment Portfolio</p>
            {/* Your Portfolio component or details can go here. */}
          </div>
          <div className="p-6 bg-[#212834] rounded-md">
            <p className="font-semibold text-lg">Rebalance Portfolio</p>
            {/* Your Rebalance component or details can go here. */}
          </div>
          <div className="p-6 bg-[#212834] rounded-md">
            <p className="font-semibold text-lg">Portfolio Analytics</p>
            {/* Your Analytics component or details can go here. */}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
