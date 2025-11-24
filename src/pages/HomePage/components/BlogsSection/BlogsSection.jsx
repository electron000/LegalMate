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

const getPreview = (content, maxLength = 200) => {
  if (!content) return '';
  const sanitized = DOMPurify.sanitize(content, { ALLOWED_TAGS: [], KEEP_CONTENT: true });
  return sanitized.length <= maxLength ? sanitized : sanitized.slice(0, maxLength).trim() + '…';
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
            <div className="skeleton-text short"></div>
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
  const selectedImage = thumbnailImages[imageIndex];
  const xOffset = (numericId * 30) % 900;
  const yOffset = (numericId * 50) % 700;
  const backgroundPosition = `-${xOffset}px -${yOffset}px`;

  const maskId = `mask0_home_${index}`;
  const clipId = `clip0_home_${index}`;

  return (
    <div className="blog-marquee-card" onClick={handleClick}>
      <div
        className="blog-card-thumbnail"
        style={{
          backgroundImage: `url(${selectedImage})`,
          backgroundPosition: backgroundPosition
        }}
      ></div>
      <div className="blog-card-content">
        <h3 className="blog-card-title">{blog.title}</h3>
        <p className="blog-card-preview">{getPreview(blog.content)}</p>
        
        <div className="blog-card-actions">
           {/* SVG Icon */}
           <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none" className="ts-go-to-icon">
              <g clipPath={`url(#${clipId})`}>
                  <path d="M19.9092 39.9371C30.5962 39.9371 39.2598 31.2146 39.2598 20.4549C39.2598 9.69515 30.5962 0.972656 19.9092 0.972656C9.22215 0.972656 0.558594 9.69515 0.558594 20.4549C0.558594 31.2146 9.22215 39.9371 19.9092 39.9371Z" />
                  <mask id={maskId} style={{maskType: 'luminance'}} maskUnits="userSpaceOnUse" x="13" y="14" width="14" height="13">
                      <path d="M26.2219 26.8105H13.5947V14.0974H26.2219V26.8105Z" fill="white"/>
                  </mask>
                  <g mask={`url(#${maskId})`}>
                      <path d="M14.4717 25.9299C14.8232 26.2839 15.3932 26.2839 15.7447 25.9299L25.9468 15.6585C26.2984 15.3045 26.2984 14.7307 25.9468 14.3768C25.5953 14.0228 25.0253 14.0228 24.6737 14.3768L14.4717 24.6482C14.1201 25.0021 14.1201 25.576 14.4717 25.9299Z" fill="white"/>
                      <path d="M25.3098 26.7987C25.8069 26.7987 26.2099 26.3929 26.2099 25.8924V15.0167C26.2099 14.5161 25.8069 14.1104 25.3098 14.1104H14.5075C14.0104 14.5161 13.6074 14.0104 13.6074 15.0167C13.6074 15.5173 14.0104 15.923 14.5075 15.923H24.4096V25.8924C24.4096 26.3929 24.8125 26.7987 25.3098 26.7987Z" fill="white"/>
                  </g>
              </g>
              <defs>
                  <clipPath id={clipId}><rect width="40" height="40" fill="white"/></clipPath>
              </defs>
          </svg>
        </div>
      </div>
    </div>
  );
};

const BlogsSection = ({ blogs = [], isLoading = false, error = null }) => {
  const navigate = useNavigate();
  const marqueeRef = useRef(null); 
  const [isHovering, setIsHovering] = useState(false);

  const displayItems = isLoading 
    ? Array(4).fill(null) 
    : [...blogs, ...blogs]; 

  useEffect(() => {
    if (isLoading || error || !marqueeRef.current) return;

    const marquee = marqueeRef.current;
    let animationFrameId;

    const animateScroll = () => {
      if (!isHovering) {
        const halfScrollWidth = marquee.scrollWidth / 2;
        marquee.scrollLeft += 0.5; 

        if (marquee.scrollLeft >= halfScrollWidth) {
          marquee.scrollLeft = 0;
        }
      }
      animationFrameId = requestAnimationFrame(animateScroll);
    };

    animationFrameId = requestAnimationFrame(animateScroll);
    return () => cancelAnimationFrame(animationFrameId);

  }, [isHovering, isLoading, error, blogs]);

  if (error) return null;
  if (!isLoading && (!blogs || blogs.length === 0)) return null;

  return (
    <section className="blogs-section-container">
      <div className="blogs-section-header">
        <h2 className="blogs-section-title">Trending Now</h2>
        <button
          className="blogs-view-more-btn"
          onClick={() => navigate('/blogs?q=Trending')}
        >
          <span>View All</span>
          <ArrowRight size={16} />
        </button>
      </div>

      <div
        className="blogs-marquee-wrapper"
        ref={marqueeRef}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        style={{ cursor: isLoading ? 'default' : 'grab' }}
      >
        <div className="blogs-marquee-content">
          {displayItems.map((item, index) => {
            if (item === null) {
                return <BlogCardSkeleton key={`skeleton-${index}`} />;
            }
            return <BlogMarqueeCard key={`${item.id}-${index}`} blog={item} index={index} />;
          })}
        </div>
      </div>
    </section>
  );
};

export default BlogsSection;