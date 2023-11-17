import "./App.css";
import { AuthProvider } from "./context/authContext";
import AppRouter from "./utils/AppRouter";

function App() {
  return (
    <div>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </div>
  );
}

export default App;
