import { Schema, model } from 'mongoose';

const bookSchema = new Schema({
  title: { type: String, required: true, trim: true },
  author: { type: String, required: true, trim: true },
  category: { 
    type: String, 
    enum: ["Data Structures", "Operating Systems", "Artificial Intelligence"], 
    required: true 
  },
  totalQuantity: { type: Number, default: 3, min: 0 },
  availableQuantity: { type: Number, default: 3, min: 0 },
  cost: { type: Number, required: true, min: 0 },
  pdfLink: { type: String, trim: true }
}, { timestamps: true });

bookSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.createdAt = ret.createdAt ? new Date(ret.createdAt).toLocaleString() : null;
    ret.updatedAt = ret.updatedAt ? new Date(ret.updatedAt).toLocaleString() : null;
    return ret;
  }
});

// Index for faster queries
bookSchema.index({ title: 1, author: 1 });
bookSchema.index({ category: 1 });

export default model("Book", bookSchema);
