import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import DOMPurify from 'dompurify';
import { 
  searchBlogsByTopic, 
  searchAllCategories, 
  fetchMoreBlogs 
} from '../../../api';
import legalLogo from '../../../assets/legal-logo.png';
import { useSearch } from '../../../contexts/SearchContext';
import './AllBlogsPage.css';

// --- Constants & Helpers ---
const thumbnailImages = [
  '/images/bloga.webp',
  '/images/blogb.webp',
  '/images/blogc.webp',
  '/images/blogd.webp'
];

const categories = [
    "All", "Trending", "Property Law", "Criminal Law", "Corporate Law", 
    "Family Law", "Constitutional Law", "Tax Law", "Cyber Law"
];

const subCategories = categories.filter(c => c !== "All" && c !== "Trending");

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
  const [blogsByCategory, setBlogsByCategory] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState({}); 
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All"); 
  
  const { setSearchQuery } = useSearch();
  const navigate = useNavigate();

  // Helper: Rate limiting logic
  const checkGenerationAllowed = () => {
    const lastGenTime = localStorage.getItem('lastBlogGenerationTime');
    if (!lastGenTime) return true; 
    const now = Date.now();
    return (now - parseInt(lastGenTime)) > (24 * 60 * 60 * 1000);
  };

  const updateGenerationTimestamp = () => {
    localStorage.setItem('lastBlogGenerationTime', Date.now().toString());
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      setError(null);

      // Cache check
      if (activeCategory === "All" && Object.keys(blogsByCategory).length > 2) {
        setLoading(false);
        return;
      }
      if (activeCategory !== "All" && blogsByCategory[activeCategory]) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        if (activeCategory === "All") {
          const allBlogs = await searchAllCategories(subCategories, false);
          setBlogsByCategory(prev => ({ ...prev, ...allBlogs }));
        } else {
          const singleCategoryBlogs = await searchBlogsByTopic(activeCategory, false);
          setBlogsByCategory(prev => ({ ...prev, [activeCategory]: singleCategoryBlogs || [] }));
        }
      } catch (err) {
        setError("Failed to fetch blogs. The AI might be busy, please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory]);

  const handleCategoryClick = (category) => {
    setSearchQuery(''); 
    setActiveCategory(category);
    navigate('/blogs'); 
  };

  const handleLoadMore = async (category) => {
    setLoadingMore(prev => ({ ...prev, [category]: true }));
    const existingTitles = blogsByCategory[category]?.map(blog => blog.title) || [];
    
    try {
        let newBlogs = await fetchMoreBlogs(category, existingTitles, false);

        if (!newBlogs || newBlogs.length === 0) {
            const isStandardCategory = categories.includes(category);
            const allowGeneration = !isStandardCategory || checkGenerationAllowed();

            if (allowGeneration) {
                console.log(`Triggering generation for "${category}"...`);
                newBlogs = await fetchMoreBlogs(category, existingTitles, true);
                if (newBlogs?.length > 0 && isStandardCategory) {
                    updateGenerationTimestamp();
                }
            }
        }
        
        if (newBlogs?.length > 0) {
          setBlogsByCategory(prev => ({
            ...prev,
            [category]: [...(prev[category] || []), ...newBlogs]
          }));
        }
    } catch (err) {
        console.error("Error loading more", err);
    } finally {
        setLoadingMore(prev => ({ ...prev, [category]: false }));
    }
  };

  const getPreview = (content, maxLength = 300) => {
    if (!content) return '';
    const sanitized = DOMPurify.sanitize(content, { ALLOWED_TAGS: [], KEEP_CONTENT: true });
    return sanitized.length <= maxLength ? sanitized : sanitized.slice(0, maxLength).trim() + '…';
  };
  
  const handleCardClick = (blog) => {
    let trendingToSend = blogsByCategory['Trending'] || [];
    if (trendingToSend.length === 0) {
        trendingToSend = blogsByCategory['All'] || blogsByCategory[activeCategory] || [];
    }

    navigate(`/blogs/${blog.id}`, { 
        state: { blog, trendingBlogs: trendingToSend } 
    });
  };

  // Reusable Component for Cards
  const renderBlogCards = (blogs) => {
    if (blogs === null) {
      // Skeleton State
      return Array(3).fill(0).map((_, index) => (
        <div key={index} className="blog-card-skeleton">
          <div className="skeleton-thumbnail"></div>
          <div className="skeleton-text-container">
            <div className="skeleton-title"></div>
            <div className="skeleton-content"></div>
          </div>
        </div>
      ));
    }

    if (blogs.length === 0) {
        return (
            <div className="no-results-wrapper">
                <p className="no-blogs-message">No blogs found for "{activeCategory}".</p>
                <button className="back-to-feed-btn" onClick={() => handleCategoryClick("All")}>
                    View All Blogs
                </button>
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
            <p className="blog-card-preview">{getPreview(blog.content)}</p>
            <div className="blog-card-actions">
              <ArrowIcon id={numericId} />
            </div>
          </div>
        </div>
      );
    });
  };

  // Reusable Load More Button
  const LoadMoreBtn = ({ category }) => (
    <div className="load-more-container">
        <button 
            className="load-more-btn"
            onClick={() => handleLoadMore(category)}
            disabled={loadingMore[category]}
        >
            {loadingMore[category] ? <><Loader2 className="spinner" size={16} /> Loading...</> : `More on ${category}`}
        </button>
    </div>
  );

  const renderContent = () => {
    if (error) {
        return (
            <div className="no-results-wrapper">
                <p className="no-blogs-message error-message">{error}</p>
                 <button className="back-to-feed-btn" onClick={() => handleCategoryClick("All")}>Go Back</button>
            </div>
        );
    }

    // 1. Search Results / Single Category
    if (activeCategory !== "All") {
        return (
            <section className="category-section">
                { !categories.includes(activeCategory) && 
                   <h2 className="category-section-title">Search Results for: "{activeCategory}"</h2> 
                }
                <div className="blog-grid">
                    {loading ? renderBlogCards(null) : renderBlogCards(blogsByCategory[activeCategory] || [])}
                </div>
                {!loading && blogsByCategory[activeCategory]?.length > 0 && <LoadMoreBtn category={activeCategory} />}
            </section>
        );
    }

    // 2. All Categories (Feed)
    if (loading && Object.keys(blogsByCategory).length === 0) {
        return subCategories.slice(0, 3).map(category => (
            <section key={category} className="category-section">
                <h2 className="category-section-title">{category}</h2>
                <div className="blog-grid">{renderBlogCards(null)}</div>
            </section>
        ));
    }
      
    return Object.entries(blogsByCategory).map(([category, blogs]) => (
        <section key={category} className="category-section">
            <h2 className="category-section-title">{category}</h2>
            <div className="blog-grid">{renderBlogCards(blogs)}</div>
            <LoadMoreBtn category={category} />
        </section>
    ));
  };

  return (
    <div className="all-blogs-container">
      <div className="blogs-header-wrapper">
        <div className="blogs-header">
          <div className="title-with-logo">
            <img src={legalLogo} alt="LegalMate" className="page-logo" />
            <h1 className="blogs-title">
                {activeCategory === "All" ? "The Law Blog Feed" : `Blogs on: ${activeCategory}`}
            </h1>
          </div>
          <p className="blogs-subtitle">Stay updated with the latest in the legal world.</p>
        </div>

        <header className="blog-category-filters">
          {categories.map(category => (
            <button 
              key={category} 
              className={`category-button ${activeCategory === category ? 'active' : ''}`}
              onClick={() => handleCategoryClick(category)}
            >
              {category}
            </button>
          ))}
        </header>
      </div>
      
      <div className="blogs-content-wrapper">
        {renderContent()}
      </div>
    </div>
  );
};

export default AllBlogsPage;