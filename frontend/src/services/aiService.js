import axios from 'axios';

const AI_API_URL = import.meta.env.VITE_AI_API_URL;

export const aiService = {
  generateEmail: async (type, data) => {
    try {
      const response = await axios.post(`${AI_API_URL}/generate-email`, {
        type,
        data
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  analyzeDocument: async (document) => {
    try {
      const response = await axios.post(`${AI_API_URL}/analyze-document`, {
        document
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getPredictions: async (data) => {
    try {
      const response = await axios.post(`${AI_API_URL}/get-predictions`, {
        data
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};