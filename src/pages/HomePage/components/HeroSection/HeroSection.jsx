import React, { useState } from 'react';
import './HeroSection.css';

const HeroSection = () => {
  const [inputValue, setInputValue] = useState('');

  const handleSearch = () => {
    if (inputValue.trim()) {
      const targetUrl = `/legalmate-ai/?query=${encodeURIComponent(inputValue)}`;
      window.location.href = targetUrl;
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <section className="hero-section">
      <div className="hero-overlay"></div>

      <div className="hero-content-container">
        <div className="hero-text">
          <h1>
            <span className="hero-title-main">Navigate Law with AI</span>
          </h1>
          <div className="hero-search-wrapper">
            <div className="hero-search-box">
              <input 
                type="text" 
                className="hero-search-input" 
                placeholder="Ask LegalMate" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button className="hero-search-btn" onClick={handleSearch} aria-label="Send">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="hero-wave-separator">
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="shape-fill"></path>
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;