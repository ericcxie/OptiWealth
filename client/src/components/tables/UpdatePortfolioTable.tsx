import React, { useEffect, useRef, useState } from "react";

interface PortfolioTableProps {
  data: any[];
  onUpdate: (updatedData: any[]) => void;
  invalidTickers: string[];
}

const UpdatePortfolioTable: React.FC<PortfolioTableProps> = ({
  data,
  onUpdate,
  invalidTickers,
}) => {
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [editableData, setEditableData] = useState<any | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingRow !== null && inputRef.current) {
      inputRef.current.focus(); // Focus the input when editingRow changes
    }
  }, [editingRow]);

  const handleEdit = (index: number) => {
    const editableRow = { ...data[index] };
    editableRow["Total Shares"] = String(editableRow["Total Shares"]);
    setEditingRow(index);
    setEditableData(editableRow);
  };

  const handleSave = (index: number) => {
    if (editableData) {
      const updatedData = [...data];
      updatedData[index] = {
        ...editableData,
        "Total Shares": Number(editableData["Total Shares"]),
      };
      onUpdate(updatedData);
    }
    setEditingRow(null);
    setEditableData(null);
  };

  const handleDelete = (index: number) => {
    setEditingRow(null);
    setEditableData(null);
    const updatedData = [...data];
    updatedData.splice(index, 1);
    onUpdate(updatedData);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: string,
    index: number
  ) => {
    if (editingRow === index) {
      const value = e.target.value;
      setEditableData({ ...editableData, [key]: value });
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Enter") {
      handleSave(index);
    }
  };

  return (
    <div className="relative overflow-y-auto max-h-96 mt-2 shadow-md rounded-lg scrollbar-thin scrollbar-thumb-gray scrollbar-track-gray">
      <table className="w-full text-sm text-left text-gray-400">
        <thead className="sticky uppercase top-0 bg-gray-700 text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Ticker
            </th>
            <th scope="col" className="px-6 py-3">
              Total Shares
            </th>
            <th scope="col" className="px-6 py-3">
              <span className="sr-only">Edit</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr
              key={index}
              className="border-b bg-gray-800 border-gray-700 hover:bg-gray-600"
            >
              <th
                scope="row"
                className="px-6 py-4 font-medium whitespace-nowrap text-white"
              >
                {editingRow === index ? (
                  <input
                    ref={inputRef}
                    type="text"
                    value={editableData?.Ticker || ""}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onChange={(e) => handleInputChange(e, "Ticker", index)}
                    className="w-full px-2 py-1 rounded-md bg-gray-700 text-white"
                  />
                ) : (
                  <>
                    {row.Ticker}
                    {invalidTickers.includes(row.Ticker) && (
                      <span className="text-red-500 ml-2 cursor-pointer relative">
                        <a
                          href="https://bit.ly/OptiWealthDocsError"
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Why Am I Seeing This Error?"
                        >
                          ⚠️
                        </a>
                      </span>
                    )}
                  </>
                )}
              </th>
              <td className="px-6 py-4">
                {editingRow === index ? (
                  <input
                    type="number"
                    value={
                      editableData?.["Total Shares"] !== ""
                        ? editableData["Total Shares"]
                        : ""
                    }
                    onChange={(e) =>
                      handleInputChange(e, "Total Shares", index)
                    }
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className="w-full px-2 py-1 rounded-md bg-gray-700 text-white"
                  />
                ) : (
                  row["Total Shares"]
                )}
              </td>
              <td className="px-6 py-4 text-right">
                {editingRow === index ? (
                  <>
                    <button
                      onClick={() => handleSave(index)}
                      className="font-medium text-blue-500 hover:underline"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => handleDelete(index)}
                      className="font-medium text-red-500 hover:underline ml-4"
                    >
                      Delete
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleEdit(index)}
                    className="font-medium text-blue-500 hover:underline"
                  >
                    Edit
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UpdatePortfolioTable;
