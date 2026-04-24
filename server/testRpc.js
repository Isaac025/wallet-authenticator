require("dotenv").config();
const { ethers } = require("ethers");

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

async function testConnection() {
  try {
    const blockNumber = await provider.getBlockNumber();
    console.log("Connected ✅ Current block:", blockNumber);
  } catch (err) {
    console.error("Connection failed ❌", err);
  }
}

testConnection();
