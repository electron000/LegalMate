import React, { useState, useEffect, useRef } from 'react';
import './HomePage.css';

// --- Fixed Imports ---
// Assuming these are siblings or check your folder structure
import BlogsSection from './components/BlogsSection/BlogsSection.jsx';
// If HeroSection/Highlights are missing, ensure they exist or comment them out
import HeroSection from './components/HeroSection/HeroSection.jsx';
import PlatformHighlights from './components/PlatformHighlights/PlatformHighlights.jsx';
import AboutPage from '../AboutPage/AboutPage.jsx'; 

// API - Adjusted path assumption
import { fetchAllBlogs } from '../../api'; 

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
      { threshold: 0.1 }
    );
    if (element) observer.observe(element);
    return () => { if (element) observer.unobserve(element); };
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
  const [loadingBlogs, setLoadingBlogs] = useState(true);
  
  // 1. Fetch Data ONCE here
  useEffect(() => {
    const loadData = async () => {
      setLoadingBlogs(true);
      try {
        const allBlogs = await fetchAllBlogs();
        // Take top 10 as trending
        setTrendingBlogs(allBlogs.slice(0, 10));
      } catch (error) {
        console.error("Home fetch error:", error);
      } finally {
        setLoadingBlogs(false);
      }
    };
    loadData();
  }, []);

  return (
    <div className="homepage">
      <main>
        <HeroSection />
        
        <RevealSection>
            <PlatformHighlights />
        </RevealSection>

        <RevealSection>
            <div id="about-section">
                <AboutPage />
            </div>
        </RevealSection>
        
        {/* 2. Pass Data Down to BlogsSection */}
        <RevealSection>
          <BlogsSection 
             blogs={trendingBlogs} 
             isLoading={loadingBlogs} 
          />
        </RevealSection>
      </main>
    </div>
  );
};

export default HomePage;