import React from "react";
import { useNavigate } from "react-router-dom";
import useWallet from "../hooks/useWallet";

export default function WalletLogin({ setAuth }) {
  const navigate = useNavigate();

  const { address, status, login } = useWallet(setAuth, navigate);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-96 text-center">
        <h1 className="text-2xl font-bold mb-4">Wallet Authentication</h1>

        <button
          onClick={login}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Connect Wallet
        </button>

        {address && (
          <p className="mt-4 text-sm text-gray-500">Address: {address}</p>
        )}

        {status && (
          <p className="mt-2 text-sm font-medium text-gray-700">{status}</p>
        )}
      </div>
    </div>
  );
}
