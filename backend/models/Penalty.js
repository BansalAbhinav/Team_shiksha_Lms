const mongoose = require("mongoose");

const penaltySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
  issueDate: { type: Date, required: true },
  dueDate: { type: Date, required: true },
  returnDate: { type: Date },
  damageType: { type: String, enum: ["none", "minor", "major"], default: "none" },
  penaltyAmount: { type: Number, default: 0 },
  status: { type: String, enum: ["unpaid", "paid"], default: "unpaid" },
});

module.exports = mongoose.model("Penalty", penaltySchema);
