import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import Aos from "aos";
import "aos/dist/aos.css";

interface ResultsProps {}

interface LocationState {
  resultsData: any;
}

const Results: React.FC = () => {
  const location = useLocation();
  const data = location.state?.resultsData;

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

  const formatAsPercentage = (obj: any) => {
    return Object.entries(obj)
      .map(([key, value]) => {
        const numericValue = value as number;
        return `${key}: ${numericValue.toFixed(2)}%`; // Display as percentage
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

  return (
    <div className="bg-background min-h-screen p-4 text-inter flex justify-center items-center">
      <div
        data-aos="fade-up"
        data-aos-once
        className="results-container w-full px-52 mx-auto text-center"
      >
        {" "}
        <div className="text-center mb-16">
          <h1 className="text-4xl text-white font-bold mb-3">
            Your Rebalancing Results
          </h1>
          <p className="text-gray-400">
            Here are the results based on your portfolio.
          </p>
          <p className="text-gray-400 mb-2">
            <span className="text-red-600">Red</span> = sell order, &nbsp;
            <span className="text-green-600">green</span> = buy order.
          </p>
        </div>
        <div className="relative overflow-y-auto h-96 mt-2 mb-10 shadow-md sm:rounded-lg scrollbar-thin scrollbar-thumb-gray scrollbar-track-gray">
          <table className="w-full text-md text-left text-gray-500 dark:text-white">
            <thead className="sticky uppercase top-0 bg-slate-700 dark:text-gray-300">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Action
                </th>
                <th scope="col" className="px-6 py-3">
                  Asset
                </th>
                <th scope="col" className="px-6 py-3">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedInstructions.map((instruction, index) => (
                <tr
                  key={index}
                  className={`border-b dark:border-gray-700 ${
                    instruction.asset === "Bonds" ||
                    instruction.asset === "Cash"
                      ? "bg-gray-800 dark:hover:bg-gray-700"
                      : "bg-gray-900 dark:hover:bg-gray-700"
                  }`}
                >
                  <th
                    scope="row"
                    className={`px-6 py-4 font-medium whitespace-nowrap ${
                      instruction.action === "Sell"
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    {instruction.action}
                  </th>
                  <td className="px-6 py-4">{instruction.asset}</td>
                  <td
                    className={`px-6 py-4 ${
                      instruction.action === "Sell"
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    {instruction.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mb-4 flex gap-48 justify-center">
          <div>
            <h2 className="text-xl text-white font-bold mb-2">
              Initial Allocations:
            </h2>
            <p className="text-gray-400">{initialAllocations}</p>
          </div>
          <div>
            <h2 className="text-xl text-white font-bold mb-2">
              Updated Allocations:
            </h2>
            <p className="text-gray-400">{updatedAllocations}</p>
          </div>
        </div>
        <Link
          to="/dashboard"
          className="mt-4 inline-block px-6 py-2 text-sm font-medium leading-6 text-center text-white transition bg-indigo-700 rounded-2xl shadow ripple hover:shadow-lg hover:bg-indigo-800 focus:outline-none"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default Results;
