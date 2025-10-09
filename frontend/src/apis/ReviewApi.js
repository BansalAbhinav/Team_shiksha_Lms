import axiosInstance from './axiosInstance';

export const reviewAPI = {

    getReviewsByBookId: async (bookId) => {
        const response = await axiosInstance.get(`/reviews/book/${bookId}`);
        return response.data;
    },

    getAverageRating: async (bookId) => {
        const response = await axiosInstance.get(`/reviews/average/${bookId}`);
        return response.data;
    },

    addReview: async (reviewData) => {
        const response = await axiosInstance.post('/reviews/add', reviewData);
        return response.data;
    },

    updateReview: async (reviewId, reviewData) => {
        const response = await axiosInstance.put(`/reviews/${reviewId}`, reviewData);
        return response.data;
    },

    deleteReview: async (reviewId) => {
        const response = await axiosInstance.delete(`/reviews/${reviewId}`);
        return response.data;
    },

    getReviewsByUser: async (userId) => {
        const response = await axiosInstance.get(`/reviews/user/${userId}`);
        return response.data;
    }

}