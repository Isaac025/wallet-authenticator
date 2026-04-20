import React, { useState } from "react";
import { ethers } from "ethers";
import axios from "axios";

export default function WalletLogin() {
  const [status, setStatus] = useState("");
  const [address, setAddress] = useState("");

  async function loginWithWallet() {
    try {
      setStatus("Connecting wallet...");

      // 1. Connect wallet
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const address = accounts[0];
      setAddress(address);

      // 2. Get nonce from backend
      setStatus("Fetching nonce...");
      const { data } = await axios.post(
        "https://wallet-authenticator.onrender.com/auth/nonce",
        {
          address,
        },
      );
      const nonce = data.nonce;

      // 3. Sign message
      setStatus("Signing message...");
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const message = `Login nonce: ${nonce}`;
      const signature = await signer.signMessage(message);

      // 4. Send signature to backend
      setStatus("Verifying signature...");
      const res = await axios.post(
        "https://wallet-authenticator.onrender.com/auth/verify",
        {
          address,
          signature,
        },
      );

      if (res.data.success) {
        setStatus("Login successful!");
      } else {
        setStatus("Login failed.");
      }
    } catch (err) {
      console.error(err);
      setStatus("Error during login.");
    }
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-96 text-center">
        <h1 className="text-2xl font-bold mb-4">Wallet Authentication</h1>
        <p className="text-gray-600 mb-6">
          Connect your wallet to log in securely.
        </p>
        <button
          onClick={loginWithWallet}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
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
