import React from "react";
const Landing = () => {
  return (
    <div className="p-8 h-screen flex flex-col justify-center items-center">
      <h1 className="text-4xl font-semibold text-indigo-700">OptiWealth</h1>

      <p className="text-lg mb-4">
        A simple portfolio rebalancer based on the Efficient Frontier
        methodology
      </p>

      <button className="bg-purple-700 text-white px-4 py-2 rounded-full hover:bg-purple-900">
        Get Started
      </button>
    </div>
  );
};

export default Landing;
