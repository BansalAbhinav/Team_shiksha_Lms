import axiosInstance from './axiosInstance';

export const bookAPI = {
  // Get all books
  getAllBooks: async () => {
    try {
      const response = await axiosInstance.get('/books');
      console.log('Books API Response:', response.data); // Debug log
      // Handle both direct array and wrapped response
      return Array.isArray(response.data) ? response.data : response.data.books || response.data.data || [];
    } catch (error) {
      console.error('Books API Error:', error);
      throw error.response?.data || error.message;
    }
  },

  // Get book by ID
  getBookById: async (id) => {
    try {
      const response = await axiosInstance.get(`/books/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },


  // Get all categories
  getCategories: async () => {
    try {
      const response = await axiosInstance.get('/categories');
      console.log('Categories API Response:', response.data); // Debug log
      // Handle both direct array and wrapped response
      return Array.isArray(response.data) ? response.data : response.data.categories || response.data.data || ['Fiction', 'Non-Fiction', 'Academic'];
    } catch (error) {
      console.error('Categories API Error:', error);
      // Return default categories if API fails
      return ['Fiction', 'Non-Fiction', 'Academic'];
    }
  },

  // Get books by category
  getBooksByCategory: async (category) => {
    try {
      const response = await axiosInstance.get(`/books/category/${category}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Check book availability
  checkAvailability: async (id) => {
    try {
      const response = await axiosInstance.get(`/books/${id}/availability`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Search books
  searchBooks: async (query) => {
    try {
      const response = await axiosInstance.get(`/books/search?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};
