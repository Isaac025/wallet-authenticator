import { useState } from "react";
import { ethers } from "ethers";
import axios from "axios";
import EthereumProvider from "@walletconnect/ethereum-provider";

export default function useWallet(setAuth, navigate) {
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState("");
  const [provider, setProvider] = useState(null);

  // 🔌 Connect wallet (MetaMask or WalletConnect)
  async function connectWallet() {
    try {
      setStatus("Connecting wallet...");

      let ethProvider;

      if (window.ethereum) {
        // ✅ MetaMask / injected provider
        await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        ethProvider = new ethers.BrowserProvider(window.ethereum);
      } else {
        // ✅ WalletConnect (mobile)
        const wcProvider = await EthereumProvider.init({
          projectId: import.meta.env.VITE_WALLETCONNECT_ID,
          chains: [11155111],
          optionalChains: [1, 11155111],
          methods: ["personal_sign", "eth_sendTransaction"],
          showQrModal: true,
        });

        await wcProvider.connect();
        ethProvider = new ethers.BrowserProvider(wcProvider);
      }

      const signer = await ethProvider.getSigner();
      const addr = await signer.getAddress();

      setAddress(addr);
      setProvider(ethProvider);

      return { ethProvider, signer, address: addr };
    } catch (err) {
      console.error(err);
      setStatus("Wallet connection failed");
      throw err;
    }
  }

  // 🔐 Login flow (nonce → sign → verify)
  async function login() {
    try {
      const { signer, address } = await connectWallet();

      // 1. Get nonce
      setStatus("Fetching nonce...");
      const { data } = await axios.post(
        "https://wallet-authenticator.onrender.com/auth/nonce",
        { address },
      );

      const nonce = data.nonce;

      // 2. Sign message
      setStatus("Signing message...");
      const message = `Login nonce: ${nonce}`;
      const signature = await signer.signMessage(message);

      // 3. Verify
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
        setStatus("Login failed");
      }
    } catch (err) {
      console.error(err);
      setStatus(err.response?.data?.error || err.message);
    }
  }

  // 🔌 Disconnect (mainly for WalletConnect)
  async function disconnect() {
    try {
      if (provider?.provider?.disconnect) {
        await provider.provider.disconnect();
      }

      setAddress("");
      setProvider(null);
      setAuth(false);
      localStorage.removeItem("auth");
      setStatus("Disconnected");
    } catch (err) {
      console.error(err);
    }
  }

  return {
    address,
    status,
    login,
    disconnect,
  };
}
