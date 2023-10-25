import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../utils/firebase";
import SideBar from "../components/sidebar";
import Aos from "aos";
import "aos/dist/aos.css";

import Greeting from "../components/ui/greeting";
import PortfolioAreaChart from "../components/charts/PortfolioAreaChart";
import PortfolioPieChart from "../components/charts/PortfolioPieChart";
import Portfolio from "../components/Portfolio";

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

  useEffect(() => {
    Aos.init({ duration: 800 });
  }, []);

  return (
    <div className="flex h-screen bg-background text-white font-inter">
      <SideBar />
      <div className="flex-initial flex flex-col items-start justify-start pl-80">
        <Greeting
          name={firstName}
          portfolioValue={portfolioValue}
          loading={loading}
        />
        <div data-aos="fade-up" data-aos-once className="flex gap-10">
          <PortfolioAreaChart />
          <PortfolioPieChart />
        </div>
        <div data-aos="fade-up" data-aos-once className="mb-10 w-full">
          {userEmail && <Portfolio userEmail={userEmail} />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
