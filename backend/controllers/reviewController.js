import Review from "../models/Review.js";
import Book from "../models/Book.js";
import User from "../models/User.js";

export async function addReview(req, res) {
  try {
    const userId =
      req.user?._id?.toString() || req.body.userId || req.body.user;
    const bookId = req.body.bookId;
    const { title, description, image, rating } = req.body;

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const newReview = new Review({
      bookId: bookId,
      userId: userId,
      title,
      description,
      image: image || "",
      rating,
    });

    await newReview.save();

    return res.status(201).json({
      success: true,
      message: "Review added successfully",
      review: newReview,
    });
  } catch (error) {
    console.error("Error adding review:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}


