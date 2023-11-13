import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import { BarLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import { auth } from "../utils/firebase";
import Aos from "aos";
import "aos/dist/aos.css";

import UploadPortfolioTable from "../components/tables/UploadPortfolioTable";

const Setup: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
      if (fileInputRef.current) {
        fileInputRef.current.files = files;
      }
      handleUpload(files[0]);
    }
  };

  const handleAddNewRow = () => {
    setData((prevData) => [...prevData, { Ticker: "", "Total Shares": "0" }]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      handleUpload(e.target.files[0]);
    }
  };

  const handleTableUpdate = (updatedData: any[]) => {
    setData(updatedData);
  };

  const handleUpload = async (file: File) => {
    if (file) {
      console.log(file, "Received");
      setIsLoading(true);
      const formData = new FormData();
      formData.append("file", file);
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
        console.log("Received Data:", response.data);

        if (
          response.data &&
          typeof response.data === "object" &&
          !Array.isArray(response.data)
        ) {
          // Convert the object to an array of objects
          const dataArray = Object.entries(response.data).map(
            ([Ticker, TotalShares]) => ({ Ticker, "Total Shares": TotalShares })
          );
          setData(dataArray);
        } else {
          // If it’s already an array (from excel), set it directly
          setData(response.data);
        }
      } catch (error) {
        console.error("Error uploading file:", error);
      } finally {
        setTimeout(() => setIsLoading(false), 1500);
      }
    }
  };

  const handleBack = () => {
    setData([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setSelectedFile(null);
  };

  const handleSubmit = async () => {
    const user = auth.currentUser;
    if (!user) {
      console.error("No user logged in.");
      return;
    }

    setIsLoading(true);

    const userEmail = user.email;
    const userUID = user.uid;

    const threeSecondsPromise = new Promise((resolve) =>
      setTimeout(resolve, 3000)
    );
  };

  useEffect(() => {
    Aos.init({ duration: 1000 });
  }, []);

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
            <div className="flex justify-end">
              <button
                onClick={handleAddNewRow}
                className="h-9 mb-3 px-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
              >
                New Investment
              </button>
            </div>

            <UploadPortfolioTable data={data} onUpdate={handleTableUpdate} />
            <div className="mt-6">
              <button
                onClick={handleSubmit}
                className="w-full h-12 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
              >
                Submit
              </button>
              <p className="mt-5 text-center text-sm text-gray-500">
                <button
                  onClick={handleBack}
                  className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
                >
                  Back
                </button>
              </p>
            </div>
          </div>
        ) : (
          <>
            <div data-aos="fade-up" data-aos-once>
              <h2 className="mt-4 text-center text-4xl font-bold leading-9 tracking-tight text-white">
                Upload Your{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-teal-500">
                  Portfolio
                </span>
              </h2>
              <div className="mt-5">
                <label className="block text-lg font-medium text-white">
                  Upload Your Investment Portfolio
                </label>
                <p className="text-md text-gray-400 mb-4">
                  You can upload a CSV/Excel file or an image (Currently beta,
                  only supports Wealthsimple)
                </p>
                <label
                  htmlFor="dropzone-file"
                  className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                      className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 16"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                      />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      CSV, XLSX, PNG, or JPG
                    </p>
                  </div>
                  <input
                    id="dropzone-file"
                    type="file"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".csv,.xlsx,image/png,image/jpeg"
                  />
                </label>
              </div>
              <div className="mt-6 text-center">
                <span className="text-sm text-gray-400 italic">
                  Image upload is a beta feature and may not work perfectly.
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Setup;
