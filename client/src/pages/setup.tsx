import React, { useState } from "react";
import axios from "axios";
import { BarLoader } from "react-spinners";
import { Link } from "react-router-dom";
import PortfolioTable from "../components/portfolioTable";

const Setup: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleTableUpdate = (updatedData: any[]) => {
    setData(updatedData);
  };

  const handleUpload = async () => {
    if (selectedFile) {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("file", selectedFile);
      try {
        const response = await axios.post(
          "http://127.0.0.1:5000/upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setData(response.data);
      } catch (error) {
        console.error("Error uploading file:", error);
      } finally {
        setTimeout(() => setIsLoading(false), 2000); // Display loading for a minimum of 3000ms
      }
    }
  };

  const handleSubmit = async () => {
    // Handle the submission logic here. E.g. send data to an API endpoint.
    console.log("Portfolio Submitted:", data);
  };

  return (
    <div className="bg-background flex h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="max-w-xl mx-auto w-full">
        {isLoading ? (
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
        ) : data.length > 0 ? (
          <div>
            <h2 className="mt-4 text-center text-4xl font-bold leading-9 tracking-tight text-white">
              Modify Your{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-teal-500">
                Portfolio
              </span>
            </h2>
            <p className="text-md mt-2 text-gray-400 mb-4 text-center">
              Once finished, press submit to save.
            </p>
            <PortfolioTable data={data} onUpdate={handleTableUpdate} />
            <div className="mt-6">
              <button
                onClick={handleSubmit}
                className="w-full h-12 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
              >
                Submit
              </button>
              <p className="mt-5 text-center text-sm text-gray-500">
                <button
                  onClick={() => setData([])}
                  className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
                >
                  Back
                </button>
              </p>
            </div>
          </div>
        ) : (
          <>
            <h2 className="mt-4 text-center text-4xl font-bold leading-9 tracking-tight text-white">
              Set Up Your{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-teal-500">
                Portfolio
              </span>
            </h2>
            <div className="mt-8">
              <label className="block text-lg font-medium text-white">
                Upload Your Investment Portfolio
              </label>
              <p className="text-md text-gray-400 mb-4">
                You can upload a CSV/Excel file or an image (Currently beta,
                only supports Wealthsimple)
              </p>
              <input
                type="file"
                accept=".csv,.xlsx,image/png,image/jpeg"
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
            <div className="mt-6 text-center">
              <span className="text-sm text-gray-400 italic">
                Image Upload is a beta feature and may not work perfectly.
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Setup;
