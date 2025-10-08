import { Schema, model } from "mongoose";

const penaltySchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  bookId: { type: Schema.Types.ObjectId, ref: "Book", required: true },
  issueDate: { type: Date, required: true },
  dueDate: { type: Date, required: true },
  returnDate: { type: Date },
  damageType: { type: String, enum: ["none", "minor", "major"], default: "none" },
  penaltyAmount: { type: Number, default: 0 },
  status: { type: String, enum: ["unpaid", "paid"], default: "unpaid" },
});

export default model("Penalty", penaltySchema);
