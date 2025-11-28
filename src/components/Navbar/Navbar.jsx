import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSearch } from '../../contexts/SearchContext';
import { Search } from 'lucide-react'; // Removed Menu, X
import logo from '../../assets/legal-logo.png';
import './Navbar.css';

const NAV_LINKS = [
    { label: 'Home', url: '/' },
    { label: 'Tools', url: '/tools' },
    { label: 'Services', url: '/services' },
    { label: 'Blogs', url: '/blogs' },
];

const Navbar = () => {
    const [state, setState] = useState({
        searchOpen: false,
        scrolled: false
    });

    const searchRef = useRef(null);
    const inputRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();
    const { searchQuery, setSearchQuery } = useSearch();

    // -- Derived State --
    const showSearch = ['/tools', '/services', '/blogs'].some(path => location.pathname.startsWith(path));
    const isHomePage = location.pathname === '/';
    // Navbar is "active" (dark text/white bg) if not home OR if scrolled
    const isNavbarActive = !isHomePage || state.scrolled;

    // -- Helpers --
    const updateState = (updates) => setState(prev => ({ ...prev, ...updates }));
    
    const getPlaceholder = useCallback(() => {
        if (location.pathname.startsWith('/tools')) return 'Search tools...';
        if (location.pathname.startsWith('/services')) return 'Search services...';
        return 'Search blogs...';
    }, [location.pathname]);

    // -- Effects --
    useEffect(() => {
        const handleScroll = () => {
            const threshold = window.innerHeight * 0.7;
            updateState({ scrolled: window.scrollY > threshold });
        };
        
        const handleClickOutside = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                updateState({ searchOpen: false });
            }
        };

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                updateState({ searchOpen: false });
            }
        };

        window.addEventListener('scroll', handleScroll);
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    // Reset search on navigation/visibility change
    useEffect(() => {
        if (!showSearch) setSearchQuery('');
    }, [showSearch, setSearchQuery]);

    // Auto-focus search input when opened
    useEffect(() => {
        if (state.searchOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [state.searchOpen]);

    // -- Handlers --
    const handleSearchSubmit = (e) => {
        if ((e.type === 'keydown' && e.key !== 'Enter') || !searchQuery.trim()) return;
        e.preventDefault();

        const isLocalSearch = ['/tools', '/services'].some(p => location.pathname.startsWith(p));
        
        if (!isLocalSearch) {
            navigate(`/blogs?q=${encodeURIComponent(searchQuery)}`);
        }
        
        updateState({ searchOpen: false });
        inputRef.current?.blur();
    };

    return (
        <div className="desktop-navbar-wrapper">
            {/* 1. Main Navbar (Logo + Right Actions) */}
            <nav className={`navbar ${isNavbarActive ? 'scrolled' : ''}`}>
                {/* Brand */}
                <Link to="/" className="navbar-brand">
                    <img src={logo} alt="LegalMate" className="brand-logo" />
                    <span className="brand-text">LEGALMATE</span>
                </Link>

                {/* Right Actions */}
                <div className="navbar-right">
                    {/* Desktop Search */}
                    {showSearch && (
                        <div className={`desktop-search ${state.searchOpen ? 'active' : ''}`} ref={searchRef}>
                            <button 
                                className="icon-btn" 
                                onClick={() => updateState({ searchOpen: !state.searchOpen })}
                                aria-label="Search"
                            >
                                <Search size={22} />
                            </button>
                            <input
                                ref={state.searchOpen ? inputRef : null}
                                type="text"
                                className="search-input-desktop"
                                placeholder={getPlaceholder()}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleSearchSubmit}
                            />
                        </div>
                    )}
                </div>
            </nav>

            {/* 2. Floating Desktop Navigation (The Pill) */}
            <div className={`desktop-nav-pill-container ${isNavbarActive ? 'scrolled' : ''}`}>
                <div className="nav-pill">
                    {NAV_LINKS.map(link => {
                        const isActive = link.url === '/' 
                            ? location.pathname === '/' 
                            : location.pathname.startsWith(link.url);
                        return (
                            <Link key={link.url} to={link.url} className={`pill-link ${isActive ? 'active' : ''}`}>
                                {link.label}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Navbar;