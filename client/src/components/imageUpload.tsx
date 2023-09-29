import React, { useState } from "react";

interface ProcessedData {
  [key: string]: number;
}

const ImageUpload: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [processedData, setProcessedData] = useState<ProcessedData | null>(
    null
  );

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedImage(file);
  };

  const handleSubmit = async () => {
    if (!selectedImage) {
      return;
    }

    // Create a FormData object to send the image file to the backend
    const formData = new FormData();
    formData.append("image", selectedImage);

    // Send the image to the Flask backend using a POST request
    const response = await fetch("/upload-image", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      // Handle the response from the backend here, e.g., display the processed data
      const data: ProcessedData = await response.json();
      setProcessedData(data);
    } else {
      // Handle error responses if needed
      console.error("Failed to upload and process the image.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 m-10 border rounded-lg shadow-lg bg-white">
      <h1 className="text-2xl font-semibold mb-4">Image Upload</h1>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="mb-2"
      />
      <button
        onClick={handleSubmit}
        className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-xl"
      >
        Upload and Process
      </button>

      {processedData && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">Processed Data</h2>
          <pre className="bg-gray-200 p-2 rounded">
            {JSON.stringify(processedData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
