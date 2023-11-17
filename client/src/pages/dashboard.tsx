import Aos from "aos";
import "aos/dist/aos.css";
import React, { useEffect, useState } from "react";
import SideBar from "../components/sidebar";
import { auth } from "../utils/firebase";

import Portfolio from "../components/Portfolio";
import PortfolioAreaChart from "../components/charts/PortfolioAreaChart";
import PortfolioPieChart from "../components/charts/PortfolioPieChart";
import Greeting from "../components/ui/greeting";

const Dashboard: React.FC = () => {
  const [portfolioValue, setPortfolioValue] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [portfolioAllocation, setPortfolioAllocation] = useState([]);
  const [portfolioHistory, setPortfolioHistory] = useState([]);

  const user = auth.currentUser;
  const userEmail = user ? user.email : null;
  const displayName = user ? user.displayName : "User";
  const firstName = displayName ? displayName.split(" ")[0] : "User";

  useEffect(() => {
    const fetchPortfolioValue = async () => {
      if (!userEmail) {
        console.log(
          "User email is not available. Not fetching portfolio value."
        );
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

  useEffect(() => {
    const fetchPortfolioAllocation = async () => {
      if (!userEmail) {
        console.error("User email is not available.");
        return;
      }

      try {
        const response = await fetch("/get-portfolio-allocation", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: userEmail }),
        });

        const data = await response.json();
        setPortfolioAllocation(data);
      } catch (error) {
        console.error("Error fetching portfolio allocation:", error);
      }
    };

    fetchPortfolioAllocation();
  }, [userEmail]);

  useEffect(() => {
    const fetchPortfolioHistory = async () => {
      const response = await fetch("/get-portfolio-history", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: userEmail }),
      });

      const data = await response.json();
      setPortfolioHistory(data);
    };

    fetchPortfolioHistory();
  }, [userEmail]);

  useEffect(() => {
    Aos.init({ duration: 800 });
  }, []);

  return (
    <div className="flex h-screen bg-background text-white font-inter">
      <SideBar />
      <div className="flex-initial flex flex-col w-full pr-16 items-start justify-start pl-80">
        <Greeting
          name={firstName}
          portfolioValue={portfolioValue}
          loading={loading}
        />
        <div data-aos="fade-up" data-aos-once className="flex gap-10 w-full">
          <PortfolioAreaChart portfolioHistory={portfolioHistory} />
          <PortfolioPieChart portfolioAllocation={portfolioAllocation} />
        </div>
        <div data-aos="fade-up" data-aos-once className="mb-10 w-full">
          {userEmail && <Portfolio userEmail={userEmail} />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
