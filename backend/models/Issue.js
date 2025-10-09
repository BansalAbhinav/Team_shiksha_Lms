import { Schema, model } from 'mongoose';

const issueSchema = new Schema({
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: "User", 
    required: [true, 'User ID is required'] 
  },
  bookId: { 
    type: Schema.Types.ObjectId, 
    ref: "Book", 
    required: [true, 'Book ID is required'] 
  },
  issueType: { 
    type: String, 
    enum: ["individual", "group"], 
    required: [true, 'Issue type is required'] 
  },
  issueDate: { type: Date, default: Date.now },
  dueDate: { type: Date, required: [true, 'Due date is required'] },
  returnDate: { type: Date },
  returned: { type: Boolean, default: false },

  // New fields for fines and damage
  fine: { type: Number, default: 0 },          // Total fine for this issue
  lateDays: { type: Number, default: 0 },      // Number of days late
  damageType: { 
    type: String, 
    enum: ['none', 'small', 'large'], 
    default: 'none' 
  }
}, { timestamps: true });

// Virtual to check if the book is overdue
issueSchema.virtual('isOverdue').get(function() {
  if (this.returned) return false;
  return new Date() > this.dueDate;
});

// Virtual to check if the book is considered missing
issueSchema.virtual('isMissing').get(function() {
  return !this.returned && new Date() > this.dueDate;
});

// Ensure virtuals are included in JSON and object outputs
issueSchema.set('toJSON', { virtuals: true });
issueSchema.set('toObject', { virtuals: true });

// Indexes for faster queries
issueSchema.index({ userId: 1, returned: 1 });
issueSchema.index({ bookId: 1, returned: 1 });
issueSchema.index({ dueDate: 1, returned: 1 });

export default model("Issue", issueSchema);
