import React, { useState } from 'react';
import './authpage.css';
import { FaLinkedin, FaGoogle, FaMicrosoft, FaUser, FaScaleUnbalanced } from 'react-icons/fa6';
// Images moved to public folder and converted to webp
const loginImage = '/LegalMate_B.webp';
const registerImage = '/LegalMate_A.webp';

const AuthPage = () => {
  // --- UI State Only (For toggling views) ---
  const [isSignUpActive, setIsSignUpActive] = useState(false);
  const [role, setRole] = useState('citizen'); // 'citizen' | 'practitioner'

  // --- Handlers (UI Only) ---
  const handleSignUpClick = () => {
    setIsSignUpActive(true);
  };
  
  const handleLoginClick = () => {
    setIsSignUpActive(false);
  };

  const handleRoleChange = (newRole) => {
    setRole(newRole);
  };
  
  // Static submit handler - does nothing
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Static form submitted");
  };
  
  const socialLinks = [
    { Icon: FaGoogle, name: 'Google' },
    { Icon: FaMicrosoft, name: 'Microsoft' },
    { Icon: FaLinkedin, name: 'LinkedIn' },
  ];

  // Role Toggle Component
  const RoleSelector = () => (
    <div className="role-selector-wrapper">
      <div className="role-selector">
        <button 
          type="button"
          className={`role-btn ${role === 'citizen' ? 'active' : ''}`}
          onClick={() => handleRoleChange('citizen')}
        >
          <FaUser className="role-icon" /> Citizen
        </button>
        <button 
          type="button"
          className={`role-btn ${role === 'practitioner' ? 'active' : ''}`}
          onClick={() => handleRoleChange('practitioner')}
        >
          <FaScaleUnbalanced className="role-icon" /> Legal Practitioner
        </button>
      </div>
    </div>
  );

  return (
    <div className={`authpage-container ${isSignUpActive ? 'sign-up-mode' : ''}`}>
      <div className="authpage-forms-container">
        <div className="authpage-signin-signup">
          
          {/* === Sign In Form === */}
          <form onSubmit={handleSubmit} className="authpage-sign-in-form">
            <RoleSelector />
            <h2 className="authpage-auth-title">
              {role === 'practitioner' ? 'Counsel Login' : 'Citizen Login'}
            </h2>
            
            <input
              type="email"
              placeholder={role === 'practitioner' ? "Work Email" : "Email Address"}
              className="input-field auth-input"
              autoComplete="username"
            />
            
            <input
              type="password"
              placeholder="Password"
              className="input-field auth-input"
              autoComplete="current-password"
            />
            
            <button type="submit" className="authpage-auth-btn">
              Login
            </button>
            
            <div className="social-login-section">
              <div className="social-login-text">Or continue with:</div>
              <div className="social-login-icons">
                {socialLinks.map((link) => (
                  <div
                    key={link.name}
                    className="social-login-link"
                    aria-label={link.name}
                  >
                    <link.Icon size={24} />
                  </div>
                ))}
              </div>
            </div>
          </form>
          
          {/* === Sign Up Form === */}
          <form onSubmit={handleSubmit} className="authpage-sign-up-form">
            <RoleSelector />
            <h2 className="authpage-auth-title">
              {role === 'practitioner' ? 'Join the Bar' : 'Create Account'}
            </h2>
            
            <input
              type="text"
              placeholder="Full Name"
              className="input-field auth-input"
            />

            {role === 'practitioner' && (
              <input
                type="text"
                placeholder="Bar Council ID / Enrollment No."
                className="input-field auth-input"
                title="e.g., MAH/1234/2023"
              />
            )}
            
            <input
              type="email"
              placeholder={role === 'practitioner' ? "Official Work Email" : "Email Address"}
              className="input-field auth-input"
              autoComplete="username"
            />
            
            <input
              type="password"
              placeholder="Create Password"
              className="input-field auth-input"
              autoComplete="new-password"
            />
            
            <input
              type="password"
              placeholder="Confirm Password"
              className="input-field auth-input"
              autoComplete="new-password"
            />

            <div className="terms-agreement">
              <input
                type="checkbox"
                id="terms"
              />
              <label htmlFor="terms">
                I agree to the <a href="#terms">Terms</a> and <a href="#privacy">Privacy Policy</a>.
              </label>
            </div>
            
            <button type="submit" className="authpage-auth-btn">
              Register
            </button>

          </form>
        </div>
      </div>

      <div className="authpage-panels-container">
        <div className="authpage-panel authpage-left-panel">
          <div className="authpage-content">
            <h2>{role === 'practitioner' ? 'Legal Excellence Awaits' : 'Empowering Citizens'}</h2>
            <p>
              {role === 'practitioner' 
                ? 'Register to access AI-driven legal research and case management tools.' 
                : 'Join us to find legal help, understand your rights, and connect with experts.'}
            </p>
            <button className="authpage-auth-btn authpage-transparent" onClick={handleSignUpClick}>
              Register
            </button>
          </div>
          <img src={registerImage} className="authpage-image-a" alt="Registration Illustration" />
        </div>
        <div className="authpage-panel authpage-right-panel">
          <div className="authpage-content">
            <h2>Welcome Back</h2>
            <p>Securely access your dashboard and continue your journey.</p>
            <button className="authpage-auth-btn authpage-transparent" onClick={handleLoginClick}>
               Login
            </button>
          </div>
          <img src={loginImage} className="authpage-image-b" alt="Login Illustration" />
        </div>
      </div>
    </div>
  );
};

export default AuthPage;