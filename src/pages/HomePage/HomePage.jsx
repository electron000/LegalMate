import React, { useState, useEffect, useRef } from 'react';
import './HomePage.css';

// Components
import HeroSection from './components/HeroSection/HeroSection.jsx';
import BlogsSection from './components/BlogsSection/BlogsSection.jsx';
import PlatformHighlights from './components/PlatformHighlights/PlatformHighlights.jsx';
import AboutPage from '../AboutPage/AboutPage.jsx'; 

// API Functions
import { searchBlogsByTopic, fetchMoreBlogs } from '../../api';

// --- Internal Helper Component for Scroll Animation ---
const RevealSection = ({ children, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 } // Trigger when 10% visible
    );

    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) observer.unobserve(element);
    };
  }, []);

  return (
    <div 
      ref={ref} 
      className={`reveal-section ${isVisible ? 'is-visible' : ''}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const HomePage = () => {
  const [trendingBlogs, setTrendingBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const checkGenerationAllowed = () => {
    const lastGenTime = localStorage.getItem('lastBlogGenerationTime');
    if (!lastGenTime) return true; 
    
    const now = Date.now();
    const twentyFourHours = 24 * 60 * 60 * 1000;
    return (now - parseInt(lastGenTime)) > twentyFourHours;
  };

  const updateGenerationTimestamp = () => {
    localStorage.setItem('lastBlogGenerationTime', Date.now().toString());
  };

  useEffect(() => {
    let isMounted = true;

    const fetchTrendingBlogs = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const shouldGenerate = checkGenerationAllowed();
        console.log("HomePage: Fetching Trending. Generation Allowed:", shouldGenerate);

        let currentBlogs = await searchBlogsByTopic("Trending", shouldGenerate);

        if (isMounted && currentBlogs && currentBlogs.length > 0) {
            setTrendingBlogs(currentBlogs);
            setIsLoading(false); 
        }

        const TARGET_COUNT = 12;
        const EXTRA_FETCHES = 2;

        for (let i = 0; i < EXTRA_FETCHES; i++) {
            if (!currentBlogs || currentBlogs.length >= TARGET_COUNT) break;
            const existingTitles = currentBlogs.map(b => b.title);
            const moreBlogs = await fetchMoreBlogs("Trending", existingTitles, shouldGenerate);
            if (!moreBlogs || moreBlogs.length === 0) break;
            currentBlogs = [...currentBlogs, ...moreBlogs];
            if (isMounted) {
                setTrendingBlogs(currentBlogs);
            }
        }

        if (isMounted) {
            if (shouldGenerate && currentBlogs && currentBlogs.length > 0) {
                updateGenerationTimestamp();
            }
            setIsLoading(false);
        }

      } catch (err) {
        console.error("Failed to fetch trending blogs:", err);
        if (isMounted) setError("Could not load trending blogs.");
        setIsLoading(false);
      }
    };

    fetchTrendingBlogs();

    return () => { isMounted = false; };
  }, []);

  return (
    <div className="homepage">
      <main>
        {/* 1. Hero Section */}
        <HeroSection />
        
        {/* 2. Platform Highlights */}
        <RevealSection>
            <PlatformHighlights />
        </RevealSection>

        {/* 3. About Page */}
        <RevealSection>
            <div id="about-section">
                <AboutPage />
            </div>
        </RevealSection>
        
        {/* 4. Blogs Section (Moved to Bottom) */}
        <RevealSection>
          <BlogsSection 
              blogs={trendingBlogs} 
              isLoading={isLoading} 
              error={error}
          />
        </RevealSection>
        
      </main>
    </div>
  );
};

export default HomePage;