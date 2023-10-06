import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../utils/firebase";
import SideBar from "../components/sidebar";

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

      <div className="flex-1 flex flex-col justify-start items-start pt-14 pl-80">
        <h1 className="text-xl font-medium mb-4 text-gray-200">
          {getGreeting()} {firstName}. You have
        </h1>
        <h2 className="text-4xl font-bold">
          $
          {loading
            ? "..."
            : portfolioValue
            ? portfolioValue.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            : "0.00"}
        </h2>
      </div>
    </div>
  );
};

export default Dashboard;
