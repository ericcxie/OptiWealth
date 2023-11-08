import React, { useState, useEffect } from "react";
import Aos from "aos";
import "aos/dist/aos.css";

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
  const [bonds, setBonds] = useState<string>("");
  const [cash, setCash] = useState<string>("");

  const handleSubmit = () => {
    onInputSubmit(Number(bonds), Number(cash));
  };

  useEffect(() => {
    Aos.init({ duration: 800 });
  }, []);

  return (
    <div
      className="bg-gray-800 py-6 px-6 m-4 w-96 rounded-xl mx-auto"
      data-aos="fade-up"
      data-aos-once
    >
      <h2 className="text-white text-2xl font-bold mb-3">
        {portfolioModel} Model
      </h2>
      <hr className="border-gray-500 mb-4" />

      <div className="mb-4">
        <label className="text-gray-100 block mb-2">Amount in Bonds ($):</label>
        <input
          type="number"
          value={bonds}
          onChange={(e) => setBonds(e.target.value)}
          className="p-2 w-full bg-gray-700 rounded text-white outline-none"
        />

        <label className="text-gray-100 block my-2">Amount in Cash ($):</label>
        <input
          type="number"
          value={cash}
          onChange={(e) => setCash(e.target.value)}
          className="p-2 w-full bg-gray-700 rounded text-white outline-none"
        />
      </div>

      <button
        className="w-full bg-gradient-to-br hover:bg-gradient-to-bl from-purple-600 to-blue-500 text-white p-2 rounded-xl"
        onClick={handleSubmit}
      >
        Submit
      </button>
    </div>
  );
};

export default InvestmentInput;
