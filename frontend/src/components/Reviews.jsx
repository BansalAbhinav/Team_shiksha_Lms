import React, { useEffect, useState } from "react";
import {
  Star,
  ThumbsUp,
  MessageSquare,
  User,
  TrendingUp,
  Edit3,
  MoreVertical,
  Trash2,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { reviewAPI } from "../apis/ReviewApi.js";
import { toast } from "react-toastify";

function Reviews({ bookId }) {
  const { isAuthenticated, user } = useAuth();
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviewTitle, setReviewTitle] = useState("");
  const [sortBy, setSortBy] = useState("recent");

  const [reviews, setReviews] = useState([]);

  // Sample reviews data
  // const reviews = [
  //   {
  //     id: 1,
  //     user: "Rahul Kumar",
  //     rating: 5,
  //     date: "2 days ago",
  //     comment:
  //       "Excellent book for understanding data structures. The examples are clear and well-explained. Highly recommended for beginners!",
  //     helpful: 24,
  //     avatar: "RK",
  //   },
  //   {
  //     id: 2,
  //     user: "Priya Sharma",
  //     rating: 4,
  //     date: "1 week ago",
  //     comment:
  //       "Great content but could use more practical examples. Overall a solid resource for learning.",
  //     helpful: 15,
  //     avatar: "PS",
  //   },
  //   {
  //     id: 3,
  //     user: "Amit Patel",
  //     rating: 5,
  //     date: "2 weeks ago",
  //     comment:
  //       "One of the best books on data structures. Pat Morin explains concepts in a very intuitive way.",
  //     helpful: 31,
  //     avatar: "AP",
  //   },
  // ];

  const [submitting, setSubmitting] = useState(false);

  const [editingReview, setEditingReview] = useState(null);
  const [editRating, setEditRating] = useState(0);
  const [editText, setEditText] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [showDropdown, setShowDropdown] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEditClick = (review) => {
    setEditingReview(review);
    setEditRating(review.rating);
    setEditText(review.description);
    setEditTitle(review.title);
    setShowDropdown(null);
  };

  useEffect(() => {
    if (bookId) {
      fetchReviews();
      fetchAverageRating();
    }
  }, [bookId]);

  const fetchReviews = async () => {
    try {
      const data = await reviewAPI.getReviewsByBookId(bookId);
      setReviews(data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast.error("Failed to load reviews. Please try again later.");
    }
  };

  const fetchAverageRating = async () => {
    try {
      const data = await reviewAPI.getAverageRating(bookId);
      setStars((prev) => ({
        ...prev,
        averageRating: data.averageRating,
        totalReviews: data.totalReviews,
      }));
    } catch (error) {
      console.error("Error fetching average rating:", error);
    }
  };

  const [stars, setStars] = useState({
    averageRating: 0,
    totalReviews: 0,
    ratings: {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    },
  });

  const handleUpdateReview = async () => {
    if (!editRating || editText.trim().length < 10 || !editTitle.trim()) {
      toast.error(
        "Please fill all required fields (minimum 10 characters for review)"
      );
      return;
    }

    try {
      setSubmitting(true);

      await reviewAPI.updateReview(editingReview._id, {
        title: editTitle,
        description: editText,
        rating: editRating,
      });

      toast.success("Review updated successfully!");

      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review._id === editingReview._id
            ? {
                ...review,
                title: editTitle,
                description: editText,
                rating: editRating,
                updatedAt: new Date().toISOString(),
              }
            : review
        )
      );

      setEditingReview(null);
      setEditRating(0);
      setEditText("");
      setEditTitle("");

      fetchAverageRating();
    } catch (error) {
      console.error("Error updating review:", error);
      toast.error(error.response?.data?.message || "Failed to update review");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      setIsDeleting(true);

      await reviewAPI.deleteReview(reviewId);

      toast.success("Review deleted successfully!");

      setReviews((prevReviews) =>
        prevReviews.filter((review) => review._id !== reviewId)
      );

      setShowDeleteConfirm(null);
      setShowDropdown(null);

      fetchAverageRating();
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error(error.response?.data?.message || "Failed to delete review");
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = () => setShowDropdown(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleSubmitReview = async () => {
    if (!isAuthenticated) {
      toast.error("You must be logged in to submit a review.");
      return;
    }

    if (!userRating || reviewText.trim().length < 10 || !reviewTitle.trim()) {
      toast.error(
        "Please fill all required fields (minimum 10 characters for review)"
      );
      return;
    }

    // const userId = user._id || user.id;
    // console.log("User ID:", userId); // ✅ Debug log
    // console.log("User object:", user); // ✅ Debug log

    try {
      if (!user) {
        toast.error("User information not found. Please login again.");
        return;
      }

      setSubmitting(true);
      await reviewAPI.addReview({
        bookId: bookId,
        userId: user._id || user.id,
        title: reviewTitle,
        description: reviewText,
        rating: userRating,
      });

      toast.success("Review submitted successfully!");

      setUserRating(0);
      setReviewText("");
      setReviewTitle("");
      setShowWriteReview(false);
      fetchReviews();
      fetchAverageRating();
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error(error.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
      setShowWriteReview(false);
    }
  };

  const StarRating = ({ rating, size = 20, interactive = false, onRate }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={size}
            className={`cursor-${
              interactive ? "pointer" : "default"
            } transition-colors ${
              star <= (interactive ? hoverRating || rating : rating)
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
            onClick={() => interactive && onRate && onRate(star)}
            onMouseEnter={() => interactive && setHoverRating(star)}
            onMouseLeave={() => interactive && setHoverRating(0)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 ">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 p-6 mt-6">
          <div className="flex items-center justify-between mb-6 border-b border-gray-200">
            <div className="flex gap-6">
              <button
                className={`pb-3 px-2 text-sm font-medium border-b-2 transition-colors border-blue-600 text-blue-600`}
              >
                <div className="flex items-center gap-2">
                  <MessageSquare size={18} />
                  <span>Reviews ({stars.totalReviews})</span>
                </div>
              </button>
            </div>
          </div>

          {/* Rating 5 stars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
            <div className="flex flex-col items-center justify-center">
              <div className="text-5xl font-bold text-gray-800">
                {stars.averageRating || 0}
              </div>
              <StarRating rating={stars.averageRating} size={24} />
              <div className="text-sm text-gray-600 mt-2">
                {stars.totalReviews} reviews
              </div>
            </div>

            <div className="col-span-2 space-y-2">
              {Object.entries(stars.ratings)
                .reverse()
                .map(([rating, count]) => {
                  const percentage = (count / stars.totalReviews) * 100;
                  return (
                    <div key={rating} className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-700 w-8">
                        {rating}★
                      </span>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-yellow-400 transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 w-12">
                        {count}
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Write The review */}

          {isAuthenticated && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {!showWriteReview ? (
                <div className="text-center py-8">
                  <div className="mb-4">
                    <Edit3 size={48} className="mx-auto text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Share Your Experience
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Have you read this book? Help other students by sharing your
                    thoughts!
                  </p>
                  <button
                    onClick={() => setShowWriteReview(true)}
                    className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
                  >
                    <Edit3 size={20} />
                    Write a Review
                  </button>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-gray-800">
                      Write Your Review
                    </h3>
                    {/* <button
                    onClick={() => {
                      setShowWriteReview(false);
                      setUserRating(0);
                      setReviewText("");
                    }}
                    className="text-gray-500 hover:text-gray-700 text-sm"
                  >
                    Cancel
                  </button> */}
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Review Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={reviewTitle}
                        onChange={(e) => setReviewTitle(e.target.value)}
                        placeholder="Sum up your review in one line"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Your Rating <span className="text-red-500">*</span>
                      </label>
                      <div className="flex items-center gap-3">
                        <StarRating
                          rating={userRating}
                          size={36}
                          interactive={true}
                          onRate={setUserRating}
                        />
                        {userRating > 0 && (
                          <span className="text-sm text-gray-600 font-medium">
                            {userRating} out of 5 stars
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Review <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="Share details about your experience with this book. What did you like? How did it help you? Any suggestions for improvement?"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        rows="6"
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        Minimum 10 characters. Be specific and honest to help
                        other students.
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={handleSubmitReview}
                        disabled={
                          !userRating ||
                          reviewText.trim().length < 10 ||
                          !reviewTitle.trim() ||
                          submitting
                        }
                        className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                      >
                        {submitting ? "Submitting..." : "Submit Review"}
                      </button>
                      <button
                        onClick={() => {
                          setShowWriteReview(false);
                          setUserRating(0);
                          setReviewText("");
                          setReviewTitle("");
                        }}
                        className="px-8 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Sort Options */}
          {/* <div className="flex items-center justify-between mt-4 mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              User Reviews
            </h3>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="recent">Most Recent</option>
              <option value="helpful">Most Helpful</option>
              <option value="highest">Highest Rating</option>
              <option value="lowest">Lowest Rating</option>
            </select>
          </div> */}

          {/* Reviews List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4 mt-4">
              <h3 className="text-lg font-semibold text-gray-800">
                User Reviews
              </h3>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="recent">Most Recent</option>
                <option value="helpful">Most Helpful</option>
                <option value="highest">Highest Rating</option>
                <option value="lowest">Lowest Rating</option>
              </select>
            </div>

            {reviews.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <MessageSquare
                  size={48}
                  className="mx-auto mb-4 text-gray-300"
                />
                <p>No reviews yet. Be the first to review this book!</p>
              </div>
            ) : (
              reviews.map((review) => {
                const reviewUserId =
                  review.userId?._id?.toString() ||
                  review.userId?.id?.toString();
                const currentUserId =
                  user?._id?.toString() || user?.id?.toString();

                const isCurrentUserReview =
                  isAuthenticated && user && reviewUserId === currentUserId;

                // console.log("Is current user's review?", isCurrentUserReview);

                const displayName = isCurrentUserReview
                  ? "You"
                  : review.userId?.name || "Anonymous";

                const avatarInitial = isCurrentUserReview
                  ? user.name?.charAt(0) || "Y"
                  : review.userId?.name?.charAt(0) || "U";

                const isEdited =
                  review.updatedAt && review.updatedAt !== review.createdAt;
                const displayDate = isEdited
                  ? `Edited ${new Date(review.updatedAt).toLocaleDateString()}`
                  : new Date(review.createdAt).toLocaleDateString();

                return (
                  <div
                    key={review._id}
                    className="p-5 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-12 h-12 rounded-full ${
                          isCurrentUserReview
                            ? "bg-gradient-to-br from-green-500 to-emerald-600"
                            : "bg-gradient-to-br from-blue-500 to-indigo-600"
                        } flex items-center justify-center text-white font-semibold flex-shrink-0`}
                      >
                        {avatarInitial}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-gray-800">
                                {displayName}
                              </h4>
                              {isCurrentUserReview && (
                                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                                  Your Review
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <StarRating rating={review.rating} size={16} />
                              <span className="text-sm text-gray-500">
                                {new Date(
                                  review.createdAt
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          {isCurrentUserReview && (
                            <div className="relative">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShowDropdown(
                                    showDropdown === review._id
                                      ? null
                                      : review._id
                                  );
                                }}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                              >
                                <MoreVertical
                                  size={20}
                                  className="text-gray-600"
                                />
                              </button>

                              {/* ✅ Dropdown Menu */}
                              {showDropdown === review._id && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                                  <button
                                    onClick={() => handleEditClick(review)}
                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                  >
                                    <Edit3
                                      size={16}
                                      className="text-blue-600"
                                    />
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => {
                                      setShowDeleteConfirm(review._id);
                                      setShowDropdown(null);
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                  >
                                    <Trash2 size={16} />
                                    Delete 
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        <h5 className="font-medium text-gray-800 mb-2">
                          {review.title}
                        </h5>
                        <p className="text-gray-700 leading-relaxed mb-3">
                          {review.description}
                        </p>

                        <div className="flex items-center gap-3">
                          <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors">
                            <ThumbsUp size={16} />
                            <span>Helpful</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {showDeleteConfirm === review._id && (
                      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                              <Trash2 size={24} className="text-red-600" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-800">
                                Delete Review
                              </h3>
                              <p className="text-sm text-gray-600">
                                This action cannot be undone
                              </p>
                            </div>
                          </div>

                          <p className="text-gray-700 mb-6">
                            Are you sure you want to delete your review "
                            {review.title}"?
                          </p>

                          <div className="flex gap-3">
                            <button
                              onClick={() => handleDeleteReview(review._id)}
                              disabled={isDeleting}
                              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed transition-colors font-medium"
                            >
                              {isDeleting ? "Deleting..." : "Delete"}
                            </button>
                            <button
                              onClick={() => setShowDeleteConfirm(null)}
                              disabled={isDeleting}
                              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    )}      
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {editingReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full my-8">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800">
                Edit Your Review
              </h3>
              <button
                onClick={() => {
                  setEditingReview(null);
                  setEditRating(0);
                  setEditText("");
                  setEditTitle("");
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={24} className="text-gray-600" />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Review Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Sum up your review in one line"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Your Rating <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-3">
                  <StarRating
                    rating={editRating}
                    size={36}
                    interactive={true}
                    onRate={setEditRating}
                  />
                  {editRating > 0 && (
                    <span className="text-sm text-gray-600 font-medium">
                      {editRating} out of 5 stars
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Review <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  placeholder="Share details about your experience with this book..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows="6"
                />
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-gray-500">
                    Minimum 10 characters required
                  </p>
                  <p
                    className={`text-xs font-medium ${
                      editText.length >= 10 ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {editText.length}/50
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t border-gray-200">
              <button
                onClick={handleUpdateReview}
                disabled={
                  !editRating ||
                  editText.trim().length < 10 ||
                  !editTitle.trim() ||
                  submitting
                }
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Review"
                )}
              </button>
              <button
                onClick={() => {
                  setEditingReview(null);
                  setEditRating(0);
                  setEditText("");
                  setEditTitle("");
                }}
                disabled={submitting}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      
    </div>
  );
}

export default Reviews;
