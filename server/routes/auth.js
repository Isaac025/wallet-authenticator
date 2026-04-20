const express = require("express");
const { ethers } = require("ethers");
const USER = require("../models/user");

const router = express.Router();

// Get nonce
router.post("/nonce", async (req, res) => {
  try {
    const { address } = req.body;
    let user = await USER.findOne({ address });

    if (!user) {
      user = await USER.create({
        address,
        nonce: Math.random().toString(36).substring(2),
      });
    }

    res.status(200).json({ success: true, nonce: user.nonce });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// verify signature
router.post("/verify", async (req, res) => {
  try {
    const { address, signature } = req.body;

    const user = await USER.findOne({ address });

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    const message = `Login nonce: ${user.nonce}`;

    const recoveredAddress = ethers.verifyMessage(message, signature);

    if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid Signature" });
    }

    //Update nonce (Important0)
    user.nonce = Math.random().toString(36).substring(2);
    await user.save();
    res.status(200).json({ success: true, message: "verified successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.messgae });
  }
});

module.exports = router;
