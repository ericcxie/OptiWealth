import React from "react";
import "./App.css";
import Landing from "./pages/landing";
import ImageUpload from "./components/imageUpload";
import AppRouter from "./utils/AppRouter";

function App() {
  return (
    <div>
      {/* <Landing /> */}
      {/* <ImageUpload /> */}
      <AppRouter />
    </div>
  );
}

export default App;
