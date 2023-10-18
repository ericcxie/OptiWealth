import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../utils/firebase";
import SideBar from "../components/sidebar";
import { PulseLoader } from "react-spinners";
import Greeting from "../components/ui/greeting";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [portfolioValue, setPortfolioValue] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const user = auth.currentUser;
  const userEmail = user ? user.email : null;
  const displayName = user ? user.displayName : "User";
  const firstName = displayName ? displayName.split(" ")[0] : "User";

  useEffect(() => {
    const fetchPortfolioValue = async () => {
      console.log("Fetching portfolio value for:", userEmail);
      if (!userEmail) {
        console.error("User email is not available.");
        return;
      }

      try {
        const response = await fetch("/get-portfolio-value", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: userEmail }),
        });

        const data = await response.json();
        console.log("Portfolio value fetched!", data.portfolio_value);
        setPortfolioValue(data.portfolio_value);
      } catch (error) {
        console.error("Error fetching portfolio value:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolioValue();
  }, [userEmail]);

  const getGreeting = () => {
    const currentHour = new Date().getHours();

    if (currentHour < 12) return "Good morning";
    if (currentHour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="flex h-screen bg-background text-white font-inter">
      <SideBar />
      <Greeting
        name={firstName}
        portfolioValue={portfolioValue}
        loading={loading}
      />
      ;
    </div>
  );
};

export default Dashboard;
