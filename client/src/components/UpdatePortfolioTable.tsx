import React, { useState, useEffect, useRef } from "react";

interface PortfolioTableProps {
  data: any[];
  onUpdate: (updatedData: any[]) => void;
}

const UpdatePortfolioTable: React.FC<PortfolioTableProps> = ({
  data,
  onUpdate,
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
    setEditingRow(index);
    setEditableData({ ...data[index] });
  };

  const handleSave = (index: number) => {
    if (editableData) {
      if (Number(editableData["Total Shares"]) <= 0) {
        editableData["Total Shares"] = "0";
        console.log("Negative number detected during save, set to 0");
      }

      const updatedData = [...data];
      updatedData[index] = editableData;
      onUpdate(updatedData);
    }
    setEditingRow(null);
    setEditableData(null);
  };

  const handleDelete = (index: number) => {
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
      const value =
        key === "Total Shares" ? Number(e.target.value) : e.target.value;
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
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-md text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Ticker
            </th>
            <th scope="col" className="px-6 py-3">
              Total Shares
            </th>
            <th scope="col" className="px-6 py-3">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr
              key={index}
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <td className="px-6 py-4">
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
                  row.Ticker
                )}
              </td>
              <td className="px-6 py-4">
                {editingRow === index ? (
                  <input
                    type="number"
                    value={
                      editableData?.["Total Shares"] !== undefined
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
    </div>
  );
};

export default UpdatePortfolioTable;
