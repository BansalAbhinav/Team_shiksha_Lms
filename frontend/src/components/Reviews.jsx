import React, { useState } from "react";
import {
  Star,
  ThumbsUp,
  MessageSquare,
  User,
  TrendingUp,
  Edit3,
} from "lucide-react";

function Reviews() {
  const [activeTab, setActiveTab] = useState("reviews");
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [sortBy, setSortBy] = useState("recent");

  // Sample reviews data
  const reviews = [
    {
      id: 1,
      user: "Rahul Kumar",
      rating: 5,
      date: "2 days ago",
      comment:
        "Excellent book for understanding data structures. The examples are clear and well-explained. Highly recommended for beginners!",
      helpful: 24,
      avatar: "RK",
    },
    {
      id: 2,
      user: "Priya Sharma",
      rating: 4,
      date: "1 week ago",
      comment:
        "Great content but could use more practical examples. Overall a solid resource for learning.",
      helpful: 15,
      avatar: "PS",
    },
    {
      id: 3,
      user: "Amit Patel",
      rating: 5,
      date: "2 weeks ago",
      comment:
        "One of the best books on data structures. Pat Morin explains concepts in a very intuitive way.",
      helpful: 31,
      avatar: "AP",
    },
  ];

  const stats = {
    averageRating: 4.6,
    totalReviews: 127,
    ratings: {
      5: 89,
      4: 28,
      3: 7,
      2: 2,
      1: 1,
    },
  };

  const handleSubmitReview = () => {
    if (userRating && reviewText.trim()) {
      console.log("Rating:", userRating, "Review:", reviewText);
      setUserRating(0);
      setReviewText("");
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
                  <span>Reviews</span>
                </div>
              </button>
            </div>
          </div>

          {/* Rating 5 stars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
            <div className="flex flex-col items-center justify-center">
              <div className="text-5xl font-bold text-gray-800">
                {stats.averageRating}
              </div>
              <StarRating rating={stats.averageRating} size={24} />
              <div className="text-sm text-gray-600 mt-2">
                {stats.totalReviews} reviews
              </div>
            </div>

            <div className="col-span-2 space-y-2">
              {Object.entries(stats.ratings)
                .reverse()
                .map(([rating, count]) => {
                  const percentage = (count / stats.totalReviews) * 100;
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
                      Minimum 50 characters. Be specific and honest to help
                      other students.
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleSubmitReview}
                      disabled={!userRating || reviewText.trim().length < 50}
                      className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                      Submit Review
                    </button>
                    <button
                      onClick={() => {
                        setShowWriteReview(false);
                        setUserRating(0);
                        setReviewText("");
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

          {/* Sort Options */}
          <div className="flex items-center justify-between mt-4 mb-4">
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

          {/* Reviews List */}
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="p-5 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                    {review.avatar}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-800">
                          {review.user}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <StarRating rating={review.rating} size={16} />
                          <span className="text-sm text-gray-500">
                            {review.date}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-700 leading-relaxed mb-3">
                      {review.comment}
                    </p>

                    <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors">
                      <ThumbsUp size={16} />
                      <span>Helpful ({review.helpful})</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reviews;
