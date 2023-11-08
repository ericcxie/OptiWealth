import React from "react";
import { useNavigate } from "react-router-dom";

type BackButtonProps = {
  link?: string;
  onClick?: () => void;
};

const BackButton: React.FC<BackButtonProps> = ({ link, onClick }) => {
  const navigate = useNavigate();

  const handleOnClick = () => {
    if (onClick) {
      onClick();
    } else if (link) {
      navigate(link);
    }
  };

  return (
    <button
      className="absolute bottom-10 left-10 inline-block rounded-full border border-indigo-600 p-3 text-indigo-600 hover:bg-indigo-600 hover:text-white focus:outline-none focus:ring active:bg-indigo-500"
      onClick={handleOnClick}
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
    </button>
  );
};

export default BackButton;
