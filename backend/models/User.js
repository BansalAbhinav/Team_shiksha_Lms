const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "user"], default: "user" },
});

// Method to compare password
userSchema.methods.comparePassword = async function(password) {
    return bcrypt.compare(password, this.password);
}

module.exports = mongoose.model("User", userSchema);
