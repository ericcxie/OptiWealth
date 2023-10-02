import React from "react";

interface PortfolioTableProps {
  data: any[];
}

const PortfolioTable: React.FC<PortfolioTableProps> = ({ data }) => {
  return (
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
  );
};

export default PortfolioTable;
