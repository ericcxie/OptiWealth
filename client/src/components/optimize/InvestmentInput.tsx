import React, { useState } from "react";

interface Props {
  onInputSubmit: (bonds: number, cash: number) => void;
  onReset: () => void;
  portfolioModel: string | null;
}

const InvestmentInput: React.FC<Props> = ({
  onInputSubmit,
  onReset,
  portfolioModel,
}) => {
  const [bonds, setBonds] = useState<number>(0);
  const [cash, setCash] = useState<number>(0);

  const handleSubmit = () => {
    onInputSubmit(bonds, cash);
  };

  return (
    <div className="bg-gray-800 pt-6 pb-3 px-6 m-4 w-96 rounded-xl mx-auto">
      <h2 className="text-white text-2xl font-bold mb-3">
        {portfolioModel} Model
      </h2>
      <hr className="border-gray-500 mb-4" />

      <div className="mb-4">
        <label className="text-gray-100 block mb-2">Amount in Bonds ($):</label>
        <input
          type="number"
          value={bonds}
          onChange={(e) => setBonds(Number(e.target.value))}
          className="p-2 w-full bg-gray-700 rounded text-white outline-none"
        />

        <label className="text-gray-100 block my-2">Amount in Cash ($):</label>
        <input
          type="number"
          value={cash}
          onChange={(e) => setCash(Number(e.target.value))}
          className="p-2 w-full bg-gray-700 rounded text-white outline-none"
        />
      </div>

      <button
        className="w-full bg-gradient-to-br hover:bg-gradient-to-bl from-purple-600 to-blue-500 text-white p-2 rounded-xl"
        onClick={handleSubmit}
      >
        Submit
      </button>
      <button
        className="leading-6 text-white hover:text-indigo-500 w-full mt-3"
        onClick={onReset}
      >
        Back
      </button>
    </div>
  );
};

export default InvestmentInput;
