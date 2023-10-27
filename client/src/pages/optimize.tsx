import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { portfolios } from "../utils/models";
import { auth } from "../utils/firebase";
import ModelCard from "../components/optimize/ModelCard";
import InvestmentInput from "../components/optimize/InvestmentInput";
import { BarLoader } from "react-spinners";

const Optimize: React.FC = () => {
  const [selectedModel, setSelectedModel] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const navigate = useNavigate();

  const user = auth.currentUser;
  const userEmail = user ? user.email : null;
  const targetModel = portfolios.find((p) => p.name === selectedModel);

  // Show the users selected model in the console
  useEffect(() => {
    console.log("User email:", userEmail);
    console.log("Selected model:", selectedModel);
    console.log(targetModel);
  }, [selectedModel]);

  const handleSubmit = async (bonds: number, cash: number) => {
    setLoading(true);

    const payload = {
      user_email: userEmail,
      bonds: bonds,
      cash: cash,
      target_model: targetModel,
    };

    let data; // Declare data here

    try {
      const response = await fetch("/rebalance-portfolio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      data = await response.json(); // Assign to the declared variable
      console.log(data);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    } finally {
      setLoading(false);
      console.log("Fetch operation complete");
      if (data) {
        // Ensure data exists before navigating
        navigate("/results", { state: { resultsData: data } });
      }
    }
  };

  const resetModelSelection = () => {
    setSelectedModel(null);
  };

  return (
    <div className="bg-background min-h-screen p-4 text-inter">
      {loading && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <BarLoader color="#FFFFFF" />
        </div>
      )}
      <div className="text-center mb-16 mt-14">
        <h1 className="text-4xl text-white font-bold mb-3">
          {selectedModel ? "Your Current Holdings" : "Pick a Portfolio Model"}
        </h1>
        <p className="text-gray-400 mb-2 max-w-xl mx-auto">
          {selectedModel
            ? "Enter the total amount of bonds and cash you currently hold in your portfolio."
            : "Select a target portfolio that most closely matches your desired investment style."}
        </p>
      </div>
      {selectedModel ? (
        <InvestmentInput
          onInputSubmit={handleSubmit}
          onReset={resetModelSelection}
          portfolioModel={selectedModel}
        />
      ) : (
        <div className="flex flex-wrap justify-center items-start gap-6">
          {portfolios.map((portfolio) => (
            <ModelCard
              key={portfolio.name}
              portfolio={portfolio}
              onSelect={setSelectedModel}
            />
          ))}
        </div>
      )}
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

export default Optimize;
