const express = require("express");
const { ethers } = require("ethers");

const router = express.Router();

//RPC Provider (alchemy / infura)
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL); // Connects to an Ethereum node via RPC (Remote Procedure Call).

router.post("/verify-payment", async (req, res) => {
  try {
    const { txHash, expectedAmount, receiver } = req.body;

    //get Transaction
    const tx = await provider.getTransaction(txHash);

    if (!tx) {
      return res
        .status(400)
        .json({ success: false, error: "Transaction not found" });
    }

    //check receiver
    if (tx.to.toLowerCase() !== receiver.toLowerCase()) {
      return res.status(400).json({ success: false, error: "Wrong recipent" });
    }

    //check amount
    const amount = ethers.formatEther(tx.value); // tx.value is the amount of ether sent (in wei, smallest ether unit)
    //format ether converts wei -> ether (human-readable)
    if (parseFloat(amount) < parseFloat(expectedAmount)) {
      return res
        .status(400)
        .json({ success: false, error: "insufficient payment" });
    }

    //check confirmation
    const receipt = await provider.getTransactionReceipt(txHash);
    if (!receipt || receipt.status !== 1) {
      return res
        .status(400)
        .json({ success: false, error: "Transaction failed" });
    }

    return res.status(200).json({ success: true, message: "Payment Verified" });
  } catch (error) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
