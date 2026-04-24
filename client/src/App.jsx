import { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WalletLogin from "./pages/WalletLogin";
import Dashboard from "./pages/Dashboard";
import PaymentPage from "./pages/PaymentPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const [isAuth, setAuth] = useState(localStorage.getItem("auth") === "true");

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
        <Route
          path="/payment"
          element={
            <ProtectedRoute isAuth={isAuth}>
              <PaymentPage setAuth={setAuth} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
