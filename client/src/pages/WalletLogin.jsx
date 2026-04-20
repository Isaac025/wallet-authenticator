import React from "react";
import { useNavigate } from "react-router-dom";
import useWallet from "../hooks/useWallet";

export default function WalletLogin({ setAuth }) {
  const navigate = useNavigate();
  const { address, status, login } = useWallet(setAuth, navigate);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* 🔝 NAVBAR */}
      <nav className="flex justify-between items-center px-6 py-4 bg-white shadow-sm">
        <h1 className="text-xl font-bold text-blue-600">Web3Auth</h1>
        <div className="space-x-6 text-sm text-gray-600">
          <span className="cursor-pointer hover:text-blue-600">Home</span>
          <span className="cursor-pointer hover:text-blue-600">About</span>
          <span className="cursor-pointer hover:text-blue-600">Docs</span>
        </div>
      </nav>

      {/* 🧠 HERO SECTION */}
      <div className="flex flex-col items-center justify-center flex-1 text-center px-4">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          Passwordless Authentication
        </h2>
        <p className="text-gray-600 max-w-xl mb-8">
          Connect your wallet and sign a message to log in securely. No
          passwords. No emails. Just pure Web3 identity.
        </p>

        {/* 🔥 CONNECT BUTTON */}
        <button
          onClick={login}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium cursor-pointer 
                     hover:bg-blue-700 transition transform hover:scale-105 
                     active:scale-95 animate-pulse"
        >
          Connect Wallet
        </button>

        {/* 📍 ADDRESS */}
        {address && (
          <p className="mt-6 text-sm text-gray-500 break-all">
            Connected: {address}
          </p>
        )}

        {/* 📢 STATUS */}
        {status && (
          <p className="mt-2 text-sm font-medium text-gray-700">{status}</p>
        )}
      </div>

      {/* 🧩 FEATURES SECTION */}
      <div className="grid md:grid-cols-3 gap-6 px-8 py-12 bg-white">
        <div className="p-6 rounded-lg shadow-sm">
          <h3 className="font-semibold text-lg mb-2">🔐 Secure</h3>
          <p className="text-sm text-gray-600">
            Uses cryptographic signatures instead of passwords.
          </p>
        </div>

        <div className="p-6 rounded-lg shadow-sm">
          <h3 className="font-semibold text-lg mb-2">⚡ Fast</h3>
          <p className="text-sm text-gray-600">
            Instant login with just one wallet signature.
          </p>
        </div>

        <div className="p-6 rounded-lg shadow-sm">
          <h3 className="font-semibold text-lg mb-2">🌍 Universal</h3>
          <p className="text-sm text-gray-600">
            Works across desktop and mobile wallets.
          </p>
        </div>
      </div>

      {/* 📚 HOW IT WORKS */}
      <div className="px-8 py-12 text-center">
        <h3 className="text-2xl font-bold mb-6">How it works</h3>
        <div className="max-w-2xl mx-auto text-gray-600 space-y-3">
          <p>1. Connect your wallet</p>
          <p>2. Receive a unique nonce from the backend</p>
          <p>3. Sign the message securely</p>
          <p>4. Get authenticated instantly</p>
        </div>
      </div>

      {/* 🔻 FOOTER */}
      <footer className="bg-gray-900 text-gray-300 text-sm py-6 text-center">
        <p>Built with React, Node.js & Web3 ⚡</p>
        <p className="mt-1">© 2026 Web3Auth. All rights reserved.</p>
      </footer>
    </div>
  );
}
