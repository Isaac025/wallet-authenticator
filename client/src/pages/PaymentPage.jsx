import React, { useState } from "react";
import { ethers } from "ethers";
import axios from "axios";
import useWallet from "../hooks/useWallet";

export default function PaymentPage({ setAuth }) {
  const { address, status, login, provider } = useWallet(setAuth, () => {});
  const [txHash, setTxHash] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const RECEIVER = "0xE877a43E0a158239dc135bE2601f0f2be46D35cF";

  async function sendPayment(signer) {
    const tx = await signer.sendTransaction({
      to: RECEIVER, // receiver address
      value: ethers.parseEther("0.001"),
    });
    setPaymentStatus("Waiting for confirmation...");
    await tx.wait();
    return tx.hash;
  }

  async function switchToSepolia() {
    if (!window.ethereum) {
      throw new Error("MetaMask is not installed");
    }

    try {
      // Try switching to Sepolia
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0xaa36a7" }], // Sepolia chain ID in hex
      });
    } catch (switchError) {
      // If Sepolia hasn't been added to MetaMask yet
      if (switchError.code === 4902) {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: "0xaa36a7",
              chainName: "Sepolia Test Network",
              nativeCurrency: {
                name: "SepoliaETH",
                symbol: "ETH",
                decimals: 18,
              },
              rpcUrls: ["https://rpc.sepolia.org"],
              blockExplorerUrls: ["https://sepolia.etherscan.io"],
            },
          ],
        });
      } else {
        throw switchError;
      }
    }
  }

  async function handlePayment() {
    try {
      setLoading(true);
      setPaymentStatus("Preparing payment...");

      if (!window.ethereum) {
        throw new Error("MetaMask is not installed");
      }

      let activeProvider = new ethers.BrowserProvider(window.ethereum);

      let network = await activeProvider.getNetwork();

      if (Number(network.chainId) !== 11155111) {
        setPaymentStatus("Switching to Sepolia...");

        await switchToSepolia();

        // Recreate provider after switching
        activeProvider = new ethers.BrowserProvider(window.ethereum);
        network = await activeProvider.getNetwork();

        if (Number(network.chainId) !== 11155111) {
          throw new Error("Failed to switch to Sepolia");
        }

        setPaymentStatus("Connected to Sepolia");
      }

      setPaymentStatus("Sending payment...");

      const signer = await activeProvider.getSigner();
      const hash = await sendPayment(signer);

      setTxHash(hash);

      setPaymentStatus("Verifying payment...");

      const res = await axios.post(
        "https://wallet-authenticator.onrender.com/payment/verify-payment",
        {
          txHash: hash,
          expectedAmount: "0.001",
          receiver: RECEIVER,
        },
      );

      setPaymentStatus(res.data.message || "Payment verified!");
    } catch (err) {
      console.error("Payment verification error:", err);
      console.error("Server response:", err.response?.data);

      setPaymentStatus(
        err.response?.data?.error ||
          err.response?.data?.message ||
          err.message ||
          "Payment failed",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-blue-600">
          Ethereum Payment
        </h1>

        {!address ? (
          <button
            onClick={login}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Connect Wallet
          </button>
        ) : (
          <button
            onClick={handlePayment}
            disabled={loading || !provider}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
          >
            {loading ? "Processing..." : "Send 0.001 ETH"}
          </button>
        )}

        {address && (
          <p className="mt-4 text-sm text-gray-600 break-all">
            Connected: {address}
          </p>
        )}

        {txHash && (
          <p className="mt-4 text-sm text-gray-700 break-all">
            Transaction Hash: {txHash}
          </p>
        )}

        {paymentStatus && (
          <p className="mt-4 text-center text-gray-800 font-medium">
            {paymentStatus}
          </p>
        )}

        {status && <p className="mt-2 text-sm text-gray-500">{status}</p>}
      </div>
    </div>
  );
}
