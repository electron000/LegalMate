import axios from 'axios';

// Helper to check if we are in development mode
const isDev = import.meta.env.DEV;

export const BLOG_API_URL = 
  import.meta.env.VITE_BLOG_API_URL || 
  (isDev ? 'http://localhost:8000' : 'https://legalblog-backend.onrender.com'); 

export const CHATBOT_API_URL = 
  import.meta.env.VITE_CHATBOT_API_URL ||
  (isDev ? 'http://localhost:8001' : "https://legalmate-agent.onrender.com")

export const DOCGEN_API_URL = 
  import.meta.env.VITE_DOCGEN_API_URL || 
  (isDev ? 'http://localhost:8002' : 'https://doc-gen-bd.onrender.com');

export const DOC_ANALYZER_API_URL = 
  import.meta.env.VITE_DOC_ANALYZER_API_URL || 
  (isDev ? 'http://localhost:8003' : 'https://doc-analyzer-bd.onrender.com');

export const LEGAL_RESEARCH_API_URL = 
  import.meta.env.VITE_LEGAL_RESEARCH_API_URL ||
  (isDev ? 'http://localhost:8004' : "https://legal-research-agent.onrender.com"); 

export const CASE_MANAGEMENT_API_URL = 
  import.meta.env.VITE_CASE_MANAGEMENT_API_URL ||
  (isDev ? 'http://localhost:8005' : "https://cms-bd.onrender.com"); 

// 1. LegalMate Client
export const legalMateClient = axios.create({
  baseURL: CHATBOT_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Research Client
export const legalResearchClient = axios.create({
  baseURL: LEGAL_RESEARCH_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 3. DocGen Client
export const docGenClient = axios.create({
  baseURL: DOCGEN_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 4. Blog Client
export const blogClient = axios.create({
  baseURL: `${BLOG_API_URL}/api/law-generator`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 5. Doc Analyzer Client
export const docAnalyzerClient = axios.create({
  baseURL: DOC_ANALYZER_API_URL,
});

// 6. Case Management Client
export const caseManagementClient = axios.create({
  baseURL: CASE_MANAGEMENT_API_URL,
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
    console.error("API No Response:", error.request);
    throw new Error('No response received from server. Please check your connection.');
  } else {
    console.error("API Request Error:", error.message);
    throw new Error(error.message);
  }
};

// Apply interceptors
// Added caseManagementClient to the list below
[
  legalMateClient, 
  legalResearchClient, 
  docGenClient, 
  blogClient, 
  docAnalyzerClient, 
  caseManagementClient
].forEach(client => {
  client.interceptors.response.use(
    (response) => response,
    (error) => handleAxiosError(error)
  );
});