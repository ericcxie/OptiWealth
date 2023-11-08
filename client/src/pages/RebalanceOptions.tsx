// Filename: PortfolioOptions.tsx

import React from "react";
import { FaInfoCircle } from "react-icons/fa";
import { AiOutlineLineChart, AiOutlinePieChart } from "react-icons/ai";

const PortfolioOptions: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-white p-6">
      <header className="text-center mb-10">
        <h1 className="text-2xl font-bold">Portfolio Rebalancing Options</h1>
        <p>
          Choose how you'd like to balance your portfolio for optimal
          performance.
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-10">
        <div className="border rounded-lg p-6 hover:bg-gray-800 transition">
          <div className="flex items-center mb-4">
            <AiOutlineLineChart className="text-3xl mr-4" />
            <h2 className="text-xl font-semibold">Rebalance Using Beta</h2>
          </div>
          <p>
            Adjust your stock portfolio based on beta to align with your risk
            tolerance.
          </p>
          <div className="mt-4">
            <button className="border py-1 px-4 rounded-md hover:bg-gray-700 transition">
              Select
            </button>
            <FaInfoCircle
              className="inline ml-3 hover:text-gray-400 transition"
              title="Learn more about beta rebalancing"
            />
          </div>
        </div>

        <div className="border rounded-lg p-6 hover:bg-gray-800 transition">
          <div className="flex items-center mb-4">
            <AiOutlinePieChart className="text-3xl mr-4" />
            <h2 className="text-xl font-semibold">
              Rebalance Entire Portfolio
            </h2>
          </div>
          <p>
            Balance your stocks, bonds, and cash to achieve your desired risk
            and return levels.
          </p>
          <div className="mt-4">
            <button className="border py-1 px-4 rounded-md hover:bg-gray-700 transition">
              Select
            </button>
            <FaInfoCircle
              className="inline ml-3 hover:text-gray-400 transition"
              title="Learn more about full portfolio rebalancing"
            />
          </div>
        </div>
      </div>

      <footer className="mt-10 text-center">
        <p>
          Need help or have questions?{" "}
          <a href="#" className="underline hover:text-gray-400 transition">
            Learn more here
          </a>
          .
        </p>
      </footer>
    </div>
  );
};

export default PortfolioOptions;
