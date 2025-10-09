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

  const calculateFine = (returnDate, damageType) => {
    const dueDate = new Date(issue.dueDate);
    const returnDateObj = new Date(returnDate);
    const bookPrice = issue.bookId?.cost || issue.book?.cost || 0;
    
    // Reset time to compare only dates
    dueDate.setHours(0, 0, 0, 0);
    returnDateObj.setHours(0, 0, 0, 0);
    
    let fine = 0;
    let lateDays = 0;
    let fineBreakdown = [];
    
    // Check if returned after due date
    if (returnDateObj > dueDate) {
      lateDays = Math.ceil((returnDateObj - dueDate) / (1000 * 60 * 60 * 24));
      
      // Missing book fine (200% of book price)
      const missingFine = bookPrice * 2;
      fine += missingFine;
      fineBreakdown.push(`Missing book: ₹${missingFine} (200% of book price)`);
      
      // Late return fine (₹50 per day)
      const lateFine = lateDays * 50;
      fine += lateFine;
      fineBreakdown.push(`Late return: ₹${lateFine} (₹50 × ${lateDays} days)`);
    }
    
    // Damage fine
    if (damageType === 'small') {
      const damageFine = bookPrice * 0.1;
      fine += damageFine;
      fineBreakdown.push(`Small damage: ₹${damageFine} (10% of book price)`);
    } else if (damageType === 'large') {
      const damageFine = bookPrice * 0.5;
      fine += damageFine;
      fineBreakdown.push(`Large damage: ₹${damageFine} (50% of book price)`);
    }
    
    console.log('� Fine Calculation:', {
      bookPrice,
      returnDate: returnDateObj.toLocaleDateString(),
      dueDate: dueDate.toLocaleDateString(),
      lateDays,
      damageType,
      totalFine: fine,
      breakdown: fineBreakdown
    });
    
    return { fine: Math.round(fine), lateDays, breakdown: fineBreakdown };
  };

  React.useEffect(() => {
    const calculation = calculateFine(formData.returnDate, formData.damageType);
    setFormData(prev => ({
      ...prev,
      lateDays: calculation.lateDays,
      fine: calculation.fine,
      fineBreakdown: calculation.breakdown
    }));
  }, [issue, formData.returnDate, formData.damageType]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Only allow changes to returnDate and damageType, fine and lateDays are calculated automatically
    if (name === 'returnDate' || name === 'damageType') {
      // Validate return date is not before issue date
      if (name === 'returnDate') {
        const issueDate = new Date(issue.issueDate).toISOString().split('T')[0];
        
        if (value < issueDate) {
          toast.error('Return date cannot be before the issue date');
          return;
        }
      }
      
      setFormData({ ...formData, [name]: value });
    }
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
            <h3 className="font-semibold text-gray-800">{issue.bookId?.title || issue.book?.title || 'Unknown Book'}</h3>
            <p className="text-gray-600">by {issue.bookId?.author || issue.book?.author || 'Unknown Author'}</p>
            <div className="mt-2 space-y-1">
              <div className="text-sm">
                <span className="text-gray-500">Issued:</span>
                <p className="font-medium">{new Date(issue.issueDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}</p>
              </div>
              <div className="text-sm">
                <span className="text-gray-500">Due:</span>
                <p className="font-medium">{new Date(issue.dueDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}</p>
              </div>
              <div className="text-sm">
                <span className="text-gray-500">Book Price:</span>
                <p className="font-medium">₹{issue.bookId?.cost || issue.book?.cost || 0}</p>
              </div>
            </div>
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
                min={new Date(issue.issueDate).toISOString().split('T')[0]}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Return date must be on or after the issue date ({new Date(issue.issueDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })})
              </p>
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
                className="w-full px-4 py-2 border rounded-lg bg-gray-100 focus:outline-none"
                readOnly
              />
              <p className="text-xs text-gray-500 mt-1">
                Automatically calculated based on return date
              </p>
            </div>

            <div>
              <label className="block text-gray-700 mb-1" htmlFor="fine">
                Total Fine Amount (₹)
              </label>
              <input
                name="fine"
                id="fine"
                type="number"
                min="0"
                value={formData.fine}
                className="w-full px-4 py-2 border rounded-lg bg-gray-100 focus:outline-none"
                readOnly
              />
              
              {formData.fineBreakdown && formData.fineBreakdown.length > 0 && (
                <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm font-medium text-yellow-800 mb-2">Fine Breakdown:</p>
                  <ul className="text-xs text-yellow-700 space-y-1">
                    {formData.fineBreakdown.map((item, index) => (
                      <li key={index}>• {item}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {formData.fine === 0 && (
                <p className="text-xs text-green-600 mt-1">
                  ✅ No fine - Book returned on time with no damage
                </p>
              )}
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
