import React, { useState, useEffect } from "react";
import { PulseLoader } from "react-spinners";
import SideBar from "../components/sidebar";
import UpdatePortfolioTable from "../components/UpdatePortfolioTable";
import { auth } from "../utils/firebase";

const ManagePortfolio: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [portfolioData, setPortfolioData] = useState<any[]>([]);

  const user = auth.currentUser;
  const userEmail = user ? user.email : null;
  const displayName = user ? user.displayName : "User";
  const firstName = displayName ? displayName.split(" ")[0] : "User";

  useEffect(() => {
    const fetchPortfolioData = async () => {
      console.log("Fetching portfolio data for:", userEmail);
      if (!userEmail) {
        console.error("User email is not available.");
        return;
      }

      try {
        const response = await fetch("/get_portfolio", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user_email: userEmail }),
        });

        const data = await response.json();
        setPortfolioData(data);
        console.log("Portfolio data fetched!", data);
      } catch (error) {
        console.error("Error fetching portfolio data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolioData();
  }, [userEmail]);

  const handleUpdate = (updatedData: any[]) => {
    setPortfolioData(updatedData);
    // Any additional logic or API calls to save updates can be added here
  };

  const handleSubmit = () => {
    // Logic to submit the updated portfolio data
    return;
  };

  const handleAddNewRow = () => {
    setPortfolioData((prevData) => [
      ...prevData,
      { Ticker: "", "Total Shares": "0" },
    ]);
  };

  return (
    <div className="flex h-screen bg-background text-white font-inter">
      <SideBar />

      <div className="flex-1 flex flex-col justify-start items-start pt-14 pl-80">
        <h2 className="mt-2 text-center text-4xl font-bold leading-9 tracking-tight text-white">
          Update Your{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-teal-500">
            Portfolio
          </span>
        </h2>

        {/* Portfolio Table and Related Components */}
        <div className="mt-6 w-full pr-16">
          <div className="font-inter">
            <div className="flex justify-between items-center mt-4">
              <div className="text-xl text-gray-100 font-semibold">
                {firstName}'s Portfolio
              </div>
              <button
                onClick={handleAddNewRow}
                className="h-9 mb-3 px-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
              >
                New Investment
              </button>
            </div>
            <UpdatePortfolioTable
              data={portfolioData}
              onUpdate={handleUpdate}
            />
          </div>
          <div className="mt-6">
            <button
              onClick={handleSubmit}
              className="w-full h-12 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
            >
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagePortfolio;
