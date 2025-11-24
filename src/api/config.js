import axios from 'axios';

// Environment Variables
export const BLOG_API_URL = import.meta.env.VITE_BLOG_API_URL || 'http://localhost:8000';
export const CHATBOT_API_URL = import.meta.env.VITE_CHATBOT_API_URL || 'http://localhost:8001';
export const DOCGEN_API_URL = import.meta.env.VITE_DOCGEN_API_URL || 'http://localhost:8002';

// 1. LegalMate & Research Client
export const chatbotClient = axios.create({
  baseURL: CHATBOT_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. DocGen Client
export const docGenClient = axios.create({
  baseURL: DOCGEN_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 3. Blog Client
export const blogClient = axios.create({
  baseURL: `${BLOG_API_URL}/api/law-generator`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper to standardize error handling across all clients
const handleAxiosError = (error) => {
  if (error.response) {
    const message = error.response.data?.detail || error.response.data?.message || 'An error occurred on the server.';
    console.error("API Error Response:", error.response.data);
    throw new Error(message);
  } else if (error.request) {
    // The request was made but no response was received
    console.error("API No Response:", error.request);
    throw new Error('No response received from server. Please check your connection.');
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error("API Request Error:", error.message);
    throw new Error(error.message);
  }
};

// Apply interceptors to handle errors globally (optional but recommended)
[chatbotClient, docGenClient, blogClient].forEach(client => {
  client.interceptors.response.use(
    (response) => response,
    (error) => handleAxiosError(error)
  );
});