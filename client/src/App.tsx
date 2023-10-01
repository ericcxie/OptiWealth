import React from "react";
import "./App.css";
import Landing from "./pages/landing";
import ImageUpload from "./components/imageUpload";
import AppRouter from "./utils/AppRouter";
import { AuthProvider } from "./context/authContext";

function App() {
  return (
    <div>
      {/* <Landing /> */}
      {/* <ImageUpload /> */}
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </div>
  );
}

export default App;
