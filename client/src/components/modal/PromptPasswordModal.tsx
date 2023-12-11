import React from "react";
import { IoClose } from "react-icons/io5";

interface PromptPasswordModalProps {
  showModal: boolean;
  handleConfirmUpdate: (password: string) => void;
  handleCloseModal: () => void;
}

const PromptPasswordModal: React.FC<PromptPasswordModalProps> = ({
  showModal,
  handleConfirmUpdate,
  handleCloseModal,
}) => {
  const [password, setPassword] = React.useState("");

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmitClick = () => {
    handleConfirmUpdate(password);
    setPassword("");
  };

  if (!showModal) {
    return null;
  }

  return (
    <div className="fixed top-0 right-0 bottom-0 left-0 z-50 flex justify-center items-center w-full h-full bg-black bg-opacity-50">
      <div className="relative pt-2 w-full max-w-md max-h-full bg-gray-800 rounded-lg shadow-lg">
        <button
          type="button"
          className="absolute top-3 right-2.5 text-gray-400"
          onClick={handleCloseModal}
        >
          <IoClose size="1.7em" />
        </button>
        <div className="p-4 md:p-5 mt-3 text-center">
          <h3 className="mb-3 text-lg font-normal text-gray-300">
            Please enter your password to continue
          </h3>
          <input
            type="password"
            id="passwordInput"
            name="passwordInput"
            value={password}
            onChange={handlePasswordChange}
            placeholder="Password"
            className="pl-2 mb-3 block w-full rounded-md border-0 py-1.5 bg-[#212834] text-white shadow-sm ring-1 ring-inset ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
          <button
            onClick={handleSubmitClick}
            type="button"
            disabled={password === ""}
            className="text-white disabled:cursor-not-allowed disabled:brightness-50 disabled:bg-red-800 bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
          >
            Submit
          </button>
          <button
            onClick={handleCloseModal}
            type="button"
            className="text-gray-300 bg-gray-700 hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-gray-500 rounded-lg border border-gray-700 text-sm font-medium px-5 py-2.5 hover:text-gray-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromptPasswordModal;
