import React, { useState, useEffect, useRef } from "react";

interface PortfolioTableProps {
  data: any[];
  onUpdate: (updatedData: any[]) => void;
  invalidTickers: string[];
}

const UploadPortfolioTable: React.FC<PortfolioTableProps> = ({
  data,
  onUpdate,
  invalidTickers,
}) => {
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [editableData, setEditableData] = useState<any | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const divRef = useRef(null);

  console.log("Invalid tickers", invalidTickers);

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
  const handleAddRow = () => {
    const newRow = { Ticker: "", "Total Shares": 0 };
    onUpdate([...data, newRow]);
    setEditingRow(data.length); // Set the new row to be in edit mode
    setEditableData(newRow);
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
    <div className="relative overflow-x-auto overflow-y-auto max-h-[30rem] shadow-md sm:rounded-lg scrollbar-thin scrollbar-thumb-gray scrollbar-track-gray">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="sticky top-0 text-md text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
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
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                {editingRow === index ? (
                  <input
                    ref={inputRef}
                    type="text"
                    value={editableData?.Ticker || ""}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onChange={(e) => handleInputChange(e, "Ticker", index)}
                    className="px-2 py-1 rounded-md bg-gray-200 dark:bg-gray-700 dark:text-white"
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
                    type="text"
                    value={
                      editableData?.["Total Shares"] !== ""
                        ? editableData["Total Shares"]
                        : ""
                    }
                    onChange={(e) =>
                      handleInputChange(e, "Total Shares", index)
                    }
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className="px-2 py-1 rounded-md bg-gray-200 dark:bg-gray-700 dark:text-white"
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
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => handleDelete(index)}
                      className="font-medium text-red-600 dark:text-red-500 hover:underline ml-4"
                    >
                      Delete
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleEdit(index)}
                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                  >
                    Edit
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* <div>
        <button
          onClick={handleAddRow}
          className="mt-10 bg-indigo-600 hover:bg-indigo-500 text-white h-10 w-full px-3 rounded-md"
        >
          Add Row
        </button>
      </div> */}
    </div>
  );
};

export default UploadPortfolioTable;
