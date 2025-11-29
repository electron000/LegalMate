// src/api/LegalResearch/LegalResearchAPI.js (Assuming file path)

import { legalResearchClient } from '../config'; // Update path as necessary

/**
 * Sends a legal research query to the backend and fetches the answer.
 * @param {string} query The user's legal research query.
 * @returns {Promise<string>} The AI's structured response.
 */
export const fetchLegalResearchAnswer = async (query) => {
  const payload = {
    query: query,
  };

  const response = await legalResearchClient.post('/get_answer', payload);
  
  // The backend's routes.py returns: {'response': result}
  // The 'result' is the answer from get_answer.
  return response.data.response;
};