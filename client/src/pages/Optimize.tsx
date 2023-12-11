import Aos from "aos";
import "aos/dist/aos.css";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { portfolios } from "../utils/data/models";
import { auth } from "../utils/firebase";

import { FiInfo } from "react-icons/fi";
import { BarLoader } from "react-spinners";
import InvestmentInput from "../components/optimize/InvestmentInput";
import ModelCard from "../components/optimize/ModelCard";
import BackButton from "../components/ui/BackButton";
import InfoModal from "../components/modal/InfoModal";
import SideBar from "../components/sidebar";

const Optimize: React.FC = () => {
  const [selectedModel, setSelectedModel] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const navigate = useNavigate();

  const user = auth.currentUser;
  const userEmail = user ? user.email : null;
  const targetModel = portfolios.find((p) => p.name === selectedModel);

  const handleSubmit = async (bonds: number, cash: number) => {
    setLoading(true);

    const payload = {
      user_email: userEmail,
      bonds: bonds,
      cash: cash,
      target_model: targetModel,
    };

    let data;

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

      data = await response.json();
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    } finally {
      setLoading(false);
      if (data) {
        navigate("/results", {
          state: { resultsData: data },
        });
      }
    }
  };

  const resetModelSelection = () => {
    setSelectedModel(null);
  };

  useEffect(() => {
    Aos.init({ duration: 800 });
  }, []);

  if (loading) {
    return (
      <div
        className="bg-background min-h-screen p-4"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <BarLoader color="#FFFFFF" />
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen p-4 text-inter">
      <div className="md:hidden">
        <SideBar />
      </div>
      <div
        data-aos="fade-up"
        data-aos-once
        className="text-center mb-4 md:mb-16 mt-14"
      >
        <h1 className="text-3xl md:text-4xl text-white font-bold mb-3 inline-flex items-center">
          {selectedModel ? "Your Current Holdings" : "Pick a Portfolio Model"}
          <FiInfo
            className="hidden md:inline ml-2 cursor-pointer text-white hover:text-gray-400 scale-75"
            onClick={() => setIsModalOpen(true)}
          />
        </h1>
        <p className="text-gray-400 mb-2 max-w-lg mx-auto">
          {selectedModel
            ? "Enter the total amount of bonds and cash you currently hold in your portfolio."
            : "Select a target portfolio that most closely matches your desired investment style."}
        </p>
      </div>
      <InfoModal show={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <div className="flex-1 flex justify-center items-center">
        {selectedModel ? (
          <InvestmentInput
            onInputSubmit={handleSubmit}
            onReset={resetModelSelection}
            portfolioModel={selectedModel}
          />
        ) : (
          <div
            data-aos="fade-up"
            data-aos-once
            className="flex flex-wrap justify-center items-start md:gap-6"
          >
            {portfolios.map((portfolio) => (
              <ModelCard
                key={portfolio.name}
                portfolio={portfolio}
                onSelect={setSelectedModel}
              />
            ))}
          </div>
        )}
      </div>

      <div className="hidden md:block">
        {selectedModel ? (
          <BackButton onClick={resetModelSelection} />
        ) : (
          <BackButton link="/dashboard" />
        )}
      </div>
    </div>
  );
};

export default Optimize;
