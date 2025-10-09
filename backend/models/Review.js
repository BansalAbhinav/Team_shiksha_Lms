import { Schema, model } from "mongoose";

const reviewSchema = new Schema({
  bookId: { type: Schema.Types.ObjectId, ref: "Book", required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  image: { type: String },
  description: { type: String },
  rating: { type: Number, min: 1, max: 5, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default model("Review", reviewSchema);
