import axios from 'axios';

// Helper to check if we are in development mode
const isDev = import.meta.env.DEV;

export const BLOG_API_URL = 
  import.meta.env.VITE_BLOG_API_URL || 
  (isDev ? 'https://legalblog-backend.onrender.com' : 'http://localhost:8000'); 

export const CHATBOT_API_URL = 
import.meta.env.VITE_CHATBOT_API_URL ||
(isDev ? 'http://localhost:8001' : "https://legalmate-agent.onrender.com")

export const DOCGEN_API_URL = 
  import.meta.env.VITE_DOCGEN_API_URL || 
  (isDev ? 'http://localhost:8002' : 'https://doc-gen-bd.onrender.com');

export const DOC_ANALYZER_API_URL = 
  import.meta.env.VITE_DOC_ANALYZER_API_URL || 
  (isDev ? 'http://localhost:8003' : 'https://doc-analyzer-bd.onrender.com');

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

// 4. Doc Analyzer Client (Port 8003)
export const docAnalyzerClient = axios.create({
  baseURL: DOC_ANALYZER_API_URL,
});

// Helper to standardize error handling across all clients
const handleAxiosError = (error) => {
  if (error.response) {
    const message = error.response.data?.detail || error.response.data?.message || 'An error occurred on the server.';
    console.error("API Error Response:", error.response.data);
    throw new Error(message);
  } else if (error.request) {
    console.error("API No Response:", error.request);
    throw new Error('No response received from server. Please check your connection.');
  } else {
    console.error("API Request Error:", error.message);
    throw new Error(error.message);
  }
};

// Apply interceptors
[chatbotClient, docGenClient, blogClient, docAnalyzerClient].forEach(client => {
  client.interceptors.response.use(
    (response) => response,
    (error) => handleAxiosError(error)
  );
});