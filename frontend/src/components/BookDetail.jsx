import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { bookAPI } from '../apis/bookAPI';
import { issueAPI } from '../apis/issueAPI';
import { useAuth } from '../context/AuthContext';
import IssueForm from './IssueForm';

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showIssueForm, setShowIssueForm] = useState(false);
  const [userActiveIssue, setUserActiveIssue] = useState(null);
  const [checkingIssue, setCheckingIssue] = useState(false);

  useEffect(() => {
    fetchBook();
    if (isAuthenticated) {
      checkUserActiveIssue();
    }
  }, [id, isAuthenticated]);

  const fetchBook = async () => {
    try {
      const response = await bookAPI.getBookById(id);
      console.log('Book Detail API Response:', response); // Debug log
      setBook(response);
    } catch (error) {
      console.error('Book Detail API Error:', error);
      toast.error('Failed to fetch book details');
      navigate('/books');
    } finally {
      setLoading(false);
    }
  };

  const checkUserActiveIssue = async () => {
    if (!isAuthenticated) return;
    
    setCheckingIssue(true);
    try {
      const response = await issueAPI.getMyIssues();
      const activeIssue = response.data.find(issue => !issue.returned);
      setUserActiveIssue(activeIssue);
    } catch (error) {
      console.error('Error checking user active issues:', error);
    } finally {
      setCheckingIssue(false);
    }
  };

  const handleIssueBook = () => {
    if (!isAuthenticated) {
      toast.error('Please login to issue books');
      navigate('/login');
      return;
    }
    
    if (userActiveIssue) {
      toast.error(`You already have a book issued: "${userActiveIssue.bookId?.title || 'Unknown'}". Please return it first.`);
      return;
    }
    
    setShowIssueForm(true);
  };

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Book not found</h2>
          <button
            onClick={() => navigate('/books')}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
          >
            Back to Books
          </button>
        </div>
      </div>
    );
  }
console.log(book);
  return (
    
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/3 p-6">
            <div className="bg-gray-100 h-64 md:h-80 rounded-lg flex items-center justify-center">
              <img src="/book.png"></img>
              
            </div>
          </div>
          
          <div className="md:w-2/3 p-6">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-3xl font-bold text-gray-800">{book.data.title}</h1>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(book.data.category)}`}>
                {book.data.category}
              </span>
            </div>
            
            <p className="text-xl text-gray-600 mb-4">by {book.data.author}</p>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-1">Price</h3>
                <p className="text-2xl font-bold text-indigo-600">₹{book.data.cost}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-1">Availability</h3>
                <p className={`text-2xl font-bold ${getAvailabilityColor(book.data.availableQuantity, book.data.totalQuantity)}`}>
                  {book.data.availableQuantity}/{book.data.totalQuantity}
                </p>
              </div>
            </div>

            {book.data.pdfLink && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-700 mb-2">PDF Version</h3>
                <a
                  href={book.data.pdfLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  View PDF
                </a>
              </div>
            )}

            <div className="flex space-x-4">
              <button
                onClick={() => navigate('/books')}
                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition duration-200"
              >
                Back to Books
              </button>
              
              {/* Show different states based on authentication and user's current issues */}
              {!isAuthenticated ? (
                <button
                  onClick={() => navigate('/login')}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition duration-200"
                >
                  Login to Issue
                </button>
              ) : userActiveIssue ? (
                <div className="flex flex-col">
                  <button
                    disabled
                    className="bg-gray-400 text-white px-6 py-2 rounded-lg cursor-not-allowed opacity-60"
                    title="You already have a book issued"
                  >
                    Already Issued a Book
                  </button>
                  <p className="text-xs text-gray-500 mt-1">
                    Return "{userActiveIssue.bookId?.title || 'your current book'}" first
                  </p>
                </div>
              ) : book.data.availableQuantity > 0 ? (
                <button
                  onClick={handleIssueBook}
                  disabled={checkingIssue}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition duration-200 disabled:opacity-50"
                >
                  {checkingIssue ? 'Checking...' : 'Issue Book'}
                </button>
              ) : (
                <button
                  disabled
                  className="bg-gray-400 text-white px-6 py-2 rounded-lg cursor-not-allowed opacity-60"
                >
                  Out of Stock
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {showIssueForm && (
        <IssueForm
          book={book.data}  // ✅ pass only the book data
          onClose={() => setShowIssueForm(false)}
          onSuccess={() => {
            setShowIssueForm(false);
            fetchBook(); // refresh book availability
            checkUserActiveIssue(); // refresh user's issue status
          }}
        />
      )}
    </div>
  );
};

export default BookDetail;
