import React, { useState, useEffect, useRef } from "react";
import { PulseLoader } from "react-spinners";
import SideBar from "../components/sidebar";
import { auth } from "../utils/firebase";
import axios from "axios";
import Aos from "aos";
import "aos/dist/aos.css";

import UpdatePortfolioTable from "../components/tables/UpdatePortfolioTable";

const ManagePortfolio: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [portfolioData, setPortfolioData] = useState<any[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [invalidTickers, setInvalidTickers] = useState<string[]>([]);

  const user = auth.currentUser;
  const userEmail = user ? user.email : null;
  const displayName = user ? user.displayName : "User";
  const firstName = displayName ? displayName.split(" ")[0] : "User";

  const setMessageWithTimeout = (message: string, timeout: number) => {
    setMessage(message);
    setTimeout(() => {
      setMessage("");
    }, timeout);
  };

  console.log("Current portfolio", portfolioData);

  useEffect(() => {
    const fetchPortfolioData = async () => {
      console.log("Fetching portfolio data for:", userEmail);
      if (!userEmail) {
        console.error("User email is not available.");
        return;
      }

      try {
        const response = await fetch("/get_portfolio", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user_email: userEmail }),
        });

        const data = await response.json();
        setPortfolioData(data);
        localStorage.setItem("portfolioData", JSON.stringify(data));
        console.log("Portfolio data fetched!", data);
      } catch (error) {
        console.error("Error fetching portfolio data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolioData();
  }, [userEmail]);

  const handleUpdate = (updatedData: any[]) => {
    setPortfolioData(updatedData);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      await handleUpload(file);
    }
  };

  const handleUpload = async (file: File) => {
    if (file) {
      console.log(file, "Received");
      setLoading(true);
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
        await new Promise((resolve) => setTimeout(resolve, 2000));

        if (
          response.data &&
          typeof response.data === "object" &&
          !Array.isArray(response.data)
        ) {
          const dataArray = Object.entries(response.data).map(
            ([Ticker, TotalShares]) => ({ Ticker, "Total Shares": TotalShares })
          );
          setPortfolioData(dataArray);
          setMessageWithTimeout("Portfolio uploaded successfully!", 3000);
        } else {
          setPortfolioData(response.data);
          setMessageWithTimeout("Portfolio uploaded successfully!", 3000);
        }
        window.location.reload();
      } catch (error) {
        console.error("Error uploading file:", error);
        setMessageWithTimeout("Error uploading portfolio!", 3000);
      } finally {
        setTimeout(() => setLoading(false), 1500);
      }
    }
  };

  const handleSubmit = async () => {
    if (!userEmail) {
      console.error("User email is not available.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/update-portfolio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_email: userEmail,
          portfolio_data: portfolioData,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        if (data.invalid_tickers) {
          console.error("Invalid tickers:", data.invalid_tickers);
          setInvalidTickers(data.invalid_tickers);
          setMessageWithTimeout(
            `Error due to invalid tickers.<br/>Please fix the invalid tickers and try again.`,
            60000
          );
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } else {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const data = await response.json();
        console.log("Portfolio data updated!", data);
        setMessageWithTimeout("Portfolio updated successfully!", 3000);
      }
    } catch (error) {
      console.error("Error updating portfolio data:", error);
      setMessageWithTimeout("Error updating portfolio data!", 3000);
    }

    setLoading(false);
  };

  const handleAddNewRow = () => {
    setPortfolioData((prevData) => [
      ...prevData,
      { Ticker: "", "Total Shares": "0" },
    ]);
  };

  useEffect(() => {
    Aos.init({ duration: 800 });
  }, []);

  return (
    <div className="flex h-screen bg-background text-white font-inter">
      <SideBar />

      <div
        data-aos="fade-up"
        data-aos-once
        className="flex-1 flex flex-col justify-start items-start pt-14 pl-80"
      >
        <h2 className="mt-2 text-center text-4xl font-bold leading-9 tracking-tight text-white">
          Update Your{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-teal-500">
            Portfolio
          </span>
        </h2>

        {/* Portfolio Table and Related Components */}
        <div className="mt-6 w-full pr-16">
          <div className="font-inter">
            <div className="flex justify-between items-center mt-4">
              <div className="text-xl text-gray-100 font-semibold">
                {firstName}'s Portfolio
              </div>
              <div className="flex">
                <button
                  onClick={triggerFileInput}
                  className="h-9 mb-3 mx-1 px-5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
                >
                  Upload
                </button>
                <button
                  onClick={handleAddNewRow}
                  className="h-9 mb-3 mx-1 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
                >
                  New Investment
                </button>
              </div>
            </div>
            <UpdatePortfolioTable
              data={portfolioData}
              onUpdate={handleUpdate}
              invalidTickers={invalidTickers}
            />
          </div>
          <div className="mt-6">
            <button
              disabled={loading}
              type="button"
              className="h-12 w-full mb-3 px-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
              onClick={handleSubmit}
            >
              {loading && (
                <svg
                  aria-hidden="true"
                  role="status"
                  className="inline w-4 h-4 mr-3 text-white animate-spin"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="#E5E7EB"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentColor"
                  />
                </svg>
              )}
              {loading ? "Loading..." : "Save Changes"}
            </button>
          </div>
          <div
            className="flex justify-center text-center items-center text-gray-200"
            dangerouslySetInnerHTML={{ __html: message || "" }}
          />
        </div>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
        accept=".png,.jpg,.jpeg,.csv,.xlsx"
      />
    </div>
  );
};

export default ManagePortfolio;
