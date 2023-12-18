import React from "react";

interface InstructionsTableProps {
  instructions: {
    action: string;
    asset: string;
    amount: string;
  }[];
}

const InstructionsTable: React.FC<InstructionsTableProps> = ({
  instructions,
}) => {
  return (
    <div className="relative overflow-y-auto h-96 mb-6 shadow-md rounded-lg scrollbar-thin scrollbar-thumb-gray scrollbar-track-gray">
      <table className="w-full text-md text-left text-white">
        <thead className="sticky uppercase top-0 bg-slate-700 text-gray-300">
          <tr>
            <th scope="col" className="px-6 py-3">
              Action
            </th>
            <th scope="col" className="px-6 py-3">
              Asset
            </th>
            <th scope="col" className="px-6 py-3">
              Amount
            </th>
          </tr>
        </thead>
        <tbody>
          {instructions.map((instruction, index) => (
            <tr
              key={index}
              className={`border-b border-gray-700 ${
                instruction.asset === "Bonds" || instruction.asset === "Cash"
                  ? "bg-gray-800 hover:bg-gray-700"
                  : "bg-gray-900 hover:bg-gray-700"
              }`}
            >
              <th
                scope="row"
                className={`px-6 py-4 font-medium whitespace-nowrap ${
                  instruction.action === "Sell"
                    ? "text-red-600"
                    : "text-green-600"
                }`}
              >
                {instruction.action}
              </th>
              <td className="px-6 py-4">{instruction.asset}</td>
              <td
                className={`px-6 py-4 ${
                  instruction.action === "Sell"
                    ? "text-red-600"
                    : "text-green-600"
                }`}
              >
                {instruction.amount}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InstructionsTable;
