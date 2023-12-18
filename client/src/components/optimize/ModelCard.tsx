import React from "react";
import { Portfolio } from "../../utils/data/models";

interface Props {
  portfolio: Portfolio;
  onSelect: (portfolioName: string) => void;
}

const ModelCard: React.FC<Props> = ({ portfolio, onSelect }) => {
  const handleSelect = () => {
    onSelect(portfolio.name);
  };

  return (
    <div className="bg-gray-800 p-4 m-4 w-80 rounded-xl">
      <h2 className="text-white text-2xl font-bold mb-3">{portfolio.name}</h2>
      <hr className="border-gray-500 mb-4" />
      <div className="mb-4">
        <div className="text-gray-100 mb-2">Stocks: {portfolio.stocks}%</div>
        <div className="text-gray-100 mb-2">Bonds: {portfolio.bonds}%</div>
        <div className="text-gray-100 mb-2">Cash: {portfolio.cash}%</div>
      </div>
      <p className="text-gray-400 mb-4">{portfolio.description}</p>

      <button
        className="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium rounded-xl group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white text-white focus:ring-4 focus:outline-none"
        onClick={handleSelect}
      >
        <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-gray-800 rounded-xl group-hover:bg-opacity-0">
          Select
        </span>
      </button>
    </div>
  );
};

export default ModelCard;
