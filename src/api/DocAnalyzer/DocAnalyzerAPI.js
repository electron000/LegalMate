import { docAnalyzerClient } from '../config';

export const DocAnalyzerAPI = {
  /**
   * Uploads a file and returns the summary.
   * Endpoint: POST /upload_summarize
   * @param {File} file - The file object to upload
   * @returns {Promise<Object>} - { answer: "Summary text..." }
   */
  uploadAndSummarize: async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await docAnalyzerClient.post('/upload_summarize', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Triggers the RAG embedding process.
   * Endpoint: GET /generate_embeddings
   * @returns {Promise<Object>} - { message: true }
   */
  generateEmbeddings: async () => {
    const response = await docAnalyzerClient.get('/generate_embeddings');
    return response.data;
  },

  /**
   * Asks a question based on the uploaded document context.
   * Endpoint: POST /QnA
   * @param {string} question - The user's question
   * @returns {Promise<Object>} - { answer: "AI response..." }
   */
  askQuestion: async (question) => {
    const response = await docAnalyzerClient.post('/QnA', { question });
    return response.data;
  }
};