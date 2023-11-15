// DeleteConfirmationModal.tsx

import React from "react";

interface DeleteConfirmationModalProps {
  showModal: boolean;
  handleConfirmDelete: () => void;
  handleCloseModal: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  showModal,
  handleConfirmDelete,
  handleCloseModal,
}) => {
  if (!showModal) {
    return null;
  }

  return (
    <div
      id="popup-modal"
      className="fixed top-0 right-0 bottom-0 left-0 z-50 flex justify-center items-center w-full h-full bg-black bg-opacity-50"
    >
      <div className="relative p-4 w-full max-w-md max-h-full bg-gray-800 rounded-lg shadow-lg">
        <button
          type="button"
          className="absolute top-3 right-2.5 text-gray-400"
          onClick={handleCloseModal}
        >
          Close
        </button>
        <div className="p-4 md:p-5 mt-3 text-center">
          <h3 className="mb-5 text-lg font-normal text-gray-300">
            Are you sure you want to delete your account?
          </h3>
          <button
            onClick={handleConfirmDelete}
            type="button"
            className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
          >
            Yes, I'm sure
          </button>
          <button
            onClick={handleCloseModal}
            type="button"
            className="text-gray-300 bg-gray-700 hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-gray-500 rounded-lg border border-gray-700 text-sm font-medium px-5 py-2.5 hover:text-gray-200"
          >
            No, cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
