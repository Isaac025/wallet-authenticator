import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import axios from "axios";
import EthereumProvider from "@walletconnect/ethereum-provider";

export default function WalletLogin({ setAuth }) {
  const [status, setStatus] = useState("");
  const [address, setAddress] = useState("");

  const navigate = useNavigate();

  async function loginWithWallet() {
    let provider;

    try {
      setStatus("Connecting wallet...");

      // ✅ 1. Detect provider
      if (window.ethereum) {
        // Desktop or MetaMask mobile browser
        provider = new ethers.BrowserProvider(window.ethereum);

        await window.ethereum.request({
          method: "eth_requestAccounts",
        });
      } else {
        // ✅ Mobile fallback (WalletConnect)
        setStatus("Opening wallet...");

        const wcProvider = await EthereumProvider.init({
          projectId: import.meta.env.VITE_WALLETCONNECT_ID,
          chains: [11155111], // Ethereum 11155111 for testnet
          showQrModal: true,
        });

        await wcProvider.connect();

        provider = new ethers.BrowserProvider(wcProvider);
      }

      // ✅ 2. Get signer + address
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setAddress(address);

      // ✅ 3. Get nonce
      setStatus("Fetching nonce...");
      const { data } = await axios.post(
        "https://wallet-authenticator.onrender.com/auth/nonce",
        { address },
      );

      const nonce = data.nonce;

      // ✅ 4. Sign message
      setStatus("Signing message...");
      const message = `Login nonce: ${nonce}`;
      const signature = await signer.signMessage(message);

      // ✅ 5. Verify
      setStatus("Verifying signature...");
      const res = await axios.post(
        "https://wallet-authenticator.onrender.com/auth/verify",
        { address, signature },
      );

      if (res.data.success) {
        setStatus("Login successful!");
        localStorage.setItem("auth", "true");
        setAuth(true);
        navigate("/dashboard");
      } else {
        setStatus("Login failed.");
      }
    } catch (err) {
      console.error(err);
      setStatus(err.response?.data?.error || err.message);
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
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition cursor-pointer"
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
