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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading book details...</p>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg">
          <svg className="w-20 h-20 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Book Not Found</h2>
          <p className="text-gray-600 mb-6">Sorry, we couldn't find the book you're looking for.</p>
          <button
            onClick={() => navigate('/books')}
            className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Books
          </button>
        </div>
      </div>
    );
  }
console.log(book);
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <button
                onClick={() => navigate('/books')}
                className="text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Books
              </button>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-600 truncate max-w-xs">{book.data.title}</li>
          </ol>
        </nav>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="lg:flex">
            {/* Book Image Section */}
            <div className="lg:w-2/5 p-8">
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 h-80 lg:h-96 rounded-xl flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 opacity-50"></div>
                <svg className="w-24 h-24 text-gray-400 z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
            
            {/* Book Details Section */}
            <div className="lg:w-3/5 p-8">
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                  <div className="flex-1">
                    <h1 className="text-4xl font-bold text-gray-900 mb-3 leading-tight">{book.data.title}</h1>
                    <p className="text-xl text-gray-600 mb-4">by <span className="font-semibold text-gray-800">{book.data.author}</span></p>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold shadow-sm ${getCategoryColor(book.data.category)}`}>
                    {book.data.category}
                  </span>
                </div>
                
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-xl border border-indigo-100">
                    <div className="flex items-center">
                      <div className="bg-indigo-100 p-3 rounded-lg mr-4">
                        <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-600 mb-1">Book Price</h3>
                        <p className="text-3xl font-bold text-indigo-600">₹{book.data.cost}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100">
                    <div className="flex items-center">
                      <div className="bg-green-100 p-3 rounded-lg mr-4">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-600 mb-1">Availability</h3>
                        <p className={`text-3xl font-bold ${getAvailabilityColor(book.data.availableQuantity, book.data.totalQuantity)}`}>
                          {book.data.availableQuantity} / {book.data.totalQuantity}
                        </p>
                        <p className="text-sm text-gray-500">copies available</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* PDF Link */}
                {book.data.pdfLink && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Digital Version</h3>
                    <a
                      href={book.data.pdfLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Download PDF
                    </a>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                  <button
                    onClick={() => navigate('/books')}
                    className="flex items-center justify-center px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Books
                  </button>
                  
                  {/* Enhanced button states */}
                  {!isAuthenticated ? (
                    <button
                      onClick={() => navigate('/login')}
                      className="flex items-center justify-center px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-all duration-200 shadow-sm hover:shadow-md flex-1"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                      </svg>
                      Login to Issue Book
                    </button>
                  ) : userActiveIssue ? (
                    <div className="flex-1">
                      <button
                        disabled
                        className="w-full px-8 py-3 bg-orange-100 text-orange-700 font-semibold rounded-lg cursor-not-allowed border border-orange-200"
                      >
                        <div className="flex items-center justify-center">
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                          </svg>
                          Already Have a Book Issued
                        </div>
                      </button>
                      <p className="text-sm text-orange-600 mt-2 text-center">
                        Return "{userActiveIssue.bookId?.title || 'your current book'}" first to issue another book
                      </p>
                    </div>
                  ) : book.data.availableQuantity > 0 ? (
                    <button
                      onClick={handleIssueBook}
                      disabled={checkingIssue}
                      className="flex items-center justify-center px-8 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all duration-200 shadow-sm hover:shadow-md flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {checkingIssue ? (
                        <>
                          <svg className="w-5 h-5 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          Checking...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          Issue This Book
                        </>
                      )}
                    </button>
                  ) : (
                    <div className="flex-1">
                      <button
                        disabled
                        className="w-full px-8 py-3 bg-red-100 text-red-700 font-semibold rounded-lg cursor-not-allowed border border-red-200"
                      >
                        <div className="flex items-center justify-center">
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                          </svg>
                          Currently Unavailable
                        </div>
                      </button>
                      <p className="text-sm text-red-600 mt-2 text-center">
                        All copies are currently issued. Please check back later.
                      </p>
                    </div>
                  )}
                </div>
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
    </div>
  );
};

export default BookDetail;
