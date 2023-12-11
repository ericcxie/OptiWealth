import axios from "axios";
import { ChangeEvent, Component } from "react";

interface State {
  imageFile: File | null;
  imagePrediction: Record<string, any> | null; // Updated the type
  selectedFileName: string | null;
}

class ImageUpload extends Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {
      imageFile: null,
      imagePrediction: null, // Updated to null
      selectedFileName: null,
    };
    this.uploadHandler = this.uploadHandler.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
  }

  handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files && event.target.files[0];
    const selectedFileName = file ? file.name : null;
    this.setState({ imageFile: file, selectedFileName });
  }

  uploadHandler() {
    const { imageFile } = this.state;

    if (!imageFile) {
      return;
    }

    const formData = new FormData();
    formData.append("file", imageFile);

    axios
      .post("http://127.0.0.1:5000/upload", formData)
      .then((response) => {
        const data = response.data;
        this.setState({ imagePrediction: data });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  renderPrediction() {
    const { imagePrediction } = this.state;

    if (!imagePrediction) {
      return null;
    }

    return (
      <div>
        <p className="text-lg">OCR Result:</p>
        <ul>
          {Object.keys(imagePrediction).map((key) => (
            <li key={key}>
              {key}: {imagePrediction[key]}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  render() {
    return (
      <div className="bg-gray-100 p-4 rounded-lg shadow-md">
        <p className="text-xl font-semibold mb-4">
          Upload an image for OCR processing
        </p>

        <div className="mb-4">
          <input
            type="file"
            name="file"
            onChange={this.handleFileChange}
            className="hidden"
          />
          <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
            {this.state.selectedFileName
              ? `Selected File: ${this.state.selectedFileName}`
              : "Choose Image"}
            <input
              type="file"
              name="file"
              onChange={this.handleFileChange}
              className="hidden"
            />
          </label>
        </div>
        <div>
          <button
            onClick={this.uploadHandler}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
          >
            Upload and Process
          </button>
        </div>

        <div className="mt-4">
          {this.renderPrediction()} {/* Render the prediction */}
        </div>
      </div>
    );
  }
}

export default ImageUpload;
