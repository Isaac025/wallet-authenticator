import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import axios from "axios";
import useWallet from "../hooks/useWallet";

export default function PaymentPage({ setAuth }) {
  const { address, status, login, provider } = useWallet(setAuth, () => {});
  const [receiver, setReceiver] = useState("");
  const [amount, setAmount] = useState("0.01");
  const [txHash, setTxHash] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("txHistory");
    if (saved) {
      setTransactions(JSON.parse(saved));
    }
  }, []);

  function saveTransaction(tx) {
    const updated = [tx, ...transactions];
    setTransactions(updated);
    localStorage.setItem("txHistory", JSON.stringify(updated));
  }

  async function sendPayment(signer) {
    if (!ethers.isAddress(receiver)) {
      throw new Error("Please enter a valid Ethereum Address");
    }

    const tx = await signer.sendTransaction({
      to: receiver, // receiver address
      value: ethers.parseEther(amount),
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
          expectedAmount: amount,
          receiver,
        },
      );

      const newTx = {
        hash,
        receiver,
        amount,
        date: new Date().toLocaleString(),
      };

      saveTransaction(newTx);

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
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="bg-white shadow-xl rounded-2xl p-6 md:p-8">
          <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">
            Send Sepolia ETH
          </h2>

          {!address ? (
            <button
              onClick={login}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Connect Wallet
            </button>
          ) : (
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Recipient wallet address"
                value={receiver}
                onChange={(e) => setReceiver(e.target.value)}
                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="number"
                step="0.0001"
                min="0"
                placeholder="Amount in ETH"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                onClick={handlePayment}
                disabled={loading || !provider || !receiver || !amount}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? "Processing..." : `Send ${amount} ETH`}
              </button>
            </div>
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
            <p className="mt-4 text-center font-medium text-gray-800">
              {paymentStatus}
            </p>
          )}

          {status && <p className="mt-2 text-sm text-gray-500">{status}</p>}
        </div>

        {transactions.length > 0 && (
          <div className="bg-white shadow-xl rounded-2xl p-6 overflow-hidden">
            <h3 className="text-xl font-bold mb-4 text-gray-800">
              Transaction History
            </h3>

            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left px-4 py-3">Amount</th>
                    <th className="text-left px-4 py-3">Recipient</th>
                    <th className="text-left px-4 py-3">Date</th>
                    <th className="text-left px-4 py-3">Hash</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap">
                        {tx.amount} ETH
                      </td>
                      <td className="px-4 py-3 font-mono text-xs md:text-sm">
                        {tx.receiver.slice(0, 8)}...{tx.receiver.slice(-6)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">{tx.date}</td>
                      <td className="px-4 py-3 font-mono text-xs">
                        <a
                          href={`https://sepolia.etherscan.io/tx/${tx.hash}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {tx.hash.slice(0, 10)}...
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
