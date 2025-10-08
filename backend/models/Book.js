import { Schema, model } from "mongoose";

const bookSchema = new Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  category: { type: String, enum: ["Fiction", "Non-Fiction", "Academic"], required: true },
  cost: { type: Number, required: true },
  totalQuantity: { type: Number, default: 3 },
  availableQuantity: { type: Number, default: 3 },
  pdfLink: { type: String },
});

export default model("Book", bookSchema);
