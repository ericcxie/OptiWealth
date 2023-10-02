import React, { useState } from "react";
import axios from "axios";
import { BarLoader, BeatLoader } from "react-spinners";

const Setup: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
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
        setTimeout(() => setIsLoading(false), 3000); // Display loading for a minimum of 3000ms
      }
    }
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
          <div className="mt-8 max-w-xl mx-auto w-full overflow-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b border-gray-200 text-left text-sm leading-4 text-gray-500 uppercase tracking-wider">
                    Ticker
                  </th>
                  <th className="py-2 px-4 border-b border-gray-200 text-left text-sm leading-4 text-gray-500 uppercase tracking-wider">
                    Total Shares
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, index) => (
                  <tr key={index}>
                    <td className="py-2 px-4 border-b border-gray-200 text-sm">
                      {row.Ticker}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-200 text-sm">
                      {row["Total Shares"]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <>
            <h2 className="mt-4 text-center text-2xl font-bold leading-9 tracking-tight text-white">
              Set Up Your Portfolio
            </h2>
            <div className="mt-8">
              <label className="block text-sm font-medium text-white">
                Upload Your Investment Portfolio
              </label>
              <p className="text-sm text-gray-400 mb-4">
                You can upload a CSV/Excel file or an image (Beta, currently
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
