const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  address: { type: String, unique: true }, // user's wallet address
  nonce: String, // random challenge string for authentication
});

const USER = mongoose.model("user", userSchema);

module.exports = USER;
