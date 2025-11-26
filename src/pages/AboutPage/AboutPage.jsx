import React from 'react';
import { Scale, Zap, Bot, FileText, Search, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './AboutPage.css';

const AboutPage = () => {
  const navigate = useNavigate(); 

  const handleNavigate = () => {
    navigate('/tools');
  };

  return (
    <div className="about-page-container">
      
      {/* --- HERO SECTION --- */}
      <div className="about-hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-wave-shape">
          <svg viewBox="0 0 1440 600" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
            <path d="M0 0H600C600 0 850 50 900 300C950 550 1440 400 1440 400V0H0Z" fill="white" />
          </svg>
        </div>

        <div className="hero-content-wrapper">
          <h1 className="hero-main-title">Bridging the Gap Between Justice and People</h1>
          <p className="hero-subtitle">
            We believe that understanding the law shouldn’t be a privilege—it should be a fundamental right.
          </p>
          <div className="hero-section-header">
            <h2>Who We Are</h2>
            <p>
              LegalMate is India's first comprehensive AI-powered legal ecosystem. We combine advanced 
              Large Language Models (LLMs) with deep legal expertise to serve as your digital ally. 
              Whether you are a citizen needing to draft a will or a lawyer researching case law, 
              we provide the tools to do it efficiently.
            </p>
          </div>
        </div>

        <div className="hero-wave-bottom">
          <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="shape-fill"></path>
          </svg>
        </div>
      </div>

      {/* --- MISSION & VISION --- */}
      <section className="mission-vision-section">
        <div className="mission-vision-row">
          <div className="mv-block">
            <div className="mv-icon">
              <Scale size={32} />
            </div>
            <h3>Our Mission</h3>
            <p>
              To solve the "access to justice" problem by replacing complex jargon with plain English 
              and expensive processes with instant AI automation.
            </p>
          </div>

          <div className="mv-separator"></div>

          <div className="mv-block">
            <div className="mv-icon">
              <Zap size={32} />
            </div>
            <h3>Our Vision</h3>
            <p>
              A future where legal assistance is affordable and error-free, empowering every Indian citizen 
              to navigate the legal system with confidence.
            </p>
          </div>
        </div>
      </section>

      {/* --- WHAT WE DO --- */}
      <section className="features-section">
        <h2 className="section-title">What We Do</h2>
        <div className="features-grid">
          
          <div className="feature-card">
            <div className="feature-header">
              <div className="feature-icon-wrapper"><Bot size={24} /></div>
              <h4>Dual AI System</h4>
            </div>
            <p>
              Two distinct AI brains: A <strong>Legal Companion</strong> for citizens to explain rights simply, 
              and a <strong>Research Engine</strong> for practitioners to cite case laws and statutes.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-header">
              <div className="feature-icon-wrapper"><FileText size={24} /></div>
              <h4>Smart Drafting</h4>
            </div>
            <p>
              Forget expensive draftsmen. Generate 15+ essential legal documents—from Wills to Rental Agreements—in 
              just two steps, ready for download.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-header">
              <div className="feature-icon-wrapper"><Search size={24} /></div>
              <h4>Intelligent Analysis</h4>
            </div>
            <p>
              Upload complex contracts to our <strong>Document Analyzer</strong>. It summarizes fine print 
              and highlights potential risks or key clauses instantly.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-header">
              <div className="feature-icon-wrapper"><BookOpen size={24} /></div>
              <h4>Knowledge Hub</h4>
            </div>
            <p>
              Stay informed with our AI-powered blog feed that curates legal news and Supreme Court rulings, 
              ensuring you never miss an update.
            </p>
          </div>

        </div>
      </section>

      {/* --- ROOTS / ORIGIN --- */}
      <section className="roots-section">
        <div className="roots-content">
          <h3>Our Roots</h3>
          <p>
            AI LegalMate is a product of innovation from <strong>Dhemaji Engineering College</strong>. 
            Built by a dedicated team of Computer Science engineers, we are committed to building a future 
            where law is not a barrier, but a bridge to a better society.
          </p>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <div className="about-content-wrapper">
        <div className="about-cta-section" onClick={handleNavigate}>
          
          <div className="cta-text-content">
            <h2>Ready to Explore Our Platform?</h2>
            <p>Experience the future of legal tech today.</p>
          </div>

          <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="40" 
              height="40" 
              viewBox="0 0 40 40" 
              fill="none" 
              className="ts-go-to-icon" 
          >
              <g clipPath="url(#clip0_2043_14627)">
                  <path d="M19.9092 39.9371C30.5962 39.9371 39.2598 31.2146 39.2598 20.4549C39.2598 9.69515 30.5962 0.972656 19.9092 0.972656C9.22215 0.972656 0.558594 9.69515 0.558594 20.4549C0.558594 31.2146 9.22215 39.9371 19.9092 39.9371Z" />
                  <mask id="mask0_2043_14627" style={{maskType: 'luminance'}} maskUnits="userSpaceOnUse" x="13" y="14" width="14" height="13">
                      <path d="M26.2219 26.8105H13.5947V14.0974H26.2219V26.8105Z" fill="white"/>
                  </mask>
                  <g mask="url(#mask0_2043_14627)">
                      <path d="M14.4717 25.9299C14.8232 26.2839 15.3932 26.2839 15.7447 25.9299L25.9468 15.6585C26.2984 15.3045 26.2984 14.7307 25.9468 14.3768C25.5953 14.0228 25.0253 14.0228 24.6737 14.3768L14.4717 24.6482C14.1201 25.0021 14.1201 25.576 14.4717 25.9299Z" fill="white"/>
                      <path d="M25.3098 26.7987C25.8069 26.7987 26.2099 26.3929 26.2099 25.8924V15.0167C26.2099 14.5161 25.8069 14.1104 25.3098 14.1104H14.5075C14.0104 14.5161 13.6074 14.0104 13.6074 15.0167C13.6074 15.5173 14.0104 15.923 14.5075 15.923H24.4096V25.8924C24.4096 26.3929 24.8125 26.7987 25.3098 26.7987Z" fill="white"/>
                  </g>
              </g>
              <defs>
                  <clipPath id="clip0_2043_14627">
                      <rect width="40" height="40" fill="white"/>
                  </clipPath>
              </defs>
          </svg>
          
        </div>
      </div>

    </div>
  );
};

export default AboutPage;