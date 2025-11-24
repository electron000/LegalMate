import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './NavbarCenter.css'; 

const NavbarCenter = ({ isNavbarActive, navLinks }) => {
    const location = useLocation();

    return (
        <div className={`desktop-nav-fixed-wrapper ${isNavbarActive ? 'scrolled' : ''}`}>
            <div className="desktop-nav">
                {navLinks.map((link, index) => {
                    const isActive = link.url === '/' 
                        ? location.pathname === '/'
                        : location.pathname.startsWith(link.url);

                    return (
                        <Link 
                            key={index} 
                            to={link.url} 
                            className={`nav-link ${isActive ? 'active' : ''}`}
                        >
                            {link.label}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default NavbarCenter;