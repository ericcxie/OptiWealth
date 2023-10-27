import React from "react";
import { useLocation } from "react-router-dom";

interface ResultsProps {}

interface LocationState {
  resultsData: any;
}

const Results: React.FC = () => {
  const location = useLocation();
  const data = location.state?.resultsData;

  if (!data) {
    return <div>No results data available.</div>;
  }

  const instructions = Object.entries(
    data.rebalancing_results.instructions
  ).map(([key, value]) => {
    const numericValue = value as number;
    return `${key}: ${numericValue > 0 ? "Buy" : "Sell"} ${Math.abs(
      numericValue
    ).toFixed(2)}`; // Rounded to 2 decimal places
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

  return (
    <div className="bg-background min-h-screen p-4 text-inter flex justify-center items-center">
      {" "}
      {/* Centering styles applied */}
      <div className="results-container max-w-2xl mx-auto">
        {" "}
        {/* Content wrapper */}
        <div className="text-center mb-16 mt-14">
          <h1 className="text-4xl text-white font-bold mb-3">
            Your Rebalancing Results
          </h1>
          <p className="text-gray-400 mb-2">
            Here are the results based on your portfolio.
          </p>
        </div>
        <div className="mb-4">
          <h2 className="text-xl text-white font-bold mb-2">Instructions:</h2>
          <ul>
            {instructions.map((instruction, index) => (
              <li key={index} className="text-gray-400">
                {instruction}
              </li>
            ))}
          </ul>
        </div>
        <div className="mb-4">
          <h2 className="text-xl text-white font-bold mb-2">
            Initial Allocations:
          </h2>
          <p className="text-gray-400">{initialAllocations}</p>
        </div>
        <div className="mb-4">
          <h2 className="text-xl text-white font-bold mb-2">
            Updated Allocations:
          </h2>
          <p className="text-gray-400">{updatedAllocations}</p>
        </div>
      </div>
    </div>
  );
};

export default Results;
