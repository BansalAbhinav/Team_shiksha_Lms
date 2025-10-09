import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookAPI } from '../apis/bookAPI';
import { useAuth } from '../context/AuthContext';
import { sampleBooks, sampleCategories } from '../utils/sampleData';

const Home = () => {
  const [recentBooks, setRecentBooks] = useState([]);
  const [stats, setStats] = useState({
    totalBooks: 0,
    availableBooks: 0,
    categories: []
  });
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      const [booksResponse, categoriesResponse] = await Promise.all([
        bookAPI.getAllBooks(),
        bookAPI.getCategories()
      ]);

      setRecentBooks(booksResponse.slice(0, 6)); // Show latest 6 books
      setStats({
        totalBooks: booksResponse.length,
        availableBooks: booksResponse.reduce((sum, book) => sum + book.availableQuantity, 0),
        categories: categoriesResponse
      });
    } catch (error) {
      console.error('Failed to fetch home data:', error);
      // Use sample data as fallback
      setRecentBooks(sampleBooks.slice(0, 6));
      setStats({
        totalBooks: sampleBooks.length,
        availableBooks: sampleBooks.reduce((sum, book) => sum + book.availableQuantity, 0),
        categories: sampleCategories
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 ">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-lg text-white p-8 mb-8">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold mb-4">
            Welcome to Team Shiksha LMS
          </h1>
          <p className="text-xl mb-6 opacity-90">
            Your digital library management system. Browse, issue, and manage books with ease.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/books"
              className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-200"
            >
              Browse Books
            </Link>
            {!isAuthenticated && (
              <Link
                to="/signup"
                className="border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition duration-200"
              >
                Get Started
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-3xl font-bold text-indigo-600 mb-2">{stats.totalBooks}</div>
          <div className="text-gray-600">Total Books</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">{stats.availableBooks}</div>
          <div className="text-gray-600">Available Books</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">{stats.categories.length}</div>
          <div className="text-gray-600">Categories</div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-4xl mb-3">📚</div>
            <h3 className="font-semibold text-gray-800 mb-2">Browse Books</h3>
            <p className="text-gray-600 text-sm">Explore our vast collection of books across different categories</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-3">🔍</div>
            <h3 className="font-semibold text-gray-800 mb-2">Search & Filter</h3>
            <p className="text-gray-600 text-sm">Find books quickly with our advanced search and filtering options</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-3">📖</div>
            <h3 className="font-semibold text-gray-800 mb-2">Issue Books</h3>
            <p className="text-gray-600 text-sm">Easily issue and return books with our streamlined process</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-3">📱</div>
            <h3 className="font-semibold text-gray-800 mb-2">Digital Access</h3>
            <p className="text-gray-600 text-sm">Access PDF versions of books directly from your device</p>
          </div>
        </div>
      </div>

      {/* Recent Books Section */}
      {recentBooks.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Recent Books</h2>
            <Link
              to="/books"
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              View All Books →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentBooks.map((book) => (
              <div key={book._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{book.title}</h3>
                <p className="text-gray-600 text-sm mb-2">by {book.author}</p>
                <div className="flex justify-between items-center mb-3">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {book.category}
                  </span>
                  <span className="font-semibold text-indigo-600">₹{book.cost}</span>
                </div>
                <Link
                  to={`/books/${book._id}`}
                  className="block w-full bg-indigo-600 text-white text-center py-2 rounded-lg hover:bg-indigo-700 transition duration-200"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Call to Action */}
      {!isAuthenticated && (
        <div className="bg-gray-50 rounded-lg p-8 text-center mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Ready to start your learning journey?
          </h2>
          <p className="text-gray-600 mb-6">
            Join our library management system and access thousands of books
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition duration-200"
            >
              Create Account
            </Link>
            <Link
              to="/login"
              className="border border-indigo-600 text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-600 hover:text-white transition duration-200"
            >
              Login
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;