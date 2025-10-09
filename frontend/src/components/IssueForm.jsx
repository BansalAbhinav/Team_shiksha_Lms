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
      toast.success('Book issued successfully!');
      onSuccess();
    } catch (error) {
      // Handle specific error for already issued book
      if (error.response?.data?.currentBook) {
        const currentBook = error.response.data.currentBook;
        toast.error(
          <div>
            <div className="font-medium">{error.message}</div>
            <div className="text-sm mt-1">
              Current book: "{currentBook.title}" by {currentBook.author}
            </div>
            <div className="text-xs mt-1">
              Due: {new Date(currentBook.dueDate).toLocaleDateString()}
            </div>
          </div>,
          { autoClose: 8000 }
        );
      } else {
        toast.error(error.message || 'Failed to issue book');
      }
    } finally {
      setLoading(false);
    }
  };

  const maxDueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // Max 30 days

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Issue Book</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-800">{book.title}</h3>
            <p className="text-gray-600">by {book.author}</p>
            <p className="text-sm text-gray-500">Available: {book.availableQuantity}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-1" htmlFor="issueType">
                Issue Type
              </label>
              <select
                name="issueType"
                id="issueType"
                value={formData.issueType}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="individual">Individual (30 days)</option>
                <option value="group">Group (180 days)</option>
              </select>
            </div>

            {formData.issueType === 'group' && (
              <div>
                <label className="block text-gray-700 mb-1" htmlFor="groupSize">
                  Group Size
                </label>
                <input
                  name="groupSize"
                  id="groupSize"
                  type="number"
                  min="3"
                  max="6"
                  value={formData.groupSize}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter group size (3-6)"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Group size must be between 3-6 members
                </p>
              </div>
            )}

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Issuing...' : 'Issue Book'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default IssueForm;
