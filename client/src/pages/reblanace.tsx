import React from "react";
import { Link } from "react-router-dom";
// import PortfolioCard from './PortfolioCard';
import { portfolios } from "../utils/models";
import SideBar from "../components/sidebar";
import ModelCard from "../components/ModelCard";

const Rebalance: React.FC = () => {
  return (
    <div className="bg-background min-h-screen p-4">
      <div className="text-center mb-16 mt-14">
        <h1 className="text-3xl text-white font-bold mb-3">
          Pick a Portfolio Model
        </h1>
        <p className="text-gray-400 mb-2">
          Select a target portfolio that most closely matches your desired
          investment style.
        </p>
      </div>
      <div className="flex flex-wrap justify-center items-start gap-6">
        {portfolios.map((portfolio) => (
          <ModelCard key={portfolio.name} portfolio={portfolio} />
        ))}
      </div>
      <a
        href="/dashboard"
        className="absolute bottom-10 left-10 inline-block rounded-full border border-indigo-600 p-3 text-indigo-600 hover:bg-indigo-600 hover:text-white focus:outline-none focus:ring active:bg-indigo-500"
      >
        <svg
          className="h-5 w-5 transform rotate-180"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M14 5l7 7m0 0l-7 7m7-7H3"
          />
        </svg>
      </a>
    </div>
  );
};

export default Rebalance;
