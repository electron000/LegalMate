import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import DOMPurify from 'dompurify';
import './BlogsSection.css';

const thumbnailImages = [
  '/images/bloga.webp',
  '/images/blogb.webp',
  '/images/blogc.webp',
  '/images/blogd.webp'
];

// === UPDATED FUNCTION BELOW ===
const getPreview = (content, maxLength = 200) => {
  if (!content) return '';
  
  // 1. Regex to remove lines starting with '# ' (Markdown headers)
  const cleanContent = content.replace(/^#\s+.*$/gm, '');

  // 2. Sanitize HTML
  const sanitized = DOMPurify.sanitize(cleanContent, { ALLOWED_TAGS: [], KEEP_CONTENT: true });
  
  // 3. Trim whitespace
  const trimmed = sanitized.trim();

  return trimmed.length <= maxLength ? trimmed : trimmed.slice(0, maxLength).trim() + '…';
};

const getNumericId = (id) => {
  if (!id) return 0;
  if (typeof id === 'number') return id;
  return id.toString().split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
};

const BlogCardSkeleton = () => (
    <div className="blog-marquee-card skeleton-card">
        <div className="skeleton-thumbnail"></div>
        <div className="blog-card-content">
            <div className="skeleton-title"></div>
            <div className="skeleton-text"></div>
        </div>
    </div>
);

const BlogMarqueeCard = ({ blog, index }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/blogs/${blog.id}`, { state: { blog } });
  };

  const numericId = getNumericId(blog.id || index);
  const imageIndex = numericId % thumbnailImages.length;
  
  const xOffset = (numericId * 30) % 900;
  const yOffset = (numericId * 50) % 700;

  return (
    <div className="blog-marquee-card" onClick={handleClick}>
      <div
        className="blog-card-thumbnail"
        style={{
          backgroundImage: `url(${thumbnailImages[imageIndex]})`,
          backgroundPosition: `-${xOffset}px -${yOffset}px`
        }}
      ></div>
      <div className="blog-card-content">
        <h3 className="blog-card-title">{blog.title}</h3>
        {/* Preview is now cleaned of the # Title */}
        <p className="blog-card-preview">{getPreview(blog.content)}</p>
        
        <div className="blog-card-actions">
           <div className="simple-action-btn">
             <ArrowRight size={20} />
           </div>
        </div>
      </div>
    </div>
  );
};

const BlogsSection = ({ blogs, isLoading }) => {
  const navigate = useNavigate();
  const marqueeRef = useRef(null); 
  const [isHovering, setIsHovering] = useState(false);

  // Duplicate the list to create a seamless infinite loop
  const displayItems = isLoading 
    ? Array(4).fill(null) 
    : (blogs && blogs.length > 0 ? [...blogs, ...blogs] : []);

  useEffect(() => {
    if (isLoading || !marqueeRef.current || displayItems.length === 0) return;

    const marquee = marqueeRef.current;
    let animationFrameId;

    const animateScroll = () => {
      if (!isHovering) {
        // Continuous scroll from Right to Left
        marquee.scrollLeft += 1; 
        
        // Seamless loop reset
        if (marquee.scrollLeft >= marquee.scrollWidth / 2) {
          marquee.scrollLeft = 0;
        }
      }
      animationFrameId = requestAnimationFrame(animateScroll);
    };

    animationFrameId = requestAnimationFrame(animateScroll);
    return () => cancelAnimationFrame(animationFrameId);

  }, [isHovering, isLoading, displayItems.length]);

  if (!isLoading && displayItems.length === 0) return null;

  return (
    <section className="blogs-section-container">
      <div className="blogs-section-header">
        <h2 className="blogs-section-title">All Legal Insights</h2>
        <button
          className="blogs-view-more-btn"
          onClick={() => navigate('/blogs')}
        >
          <span>View Page</span>
          <ArrowRight size={16} />
        </button>
      </div>

      <div
        className="blogs-marquee-wrapper"
        ref={marqueeRef}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div className="blogs-marquee-content">
          {displayItems.map((item, index) => {
            if (item === null) return <BlogCardSkeleton key={`skel-${index}`} />;
            
            return (
                <BlogMarqueeCard 
                    key={`${item.id}-${index}`} 
                    blog={item} 
                    index={index} 
                />
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BlogsSection;