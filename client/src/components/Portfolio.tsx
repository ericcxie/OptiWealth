import React, { useEffect, useState } from "react";
import { PulseLoader } from "react-spinners";

type Stock = {
  Ticker: string;
  "Total Shares": number;
  "Current Price"?: number;
};

type PortfolioProps = {
  userEmail: string;
};

const Portfolio: React.FC<PortfolioProps> = ({ userEmail }) => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    // Fetch the user stocks from your Flask endpoint
    const fetchUserStocks = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/get-user-stocks`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: userEmail }),
        });
        const data: Stock[] = await response.json();
        setStocks(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user stocks:", error);
        setLoading(false);
      }
    };
    fetchUserStocks();
  }, [userEmail]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-52 mt-10">
        <PulseLoader color="#FFFFFF" loading={loading} />
      </div>
    );
  }

  return (
    <div className="relative overflow-y-auto h-64 mt-10 shadow-md rounded-lg scrollbar-thin scrollbar-thumb-gray scrollbar-track-gray">
      <table className="w-full text-sm text-left text-gray-400">
        <thead
          className="sticky uppercase top-0 bg-gray-700 text-gray-400"
          style={{ zIndex: 1 }}
        >
          <tr>
            <th scope="col" className="px-6 py-3">
              Ticker
            </th>
            <th scope="col" className="px-6 py-3">
              Total Shares
            </th>
            <th scope="col" className="px-6 py-3">
              Current Price
            </th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock, index) => (
            <tr
              key={index}
              className="border-b bg-gray-800 border-gray-700 hover:bg-gray-600"
            >
              <td className="px-6 py-4">{stock.Ticker}</td>
              <td className="px-6 py-4">{stock["Total Shares"].toFixed(2)}</td>
              <td className="px-6 py-4">
                {stock["Current Price"]
                  ? `$${stock["Current Price"].toFixed(2)}`
                  : "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Portfolio;
