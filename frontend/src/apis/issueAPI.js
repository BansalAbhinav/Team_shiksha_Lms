import axiosInstance from './axiosInstance';

export const issueAPI = {
  // Issue a book
  issueBook: async (issueData) => {
    try {
      const response = await axiosInstance.post('/issues', issueData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Return a book
  returnBook: async (returnData) => {
    try {
      const response = await axiosInstance.put('/issues/return', returnData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all issues
  getAllIssues: async () => {
    try {
      const response = await axiosInstance.get('/issues');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get issue by ID
  getIssueById: async (id) => {
    try {
      const response = await axiosInstance.get(`/issues/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get user's issued books
  getUserIssues: async (userId) => {
    try {
      const response = await axiosInstance.get(`/issues/user/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get overdue books
  getOverdueBooks: async () => {
    try {
      const response = await axiosInstance.get('/issues/overdue');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get current user's issues
  getMyIssues: async () => {
    try {
      const response = await axiosInstance.get('/issues/my');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};
