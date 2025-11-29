import React from 'react';
import './TSPage.css';

// Helper to generate unique IDs for SVG masks to prevent conflicts
const getSafeId = (str) => {
  return str ? str.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase() : 'default';
};

// Extracted Arrow Icon Component
const TSGoToIcon = ({ uniqueId, 'aria-label': ariaLabel }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="40" 
    height="40" 
    viewBox="0 0 40 40" 
    fill="none" 
    className="ts-go-to-icon"
    aria-label={ariaLabel}
  >
    <g clipPath="url(#clip0_ts_icon)">
      <path d="M19.9092 39.9371C30.5962 39.9371 39.2598 31.2146 39.2598 20.4549C39.2598 9.69515 30.5962 0.972656 19.9092 0.972656C9.22215 0.972656 0.558594 9.69515 0.558594 20.4549C0.558594 31.2146 9.22215 39.9371 19.9092 39.9371Z" />
      <mask id={`mask0_ts_icon_${uniqueId}`} style={{maskType: 'luminance'}} maskUnits="userSpaceOnUse" x="13" y="14" width="14" height="13">
        <path d="M26.2219 26.8105H13.5947V14.0974H26.2219V26.8105Z" fill="white"/>
      </mask>
      <g mask={`url(#mask0_ts_icon_${uniqueId})`}>
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

export const TSListItem = ({ name, skills, icon: IconComponent, onClick }) => {
  const uniqueId = getSafeId(name);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div 
      className="ts-card"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div className="ts-card-icon-wrapper"> 
        {React.createElement(IconComponent, { 
          size: window.innerWidth < 768 ? 20 : 24,
          'aria-hidden': true 
        })}
      </div>

      <div className="ts-card-content">
        <h3>{name}</h3>
        {skills && skills.length > 0 && (
          <div className="ts-skill-pills">
            {skills.map((skill, idx) => (
              <span key={idx} className="ts-skill-pill">{skill}</span>
            ))}
          </div>
        )}
      </div>
      
      <TSGoToIcon aria-label={`Open ${name}`} uniqueId={uniqueId} />
    </div>
  );
};

export const TSPage = ({ title, subtitle, children }) => {
  return (
    <div className="ts-page">
      <div className="ts-header-section">
        <div className="ts-title-container">
          {/* Updated to use public folder logo */}
          <img 
            src="/legal-logo.webp" 
            alt="LegalMate" 
            className="ts-page-logo"
            onError={(e) => e.target.style.display = 'none'} 
          />
          <h1 className="ts-page-title">{title}</h1>
        </div>
        <p className="ts-page-subtitle">{subtitle}</p>
      </div>
      
      <div className="ts-content-section">
        <div className="ts-grid">
          {children}
        </div>
      </div>
    </div>
  );
};

export default TSPage;