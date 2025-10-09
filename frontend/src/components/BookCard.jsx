import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const BookCard = ({ book, onIssueBook }) => {
  const { isAuthenticated } = useAuth();

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Fiction':
        return 'bg-purple-100 text-purple-800';
      case 'Non-Fiction':
        return 'bg-blue-100 text-blue-800';
      case 'Academic':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAvailabilityColor = (available, total) => {
    if (available === 0) return 'text-red-600';
    if (available <= total * 0.2) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
      {/* Book Image Placeholder */}
      <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-xl flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 opacity-50"></div>
        <svg className="w-16 h-16 text-gray-400 z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
        {/* Category Badge */}
        <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${getCategoryColor(book.category)}`}>
          {book.category}
        </span>
      </div>

      <div className="p-6">
        {/* Title and Author */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 leading-tight">
            {book.title}
          </h3>
          <p className="text-gray-600 font-medium">by {book.author}</p>
        </div>
        
        {/* Price and Availability */}
        <div className="flex justify-between items-center mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-1">Price</p>
            <span className="text-2xl font-bold text-indigo-600">
              ₹{book.cost}
            </span>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-1">Available</p>
            <span className={`text-lg font-bold ${getAvailabilityColor(book.availableQuantity, book.totalQuantity)}`}>
              {book.availableQuantity} / {book.totalQuantity}
            </span>
          </div>
        </div>

        {/* PDF Link */}
        {book.pdfLink && (
          <div className="mb-4">
            <a
              href={book.pdfLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 hover:text-blue-700 transition-colors duration-200"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              View PDF
            </a>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2">
          <Link
            to={`/books/${book._id || book.id}`}
            className="w-full inline-flex items-center justify-center px-4 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors duration-200 shadow-sm"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            View Details
          </Link>
          
          {isAuthenticated && book.availableQuantity > 0 && (
            <button
              onClick={() => onIssueBook(book)}
              className="w-full inline-flex items-center justify-center px-4 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors duration-200 shadow-sm"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Issue Book
            </button>
          )}

          {!isAuthenticated && (
            <div className="w-full px-4 py-3 bg-gray-100 text-gray-600 font-medium rounded-lg text-center">
              Login to Issue Books
            </div>
          )}
        </div>

        {/* Out of Stock Badge */}
        {book.availableQuantity === 0 && (
          <div className="mt-3 w-full px-4 py-2 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center justify-center">
              <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span className="text-red-600 font-semibold text-sm">Currently Unavailable</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookCard;
