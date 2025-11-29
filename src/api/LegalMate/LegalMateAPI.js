import { legalMateClient } from '../config';
import { getSessionId } from './sessionmanager';

/**
 * Sends a query to the primary adaptive chatbot endpoint.
 * @param {string} query - The user's question.
 * @returns {Promise<object>} - The adaptive response from the API.
 */
export const askAdaptive = async (query) => {
  const sessionId = getSessionId();
  const response = await legalMateClient.post('/chat/legal_assistant', {
    query,
    session_id: sessionId,
  });
  return response.data;
};

/**
 * NEW: Gets ONLY the strategy/plan for a query (Fast).
 * Used for "Live Thinking" visualization.
 */
export const getChatStrategy = async (query) => {
  const sessionId = getSessionId();
  const response = await legalMateClient.post('/chat/plan', {
    query,
    session_id: sessionId,
  });
  return response.data;
};

/**
 * Sends a query to the simplified text-only endpoint.
 * @param {string} query - The user's question.
 * @returns {Promise<object>} - A simple response object with the answer text.
 */
export const askSimple = async (query) => {
  const sessionId = getSessionId();
  const response = await legalMateClient.post('/chat/legal_assistant/simple', {
    query,
    session_id: sessionId,
  });
  return response.data;
};

/**
 * Retrieves the chat history for a specific session.
 * @param {string} sessionId - The ID of the session to retrieve.
 * @returns {Promise<object>} - The chat history response.
 */
export const getHistory = async (sessionId) => {
  const response = await legalMateClient.get(`/chat/history/${sessionId}`);
  return response.data;
};

/**
 * Deletes a specific session and its history from the server.
 * @param {string} sessionId - The ID of the session to delete.
 * @returns {Promise<object>} - The confirmation response from the API.
 */
export const deleteCurrentSession = async (sessionId) => {
  const response = await legalMateClient.delete(`/chat/sessions/${sessionId}`);
  return response.data;
};

/**
 * Clears the chat history for a specific session on the server.
 * @param {string} sessionId - The ID of the session to clear.
 * @returns {Promise<object>} - The confirmation response from the API.
 */
export const clearCurrentHistory = async (sessionId) => {
  const response = await legalMateClient.delete(`/chat/history/${sessionId}`);
  return response.data;
};

/**
 * Retrieves a list of all active session IDs from the server.
 * @returns {Promise<object>}
 */
export const getAllSessions = async () => {
  const response = await legalMateClient.get('/chat/sessions');
  return response.data;
};

/**
 * Deletes the history for ALL sessions on the server.
 * @returns {Promise<object>} - The confirmation response from the API.
 */
export const clearAllHistories = async () => {
  const response = await legalMateClient.delete('/chat/history/all');
  return response.data;
};