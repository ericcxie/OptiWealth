import React, { useState } from "react";
import { Link } from "react-router-dom";

const Setup: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    // Handle the file upload logic here
    if (selectedFile) {
      // You can use Firebase Storage or any other storage service
      // to upload the file.
      // Here's a simple console log to show the selected file name.
      console.log("Selected file:", selectedFile.name);
    } else {
      // Handle the case where no file is selected
    }
  };

  return (
    <div className="bg-background flex h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="max-w-sm mx-auto w-full">
        <h2 className="mt-4 text-center text-2xl font-bold leading-9 tracking-tight text-white">
          Set Up Your Portfolio
        </h2>

        <div className="mt-8">
          <label className="block text-sm font-medium text-white">
            Upload Your Portfolio (CSV, Excel, etc.)
          </label>
          <input
            type="file"
            accept=".csv,.xlsx"
            onChange={handleFileChange}
            className="mt-2 p-2 w-full rounded-md border-0 bg-[#212834] text-white shadow-sm ring-1 ring-inset ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
          />
        </div>

        <div className="mt-6">
          <button
            onClick={handleUpload}
            className="w-full h-12 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
          >
            Upload
          </button>
        </div>

        <p className="mt-4 text-center text-sm text-gray-500">
          <Link
            to="/dashboard"
            className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
          >
            Skip for now and go to dashboard
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Setup;
