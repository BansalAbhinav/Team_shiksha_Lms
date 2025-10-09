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
    <div className="card card-hover">
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
            {book.title}
          </h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(book.category)}`}>
            {book.category}
          </span>
        </div>
        
        <p className="text-gray-600 mb-2">by {book.author}</p>
        
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-bold text-primary">
            ₹{book.cost}
          </span>
          <span className={`text-sm font-medium ${getAvailabilityColor(book.availableQuantity, book.totalQuantity)}`}>
            {book.availableQuantity}/{book.totalQuantity} available
          </span>
        </div>

        {book.pdfLink && (
          <div className="mb-4">
            <a
              href={book.pdfLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              View PDF
            </a>
          </div>
        )}

        <div className="flex space-x-2">
          <Link
            to={`/books/${book._id || book.id}`}
            className="flex-1 btn-primary text-center"
          >
            View Details
          </Link>
          
          {isAuthenticated && book.availableQuantity > 0 && (
            <button
              onClick={() => onIssueBook(book)}
              className="flex-1 btn-success"
            >
              Issue Book
            </button>
          )}
        </div>

        {book.availableQuantity === 0 && (
          <div className="mt-2 text-center">
            <span className="text-red-500 text-sm font-medium">Out of Stock</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookCard;
