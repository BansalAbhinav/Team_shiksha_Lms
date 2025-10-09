import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { issueAPI } from '../apis/issueAPI';

const ReturnForm = ({ issue, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    returnDate: new Date().toISOString().split('T')[0],
    damageType: 'none',
    fine: 0,
    lateDays: 0,
  });
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    // Calculate late days and fine
    const today = new Date();
    const dueDate = new Date(issue.dueDate);
    const lateDays = Math.max(0, Math.ceil((today - dueDate) / (1000 * 60 * 60 * 24)));
    const fine = lateDays * 10; // ₹10 per day

    setFormData(prev => ({
      ...prev,
      lateDays,
      fine
    }));
  }, [issue]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const returnData = {
        issueId: issue._id,
        damageType: formData.damageType,
      };

      await issueAPI.returnBook(returnData);
      toast.success('Book returned successfully!');
      onSuccess();
    } catch (error) {
      toast.error(error.message || 'Failed to return book');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Return Book</h2>
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
            <h3 className="font-semibold text-gray-800">{issue.book?.title}</h3>
            <p className="text-gray-600">by {issue.book?.author}</p>
            <p className="text-sm text-gray-500">
              Issued: {new Date(issue.issueDate).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-500">
              Due: {new Date(issue.dueDate).toLocaleDateString()}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-1" htmlFor="returnDate">
                Return Date
              </label>
              <input
                name="returnDate"
                id="returnDate"
                type="date"
                value={formData.returnDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1" htmlFor="damageType">
                Book Condition
              </label>
              <select
                name="damageType"
                id="damageType"
                value={formData.damageType}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="none">No Damage</option>
                <option value="small">Minor Damage</option>
                <option value="large">Major Damage</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-1" htmlFor="lateDays">
                Late Days
              </label>
              <input
                name="lateDays"
                id="lateDays"
                type="number"
                min="0"
                value={formData.lateDays}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                readOnly
              />
              <p className="text-xs text-gray-500 mt-1">
                ₹10 per day fine for late returns
              </p>
            </div>

            <div>
              <label className="block text-gray-700 mb-1" htmlFor="fine">
                Fine Amount (₹)
              </label>
              <input
                name="fine"
                id="fine"
                type="number"
                min="0"
                step="0.01"
                value={formData.fine}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

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
                {loading ? 'Returning...' : 'Return Book'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReturnForm;
