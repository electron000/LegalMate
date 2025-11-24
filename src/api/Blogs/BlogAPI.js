import { blogClient } from '../config';

// UPDATED: Accepts 'generate' (default false)
export const searchBlogsByTopic = async (topic, generate = false) => {
  try {
    const response = await blogClient.post('/search', { topic, generate });
    return response.data.blogs || [];
  } catch (error) {
    console.error(`Error searching blogs for topic "${topic}":`, error);
    return [];
  }
};

// UPDATED: Accepts 'generate' (default false)
export const searchAllCategories = async (categories, generate = false) => {
  try {
    const response = await blogClient.post('/search-all', { categories, generate });
    return response.data || {};
  } catch (error) {
    console.error("Error fetching blogs for all categories:", error);
    return {};
  }
};

// UPDATED: Accepts 'generate' (default true)
export const fetchMoreBlogs = async (topic, existing_titles = [], generate = true) => {
  try {
    const response = await blogClient.post('/more', { 
      topic, 
      existing_titles, 
      generate 
    });
    return response.data.blogs || [];
  } catch (error) {
    // Note: Axios wraps the response in error.response
    if (error.message.includes('400')) {
       console.error("Backend Validation Error (400)");
    }
    console.error(`Error fetching more blogs for topic "${topic}":`, error);
    return [];
  }
};

export const fetchBlogById = async (blogId) => {
  try {
    const response = await blogClient.get(`/blog/${blogId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching blog with ID "${blogId}":`, error);
    return null;
  }
};