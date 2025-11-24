// src/api/DocGen/DocGenAPI.js
import { docGenClient } from '../config';

/**
 * A completely generic service. 
 * It doesn't know about "Wills" or "MFA". 
 * It just knows how to POST to a URL.
 */
export const DocGenService = {
  /**
   * @param {string} endpoint - The URL from toolConfig.api.preview
   * @param {object} formData - The user input
   */
  getPreview: async (endpoint, formData) => {
    if (!endpoint) throw new Error("Preview endpoint not defined in tool config.");
    
    // Calls: docGenClient.post('/docs/will_generator', data)
    const response = await docGenClient.post(endpoint, formData);
    return response.data.data; 
  },

  /**
   * @param {string} endpoint - The URL from toolConfig.api.download
   * @param {object} formData - The user input
   */
  getDownload: async (endpoint, formData) => {
    if (!endpoint) throw new Error("Download endpoint not defined in tool config.");

    const response = await docGenClient.post(endpoint, formData, {
      responseType: 'blob',
    });
    return response.data;
  }
};

// Re-export the helper
export function downloadBlob(blob, filename) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => window.URL.revokeObjectURL(url), 5000);
}