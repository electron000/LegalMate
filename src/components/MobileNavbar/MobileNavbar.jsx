import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ArrowRight } from 'lucide-react';
// Adjust this path if your assets folder is located differently
import logo from '../../assets/legal-logo.png';
import './MobileNavbar.css';

const MOBILE_LINKS = [
    { label: 'Tools', url: '/tools' },
    { label: 'Services', url: '/services' },
    { label: 'Blogs', url: '/blogs' },
];

const MobileNavbar = ({ onContactClick }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const menuRef = useRef(null);
    const navigate = useNavigate();

    // Handle Scroll Effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target) && !event.target.closest('.btn-menu-circle')) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleLinkClick = (path) => {
        setIsOpen(false);
        navigate(path);
    };

    const handleContactClick = () => {
        setIsOpen(false);
        if (onContactClick) {
            onContactClick();
        } else {
            navigate('/contact');
        }
    };

    return (
        <>
            {/* --- The Floating Pill Navbar --- */}
            <nav className={`mobile-nav-pill ${scrolled ? 'scrolled' : ''}`}>
                
                {/* 1. Left: Brand */}
                <Link to="/" className="mobile-brand" onClick={() => setIsOpen(false)}>
                    <img src={logo} alt="LegalMate" className="mobile-logo-img" />
                    <span className="mobile-logo-text">LEGALMATE</span>
                </Link>

                {/* 2. Right: Actions */}
                <div className="mobile-actions-container">
                    {/* Contact Button (Pill shape) */}
                    <button 
                        className="btn-contact-pill" 
                        onClick={handleContactClick}
                    >
                        Contact
                    </button>

                    {/* Menu Toggle (Circle shape) */}
                    <button 
                        className={`btn-menu-circle ${isOpen ? 'active' : ''}`}
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label={isOpen ? "Close menu" : "Open menu"}
                    >
                        {isOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </nav>

            {/* --- Pop-up Menu (Floating Card) --- */}
            <div ref={menuRef} className={`mobile-popup-menu ${isOpen ? 'active' : ''}`}>
                <div className="menu-links-list">
                    {MOBILE_LINKS.map((link) => (
                        <div 
                            key={link.url} 
                            className="menu-link-item"
                            onClick={() => handleLinkClick(link.url)}
                        >
                            <span className="link-label">{link.label}</span>
                            <ArrowRight size={16} className="link-arrow" />
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Optional: Transparent invisible layer to catch clicks if needed, 
                but handleClickOutside handles it better for popups */}
        </>
    );
};

export default MobileNavbar;