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
      {/* CMS Sidebar (Becomes Header on Mobile) */}
      <aside className="cms-sidebar">
        <div className="sidebar-header">
          <img 
            src="/legal-logo.webp" 
            alt="LegalMate Logo" 
            className="brand-logo" 
          />
          <div className="brand-text">
            <h2 className="brand-title">LegalMate</h2>
            <p className="brand-subtitle">Case Management System</p>
          </div>
        </div>
        
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

          {/* Illustration - Hidden on Mobile */}
          <div className="sidebar-illustration">
            <img 
              src="/LegalMate_A.webp" 
              alt="LegalMate Illustration" 
              className="illustration-img" 
            />
          </div>
        </nav>

        {/* User Profile - Top Right on Mobile */}
        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="user-avatar">
              AJ
            </div>
            {/* User Info text hidden on mobile to show just the icon */}
            <div className="user-info">
              <span className="user-name">Arun Jyoti</span>
              <span className="user-role">Profile</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default CMSLayout;