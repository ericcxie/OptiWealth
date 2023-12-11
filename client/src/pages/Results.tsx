import Aos from "aos";
import "aos/dist/aos.css";
import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

import AllocationPieChart from "../components/charts/AllocationPieChart";
import InstructionsTable from "../components/tables/InstructionsTable";

interface ResultsProps {}

interface LocationState {
  resultsData: any;
}

const Results: React.FC = () => {
  const location = useLocation();
  const data = location.state?.resultsData;
  const modelName = data.model_name;

  const initialBondsAllocation = parseFloat(
    data.rebalancing_results.initial_allocations.Bonds.toFixed(2)
  );
  const initialStocksAllocation = parseFloat(
    data.rebalancing_results.initial_allocations.Stocks.toFixed(2)
  );
  const initialCashAllocation = parseFloat(
    data.rebalancing_results.initial_allocations.Cash.toFixed(2)
  );

  const updatedBondsAllocation = parseFloat(
    data.rebalancing_results.updated_allocations.Bonds.toFixed(2)
  );
  const updatedStocksAllocation = parseFloat(
    data.rebalancing_results.updated_allocations.Stocks.toFixed(2)
  );
  const updatedCashAllocation = parseFloat(
    data.rebalancing_results.updated_allocations.Cash.toFixed(2)
  );

  useEffect(() => {
    Aos.init({ duration: 800 });
  }, []);

  if (!data) {
    return (
      <div className="bg-background min-h-screen">
        <h1 className="p-4 text-white">No results data available.</h1>
        <a href="/dashboard">
          <p className="text-white pl-4 hover:text-indigo-500">Dashboard</p>
        </a>
      </div>
    );
  }

  const instructions = Object.entries(
    data.rebalancing_results.instructions
  ).map(([key, value]) => {
    const numericValue = value as number;
    const formattedAmount = Math.abs(numericValue).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return {
      action: numericValue > 0 ? "Buy" : "Sell",
      asset: key,
      amount:
        numericValue > 0 ? `$${formattedAmount}` : `($${formattedAmount})`,
    };
  });

  console.log("instructions", instructions);

  const formatAsPercentage = (obj: any) => {
    return Object.entries(obj)
      .map(([key, value]) => {
        const numericValue = value as number;
        return `${key}: ${numericValue.toFixed(2)}%`;
      })
      .join(", ");
  };

  const initialAllocations = formatAsPercentage(
    data.rebalancing_results.initial_allocations
  );
  const updatedAllocations = formatAsPercentage(
    data.rebalancing_results.updated_allocations
  );

  const sortedInstructions = instructions.sort((a, b) => {
    if (["Bonds", "Cash"].includes(a.asset)) return -1;
    if (["Bonds", "Cash"].includes(b.asset)) return 1;
    return 0;
  });

  const downloadResults = async () => {
    const payload = {
      model_name: modelName,
      initial_allocations: data.rebalancing_results.initial_allocations,
      updated_allocations: data.rebalancing_results.updated_allocations,
      instructions: sortedInstructions,
    };

    try {
      console.log("payload", payload);
      const response = await fetch("/dict-to-excel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const contentDisposition = response.headers.get("Content-Disposition");
      let filename = "results.xlsx";

      if (contentDisposition) {
        const filenameToken = "filename=";
        const startIndex = contentDisposition.indexOf(filenameToken);
        if (startIndex !== -1) {
          filename = contentDisposition.slice(
            startIndex + filenameToken.length
          );
        }
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };

  return (
    <div className="bg-background min-h-screen p-4 text-inter flex justify-center items-center">
      <div
        data-aos="fade-up"
        data-aos-once
        className="results-container w-full px-4 md:px-52 mx-auto text-center"
      >
        {" "}
        <div className="text-center my-10">
          <h1 className="pb-2 text-inter text-transparent font-bold bg-clip-text bg-gradient-to-r from-blue-700 to-purple-600 text-4xl md:text-5xl">
            Rebalancing Results
          </h1>
          <p className="text-white max-w-sm mx-auto">
            Here are the results based on your portfolio and chosen {""}
            <span className="lowercase font-bold">{modelName}</span> model.
          </p>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-center space-y-8 md:space-x-24">
          <div className="mb-4">
            <div>
              <h2 className="text-xl text-white font-bold mb-2">
                Initial Allocations:
              </h2>
              <p className="text-gray-400">{initialAllocations}</p>
            </div>
            <AllocationPieChart
              stocks={initialStocksAllocation}
              bonds={initialBondsAllocation}
              cash={initialCashAllocation}
            />
          </div>
          <div className="mb-4">
            <div>
              <h2 className="text-xl text-white font-bold mb-2">
                Rebalanced Allocations:
              </h2>
              <p className="text-gray-400">{updatedAllocations}</p>
            </div>
            <AllocationPieChart
              stocks={updatedStocksAllocation}
              bonds={updatedBondsAllocation}
              cash={updatedCashAllocation}
            />
          </div>
        </div>
        <hr className="mt-10 border-t-2 border-gray-400" />
        <div className="mt-6">
          <div className="text-center mb-6">
            <h2 className="text-gray-50 text-xl font-semibold">
              Here are the instructions to rebalance your portfolio:
            </h2>
            <p className="text-gray-300 ">
              <span className="text-red-600">Red</span> = sell order, &nbsp;
              <span className="text-green-600">green</span> = buy order.
            </p>
            <a
              href="https://bit.ly/OptiWealthDocsResults"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline cursor-pointer mb-2"
            >
              Learn more about these results
            </a>
          </div>
          <InstructionsTable instructions={sortedInstructions} />
        </div>
        <div>
          <Link
            to="/dashboard"
            className="mx-2 relative inline-flex items-center justify-center p-0.5 mb-2 overflow-hidden text-sm font-medium text-gray-900 rounded-xl group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-800"
          >
            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-background rounded-lg group-hover:bg-opacity-0">
              Back to Dashboard
            </span>
          </Link>
          <button
            onClick={downloadResults}
            className="mx-2 relative inline-flex items-center justify-center p-0.5 mb-2 overflow-hidden text-sm font-medium text-gray-900 rounded-xl group bg-gradient-to-br from-blue-600 to-teal-500 group-hover:from-blue-600 group-hover:to-teal-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-800"
          >
            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-background rounded-lg group-hover:bg-opacity-0">
              Download Results
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Results;
