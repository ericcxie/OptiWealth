import React, { useState } from "react";
import { BounceLoader } from "react-spinners";
import SideBar from "../components/sidebar";
import UpdatePortfolioTable from "../components/UpdatePortfolioTable";

const ManagePortfolio: React.FC = () => {
  const sampleData = [
    { Ticker: "AAPL", "Total Shares": 5 },
    { Ticker: "GOOGL", "Total Shares": 10 },
  ];

  const [portfolioData, setPortfolioData] = useState(sampleData);

  const handleUpdate = (updatedData: any[]) => {
    setPortfolioData(updatedData);
    // Any additional logic or API calls to save updates can be added here
  };
  const handleSubmit = () => {
    return;
  };

  return (
    <div className="bg-background flex h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <SideBar />
      <div className="max-w-xl mx-auto w-full">
        <div>
          <h2 className="mt-4 text-center text-4xl font-bold leading-9 tracking-tight text-white">
            Modify Your{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-teal-500">
              Portfolio
            </span>
          </h2>
          <p className="text-md mt-2 text-gray-400 mb-4 text-center">
            Once finished, press submit to save.
          </p>
          <UpdatePortfolioTable data={portfolioData} onUpdate={handleUpdate} />
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
