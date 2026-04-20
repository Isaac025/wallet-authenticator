import { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WalletLogin from "./pages/WalletLogin";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const [isAuth, setAuth] = useState(false);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<WalletLogin setAuth={setAuth} />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute isAuth={isAuth}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
