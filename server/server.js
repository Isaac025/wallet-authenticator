require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const PORT = process.env.PORT || 3000;
const authRouter = require("./routes/auth");

const app = express();

//middleware
app.use(express.json());
app.use(cors());
app.use("/auth", authRouter);

//routes
app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "wallet-connector API" });
});

//error route
app.use((req, res) => {
  res.status(400).json({ success: false, message: "Route not Found" });
});

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "wallet-connect",
    });
    console.log("Database Connected");

    app.listen(PORT, () => {
      console.log(`App Running on port : ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();
