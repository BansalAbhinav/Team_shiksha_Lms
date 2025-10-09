import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { issueAPI } from '../apis/issueAPI';
import { useAuth } from '../context/AuthContext';

const IssueForm = ({ book, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    issueType: 'individual',
    groupSize: 1,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const issueData = {
        userId: user.id,
        bookId: book._id,
        issueType: formData.issueType,
        ...(formData.issueType === 'group' && { groupSize: parseInt(formData.groupSize) })
      };

      await issueAPI.issueBook(issueData);
      toast.success(
        <div className="flex items-center">
          <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <div className="font-semibold">Book Issued Successfully!</div>
            <div className="text-sm">You can now access "{book.title}" from your profile.</div>
          </div>
        </div>,
        { autoClose: 5000 }
      );
      onSuccess();
    } catch (error) {
      const errorData = error.response?.data;
      
      // Handle specific error types with enhanced UI
      if (errorData?.error === 'ACTIVE_ISSUE_EXISTS' && errorData?.currentBook) {
        const currentBook = errorData.currentBook;
        toast.error(
          <div className="space-y-2">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-orange-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div className="font-semibold text-orange-800">Cannot Issue Another Book</div>
            </div>
            <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
              <div className="text-sm text-orange-700">
                <div className="font-medium">Currently Issued:</div>
                <div>"{currentBook.title}" by {currentBook.author}</div>
                <div className="text-xs mt-1">
                  Issued: {currentBook.issueDate} • Due: {currentBook.dueDate}
                </div>
              </div>
            </div>
            <div className="text-xs text-orange-600">
              Please return your current book before issuing a new one.
            </div>
          </div>,
          { 
            autoClose: 10000,
            className: 'toast-warning'
          }
        );
      } else if (errorData?.error === 'BOOK_UNAVAILABLE') {
        toast.error(
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
            </svg>
            <div>
              <div className="font-semibold">Book Unavailable</div>
              <div className="text-sm">All copies are currently issued. Please try again later.</div>
            </div>
          </div>,
          { autoClose: 6000 }
        );
      } else {
        toast.error(
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <div className="font-semibold">Issue Failed</div>
              <div className="text-sm">{errorData?.message || error.message || 'Failed to issue book'}</div>
            </div>
          </div>,
          { autoClose: 6000 }
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const maxDueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // Max 30 days

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full transform transition-all">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Issue Book</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 rounded-lg hover:bg-gray-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Book Information Card */}
          <div className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
            <div className="flex items-start space-x-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900">{book.title}</h3>
                <p className="text-gray-600 font-medium">by {book.author}</p>
                <div className="flex items-center mt-2 text-sm text-green-600">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {book.availableQuantity} copies available
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3" htmlFor="issueType">
                Select Issue Type
              </label>
              <div className="space-y-3">
                <label className="flex items-center p-4 border-2 border-gray-200 rounded-xl hover:border-indigo-300 cursor-pointer transition-colors duration-200">
                  <input
                    type="radio"
                    name="issueType"
                    value="individual"
                    checked={formData.issueType === 'individual'}
                    onChange={handleChange}
                    className="text-indigo-600 focus:ring-indigo-500 mr-4"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-900">Individual Issue</span>
                      <span className="text-sm font-medium text-indigo-600 bg-indigo-100 px-2 py-1 rounded-lg">30 days</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Perfect for personal study and research</p>
                  </div>
                </label>
                
                <label className="flex items-center p-4 border-2 border-gray-200 rounded-xl hover:border-indigo-300 cursor-pointer transition-colors duration-200">
                  <input
                    type="radio"
                    name="issueType"
                    value="group"
                    checked={formData.issueType === 'group'}
                    onChange={handleChange}
                    className="text-indigo-600 focus:ring-indigo-500 mr-4"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-900">Group Issue</span>
                      <span className="text-sm font-medium text-green-600 bg-green-100 px-2 py-1 rounded-lg">180 days</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Ideal for group projects and collaborative work</p>
                  </div>
                </label>
              </div>
            </div>

            {formData.issueType === 'group' && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                <label className="block text-sm font-semibold text-gray-800 mb-3" htmlFor="groupSize">
                  Group Size (3-6 members)
                </label>
                <input
                  name="groupSize"
                  id="groupSize"
                  type="number"
                  min="3"
                  max="6"
                  value={formData.groupSize}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-200"
                  placeholder="Enter group size (3-6)"
                  required
                />
                <p className="text-sm text-amber-700 mt-2 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Group issues require 3-6 members and have an extended 6-month duration
                </p>
              </div>
            )}

            <div className="flex space-x-4 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <svg className="w-5 h-5 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Issuing...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Issue Book
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default IssueForm;
