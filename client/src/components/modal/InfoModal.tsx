import React, { useEffect, useState } from "react";
import { LearnRebalance } from "../../utils/data/LearnRebalance";

interface ModalProps {
  show: boolean;
  onClose: () => void;
}

const InfoModal: React.FC<ModalProps> = ({ show, onClose }) => {
  const [isVisible, setIsVisible] = useState(show);

  useEffect(() => {
    setIsVisible(show);
  }, [show]);

  const closeModal = () => {
    setIsVisible(false);
    setTimeout(() => onClose(), 300);
  };

  return (
    <div
      className={`hs-overlay fixed top-0 left-0 w-full h-full z-[60] bg-black/40 flex justify-center items-center transition-opacity ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onClick={closeModal}
    >
      <div
        className="bg-gray-800 rounded-xl shadow-lg max-w-4xl w-full max-h-[80%] overflow-y-auto font-inter px-3 pt-2 transition-transform transform-gpu duration-300 ease-in-out"
        style={{
          transform: isVisible ? "translateY(0)" : "translateY(100%)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center py-3 px-4 border-b border-gray-700">
          <h3 className="font-bold text-3xl text-white">
            Portfolio Rebalancing
          </h3>
          <button
            type="button"
            className="hs-dropdown-toggle inline-flex flex-shrink-0 justify-center items-center h-8 w-8 rounded-md text-gray-500 hover:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all text-sm focus:ring-gray-700 focus:ring-offset-gray-800"
            onClick={closeModal}
          >
            <span className="sr-only">Close</span>
          </button>
        </div>
        <div className="p-4 text-white">
          <h2 className="text-2xl font-semibold mb-2">
            What is Portfolio Rebalancing?
          </h2>
          <p className="mb-6 text-gray-100">
            {LearnRebalance.whatIsRebalancing}
          </p>
          <h2 className="text-2xl font-semibold mb-2">Why is it important?</h2>
          <p className="mb-6 text-gray-100">
            {LearnRebalance.whyIsItImportant}
          </p>
          <h2 className="text-2xl font-semibold mb-2">
            What is the algorithm doing?
          </h2>
          <p className="text-gray-100">{LearnRebalance.algorithmOverview}</p>
          <p className="mt-3">
            <a href="https://intelligent.schwab.com/article/determine-your-risk-tolerance-level">
              <span className="underline hover:text-indigo-500">
                Learn more about determining your risk tolerance
              </span>
            </a>
          </p>
        </div>
        <div className="flex justify-end items-center gap-x-2 py-3 px-4 border-t border-gray-700">
          <button
            type="button"
            className="hs-dropdown-toggle py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl px-4 text-white ..."
            onClick={closeModal}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default InfoModal;
