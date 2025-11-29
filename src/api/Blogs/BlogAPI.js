import { blogClient } from '../config';

/**
 * Fetches ALL blogs from the backend in a single request.
 * The backend no longer handles filtering or searching.
 */
export const fetchAllBlogs = async () => {
  try {
    const response = await blogClient.get('/all-blogs');
    return response.data.blogs || [];
  } catch (error) {
    console.error("Error fetching all blogs:", error);
    return [];
  }
};