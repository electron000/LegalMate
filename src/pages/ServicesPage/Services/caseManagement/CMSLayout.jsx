import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users } from 'lucide-react';
import './CMSLayout.css';

const CMSLayout = () => {
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', path: '/case-management', icon: LayoutDashboard },
    { label: 'Clients & Cases', path: '/case-management/clients', icon: Users },
  ];

  return (
    <div className="cms-layout-container">
      <aside className="cms-sidebar">
        <Link to="/" className="sidebar-header">
          <img 
            src="/legal-logo.webp" 
            alt="LegalMate Logo" 
            className="cms-brand-logo" 
          />
          <div className="cms-brand-text">
            <h2 className="cms-brand-title">LegalMate</h2>
            <p className="cms-brand-subtitle">Case Management System</p>
          </div>
        </Link>
        
        {/* Navigation Tabs */}
        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${isActive ? 'active' : 'inactive'}`}
              >
                <item.icon size={18} />
                <span className="nav-label">{item.label}</span>
              </Link>
            );
          })}
          <div className="sidebar-illustration">
            <img 
              src="/LegalMate_A.webp" 
              alt="LegalMate Illustration" 
              className="illustration-img" 
            />
          </div>
        </nav>
        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="user-avatar">
              AJ
            </div>
            <div className="user-info">
              <span className="user-name">Arun Jyoti</span>
              <span className="user-role">Profile</span>
            </div>
          </div>
        </div>
      </aside>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default CMSLayout;