import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { fetchAllBlogs } from '../../../api';
import './AllBlogsPage.css';

// --- Constants & Helpers ---
const thumbnailImages = [
  '/images/bloga.webp',
  '/images/blogb.webp',
  '/images/blogc.webp',
  '/images/blogd.webp'
];

const getNumericId = (id) => {
  if (!id) return 0;
  if (typeof id === 'number') return id;
  return id.toString().split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
};

// Extracted Icon Component
const ArrowIcon = ({ id }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none" className="ts-go-to-icon">
    <g clipPath="url(#clip0_ts_icon)">
      <path d="M19.9092 39.9371C30.5962 39.9371 39.2598 31.2146 39.2598 20.4549C39.2598 9.69515 30.5962 0.972656 19.9092 0.972656C9.22215 0.972656 0.558594 9.69515 0.558594 20.4549C0.558594 31.2146 9.22215 39.9371 19.9092 39.9371Z" fill="#1A1A1A" />
      <mask id={`mask0_ts_icon_${id}`} style={{maskType: 'luminance'}} maskUnits="userSpaceOnUse" x="13" y="14" width="14" height="13">
        <path d="M26.2219 26.8105H13.5947V14.0974H26.2219V26.8105Z" fill="white"/>
      </mask>
      <g mask={`url(#mask0_ts_icon_${id})`}>
        <path d="M14.4717 25.9299C14.8232 26.2839 15.3932 26.2839 15.7447 25.9299L25.9468 15.6585C26.2984 15.3045 26.2984 14.7307 25.9468 14.3768C25.5953 14.0228 25.0253 14.0228 24.6737 14.3768L14.4717 24.6482C14.1201 25.0021 14.1201 25.576 14.4717 25.9299Z" fill="white"/>
        <path d="M25.3098 26.7987C25.8069 26.7987 26.2099 26.3929 26.2099 25.8924V15.0167C26.2099 14.5161 25.8069 14.1104 25.3098 14.1104H14.5075C14.0104 14.5161 13.6074 14.0104 13.6074 15.0167C13.6074 15.5173 14.0104 15.923 14.5075 15.923H24.4096V25.8924C24.4096 26.3929 24.8125 26.7987 25.3098 26.7987Z" fill="white"/>
      </g>
    </g>
    <defs>
      <clipPath id="clip0_ts_icon">
        <rect width="40" height="40" fill="white"/>
      </clipPath>
    </defs>
  </svg>
);

const AllBlogsPage = () => {
  const [allBlogs, setAllBlogs] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      try {
        const blogs = await fetchAllBlogs();
        setAllBlogs(blogs);
      } catch (err) {
        setError("Failed to fetch blogs.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadAllData();
  }, []);

  // === UPDATED FUNCTION BELOW ===
  const getPreview = (content, maxLength = 300) => {
    if (!content) return '';
    
    // 1. Regex to remove lines starting with '# ' (Markdown headers)
    const cleanContent = content.replace(/^#\s+.*$/gm, '');

    // 2. Sanitize HTML
    const sanitized = DOMPurify.sanitize(cleanContent, { ALLOWED_TAGS: [], KEEP_CONTENT: true });
    
    // 3. Trim whitespace
    const trimmed = sanitized.trim();

    return trimmed.length <= maxLength ? trimmed : trimmed.slice(0, maxLength).trim() + '…';
  };
  
  const handleCardClick = (blog) => {
    const trendingSubset = allBlogs.slice(0, 8); 
    
    navigate(`/blogs/${blog.id}`, { 
        state: { 
            blog, 
            trendingBlogs: trendingSubset,
            allBlogsContext: allBlogs 
        } 
    });
  };

  const renderBlogCards = (blogs) => {
    if (loading) {
      return Array(6).fill(0).map((_, index) => (
        <div key={index} className="blog-card-skeleton">
          <div className="skeleton-thumbnail"></div>
          <div className="skeleton-text-container">
            <div className="skeleton-title"></div>
            <div className="skeleton-content"></div>
          </div>
        </div>
      ));
    }

    if (!blogs || blogs.length === 0) {
        return (
            <div className="no-results-wrapper">
                <p className="no-blogs-message">No blogs available.</p>
            </div>
        );
    }

    return blogs.map((blog, index) => {
      const numericId = getNumericId(blog.id || index);
      const imageIndex = numericId % thumbnailImages.length;
      const xOffset = (numericId * 30) % 900;
      const yOffset = (numericId * 50) % 700;

      return (
        <div key={`${blog.id || index}-${index}`} className="blog-card" onClick={() => handleCardClick(blog)}>
          <div 
            className="blog-card-thumbnail"
            style={{ 
              backgroundImage: `url(${thumbnailImages[imageIndex]})`,
              backgroundPosition: `-${xOffset}px -${yOffset}px` 
            }}
          ></div>
          
          <div className="blog-card-content">
            <h3 className="blog-card-title">{blog.title}</h3>
            {/* The preview will now be clean of the # Title */}
            <p className="blog-card-preview">{getPreview(blog.content)}</p>
            <div className="blog-card-actions">
              <ArrowIcon id={numericId} />
            </div>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="all-blogs-container">
      <div className="blogs-header-wrapper">
        <div className="blogs-header">
          <div className="title-with-logo">
            <img 
                src="/legal-logo.webp" 
                alt="LegalMate" 
                className="page-logo"
                onError={(e) => e.target.style.display = 'none'} 
            />
            <h1 className="blogs-title">Blog Feed</h1>
          </div>
          <p className="blogs-subtitle">Stay updated with the Latest in the Legal World.</p>
        </div>
      </div>
      
      <div className="blogs-content-wrapper">
        {error ? (
             <div className="no-results-wrapper">
                <p className="error-message">{error}</p>
            </div>
        ) : (
             <section className="category-section">
                <div className="blog-grid">
                    {renderBlogCards(allBlogs)}
                </div>
            </section>
        )}
      </div>
    </div>
  );
};

export default AllBlogsPage;