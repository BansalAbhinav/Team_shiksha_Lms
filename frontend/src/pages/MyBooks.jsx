import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { issueAPI } from '../apis/issueAPI';
import { useAuth } from '../context/AuthContext';
import ReturnForm from '../components/ReturnForm';

const MyBooks = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [showReturnForm, setShowReturnForm] = useState(false);
  const [filter, setFilter] = useState('all'); // all, active, overdue, returned
  const { user } = useAuth();

  useEffect(() => {
    fetchMyIssues();
  }, []);

  const fetchMyIssues = async () => {
    try {
      const response = await issueAPI.getMyIssues();
      console.log('📚 API Response:', response);
      const issuesData = response.data || response;
      console.log('📅 Issues Data:', issuesData);
      if (issuesData.length > 0) {
        console.log('📅 Sample issue dates:', {
          issueDate: issuesData[0].issueDate,
          dueDate: issuesData[0].dueDate,
          dueDateParsed: new Date(issuesData[0].dueDate).toLocaleDateString(),
          isOverdue: new Date(issuesData[0].dueDate) < new Date()
        });
      }
      setIssues(issuesData);
    } catch (error) {
      console.error('Error fetching issues:', error);
      toast.error('Failed to fetch your books');
    } finally {
      setLoading(false);
    }
  };

  const handleReturnBook = (issue) => {
    setSelectedIssue(issue);
    setShowReturnForm(true);
  };

  const handleReturnSuccess = () => {
    setShowReturnForm(false);
    setSelectedIssue(null);
    fetchMyIssues(); // Refresh issues list
  };

  const getStatusColor = (issue) => {
    if (issue.returned) return 'bg-green-100 text-green-800';
    
    const today = new Date();
    const dueDate = new Date(issue.dueDate);
    const isOverdue = today > dueDate;
    
    if (isOverdue) return 'text-red-800';
    return 'bg-blue-100 text-blue-800';
  };

  const getStatusText = (issue) => {
    if (issue.returned) return 'Returned';
    
    const today = new Date();
    const dueDate = new Date(issue.dueDate);
    const isOverdue = today > dueDate;
    
    if (isOverdue) {
      const daysLate = Math.ceil((today - dueDate) / (1000 * 60 * 60 * 24));
      return `Overdue (${daysLate} days)`;
    }
    return 'Active';
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      // Check if date is valid
      if (isNaN(date.getTime())) {
        console.error('Invalid date:', dateString);
        return 'Invalid Date';
      }
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Invalid Date';
    }
  };

  const getDaysUntilDue = (dueDate) => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time to start of day
      const due = new Date(dueDate);
      due.setHours(23, 59, 59, 999); // Set to end of due date
      
      // Validate dates
      if (isNaN(today.getTime()) || isNaN(due.getTime())) {
        console.error('Invalid dates in calculation:', { today, due, dueDate });
        return 0;
      }
      
      const diffTime = due - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      console.log('📅 Date calculation:', {
        today: today.toLocaleDateString(),
        due: due.toLocaleDateString(),
        diffDays,
        dueDate
      });
      
      return diffDays;
    } catch (error) {
      console.error('Date calculation error:', error);
      return 0;
    }
  };

  const filteredIssues = issues.filter(issue => {
    switch (filter) {
      case 'active':
        return !issue.returned;
      case 'overdue':
        return !issue.returned && new Date(issue.dueDate) < new Date();
      case 'returned':
        return issue.returned;
      default:
        return true;
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">My Books</h1>
        
        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex space-x-4">
            {[
              { key: 'all', label: 'All Books' },
              { key: 'active', label: 'Active' },
              { key: 'overdue', label: 'Overdue' },
              { key: 'returned', label: 'Returned' }
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filter === key
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Books</h3>
            <p className="text-3xl font-bold text-indigo-600">{issues.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Active Issues</h3>
            <p className="text-3xl font-bold text-blue-600">
              {issues.filter(issue => !issue.returned).length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Overdue</h3>
            <p className="text-3xl font-bold text-red-600">
              {issues.filter(issue => 
                !issue.returned && new Date(issue.dueDate) < new Date()
              ).length}
            </p>
          </div>
        </div>
      </div>

      {/* Books List */}
      {filteredIssues.length > 0 ? (
        <div className="space-y-4">
          {filteredIssues.map((issue) => (
            <div key={issue._id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-semibold text-gray-800">
                      {issue.bookId?.title}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(issue)}`}>
                      {getStatusText(issue)}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-2">by {issue.bookId?.author}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Issued:</span>
                      <p className="font-medium">{formatDate(issue.issueDate)}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Due:</span>
                      <p className="font-medium">{formatDate(issue.dueDate)}</p>
                    </div>
                    {issue.returned && (
                      <div>
                        <span className="text-gray-500">Returned:</span>
                        <p className="font-medium">{formatDate(issue.returnDate)}</p>
                      </div>
                    )}
                    {issue.fine > 0 && (
                      <div>
                        <span className="text-gray-500">Fine:</span>
                        <p className="font-medium text-red-600">₹{issue.fine}</p>
                      </div>
                    )}
                  </div>

                  {!issue.returned && (
                    <div className="mt-2">
                      {(() => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        const dueDate = new Date(issue.dueDate);
                        dueDate.setHours(0, 0, 0, 0);
                        const isOverdue = today > dueDate;
                        
                        if (isOverdue) {
                          const daysOverdue = Math.ceil((today - dueDate) / (1000 * 60 * 60 * 24));
                          return (
                            <p className="text-red-600 font-medium">
                              Overdue by {daysOverdue} days
                            </p>
                          );
                        } else {
                          const daysUntilDue = getDaysUntilDue(issue.dueDate);
                          return (
                            <p className="text-gray-600">
                              Due in {daysUntilDue} days
                            </p>
                          );
                        }
                      })()}
                    </div>
                  )}
                </div>

                {!issue.returned && (
                  <div className="mt-4 md:mt-0 md:ml-6">
                    <button
                      onClick={() => handleReturnBook(issue)}
                      className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition duration-200"
                    >
                      Return Book
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <h3 className="text-lg font-medium text-gray-800 mb-2">No books found</h3>
          <p className="text-gray-500">
            {filter === 'all' 
              ? 'You haven\'t issued any books yet'
              : `No ${filter} books found`
            }
          </p>
        </div>
      )}

      {/* Return Form Modal */}
      {showReturnForm && selectedIssue && (
        <ReturnForm
          issue={selectedIssue}
          onClose={() => setShowReturnForm(false)}
          onSuccess={handleReturnSuccess}
        />
      )}
    </div>
  );
};

export default MyBooks;
