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

export async function getReviewsByBookId(req, res) {
  try {
    const { bookId } = req.params;

    const reviews = await Review.find({ bookId })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export async function getReviewsByUser(req, res) {
  try {
    const userId =
      req.user?._id?.toString() || req.params.userId || req.query.userId;

    const reviews = await Review.find({ userId })
      .populate("bookId", "title author")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export async function getReviewById(req, res) {
  try {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId)
      .populate("userId", "name email")
      .populate("bookId", "title author");
    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    res.json(review);
  } catch (error) {
    console.error("Error fetching review:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}


export async function updateReview(req, res) {
    try {
        const { title, description, image, rating } = req.body;

        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        const updateReview = await Review.findByIdAndUpdate(
            req.params.id,
            { title, description, image, rating },
            { new: true , runValidators: true}
        );

        res.json({
            message: "Review updated successfully",
            review: updateReview,
        })
    } catch (error) {
        console.error("Error updating review:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}



export async function deleteReview(req, res) {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found" });

    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ 
      message: "Error deleting review", 
      error: error.message 
    });
  }
}


export async function getBookAverageRating(req, res) {
  try {
    const { bookId } = req.params;
    
    const reviews = await Review.find({ bookId });
    
    if (reviews.length === 0) {
      return res.json({ 
        averageRating: 0, 
        totalReviews: 0 
      });
    }
    
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = (totalRating / reviews.length).toFixed(1);
    
    res.json({ 
      averageRating: parseFloat(averageRating), 
      totalReviews: reviews.length 
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Error calculating average rating", 
      error: error.message 
    });
  }
}