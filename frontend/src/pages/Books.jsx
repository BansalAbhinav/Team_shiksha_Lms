import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { bookAPI } from '../apis/bookAPI';
import { useAuth } from '../context/AuthContext';
import BookCard from '../components/BookCard';
import IssueForm from '../components/IssueForm';
import { sampleBooks, sampleCategories } from '../utils/sampleData';

const Books = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [showIssueForm, setShowIssueForm] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchBooks();
    fetchCategories();
  }, []);

  useEffect(() => {
    filterBooks();
  }, [books, searchQuery, selectedCategory]);

  const fetchBooks = async () => {
    try {
      const response = await bookAPI.getAllBooks();
      console.log('Fetched books:', response); // Debug log
      setBooks(response);
    } catch (error) {
      console.error('Failed to fetch books:', error);
      console.log('Using sample data instead');
      toast.warning('Using sample data - Backend not connected');
      setBooks(sampleBooks); // Use sample data on error
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await bookAPI.getCategories();
      setCategories(response);
    } catch (error) {
      console.error('Failed to fetch categories');
      console.log('Using sample categories instead');
      setCategories(sampleCategories); // Use sample categories on error
    }
  };

  const filterBooks = () => {
    let filtered = books;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(book =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(book => book.category === selectedCategory);
    }

    setFilteredBooks(filtered);
  };

  const handleIssueBook = (book) => {
    if (!isAuthenticated) {
      toast.error('Please login to issue books');
      return;
    }
    setSelectedBook(book);
    setShowIssueForm(true);
  };

  const handleIssueSuccess = () => {
    setShowIssueForm(false);
    setSelectedBook(null);
    fetchBooks(); // Refresh books list
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 " ></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Sample Data Banner */}
      {books.length > 0 && books[0]._id === '1' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <p className="text-yellow-800 font-medium">
              Currently showing sample data. Connect to your backend to see real books.
            </p>
          </div>
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Library Books</h1>
        
        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search books by title or author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="md:w-48">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-4">
          <p className="text-gray-600">
            Showing {filteredBooks.length} of {books.length} books
            {searchQuery && ` for "${searchQuery}"`}
            {selectedCategory !== 'all' && ` in ${selectedCategory}`}
          </p>
        </div>
      </div>

      {/* Debug Info// */}
      {/* {process.env.NODE_ENV === 'development' && ( */}
        {/* // <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        //   <h3 className="font-semibold text-yellow-800 mb-2">Debug Info:</h3>
        //   <p className="text-sm text-yellow-700">
        //     Books: {books.length} | Filtered: {filteredBooks.length} | Loading: {loading.toString()}
        //   </p>
        //   <p className="text-xs text-yellow-600 mt-1">
        //     Search: "{searchQuery}" | Category: "{selectedCategory}"
        //   </p>
        // </div>
      )} */}

      {/* Books Grid */}
      {filteredBooks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBooks.map((book) => (
            <BookCard
              key={book._id || book.id}
              book={book}
              onIssueBook={handleIssueBook}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="max-w-md mx-auto">
            <svg className="w-20 h-20 text-gray-400 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">No books found</h3>
            <p className="text-gray-500 mb-6">
              {searchQuery || selectedCategory !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : books.length === 0 
                  ? 'No books are available in the library. Contact an administrator to add books.'
                  : 'No books match your current filters.'
              }
            </p>
            {(searchQuery || selectedCategory !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition duration-200"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      )}

      {/* Issue Form Modal */}
      {showIssueForm && selectedBook && (
        <IssueForm
          book={selectedBook}
          onClose={() => setShowIssueForm(false)}
          onSuccess={handleIssueSuccess}
        />
      )}
    </div>
  );
};

export default Books;