import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSearch } from '../../contexts/SearchContext.jsx'; 
import { X, Search } from 'lucide-react';
import NavbarLeft from './NavLeft/NavbarLeft.jsx';
import NavbarCenter from './NavCenter/NavbarCenter.jsx';
import NavbarRight from './NavRight/NavbarRight.jsx';
import './Navbar.css';

const navLinks = [ 
    { label: 'Home', url: '/' },
    { label: 'Tools', url: '/tools' },
    { label: 'Services', url: '/services' },
    { label: 'Blogs', url: '/blogs' },
];

const Navbar = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    const searchContainerRef = useRef(null);
    const searchInputRef = useRef(null); 
    const navigate = useNavigate();
    const location = useLocation();
    const { searchQuery, setSearchQuery } = useSearch();

    const showSearch = ['/tools', '/services', '/blogs'].some(path => 
        location.pathname.startsWith(path)
    );

    const getSearchPlaceholder = useCallback(() => {
        if (location.pathname.startsWith('/tools')) return 'Search tools...';
        if (location.pathname.startsWith('/services')) return 'Search services...';
        return 'Search blogs...';
    }, [location.pathname]);

    useEffect(() => {
        const handleScroll = () => {
            const heroHeightThreshold = window.innerHeight * 0.7; 
            setIsScrolled(window.scrollY > heroHeightThreshold);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleKeyDown = (e) => { if (e.key === 'Escape') setMobileMenuOpen(false); };
        if (mobileMenuOpen) document.body.classList.add('mobile-menu-open');
        else document.body.classList.remove('mobile-menu-open');
        if (mobileMenuOpen) document.addEventListener('keydown', handleKeyDown);
        return () => { document.removeEventListener('keydown', handleKeyDown); document.body.classList.remove('mobile-menu-open'); };
    }, [mobileMenuOpen]);

    useEffect(() => {
        const handleKeyDown = (e) => { if (e.key === 'Escape') setMobileSearchOpen(false); };
        if (mobileSearchOpen) document.body.classList.add('mobile-search-open');
        else document.body.classList.remove('mobile-search-open');
        if (mobileSearchOpen) document.addEventListener('keydown', handleKeyDown);
        return () => { document.removeEventListener('keydown', handleKeyDown); document.body.classList.remove('mobile-search-open'); };
    }, [mobileSearchOpen]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
                setIsSearchOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => { document.removeEventListener("mousedown", handleClickOutside); };
    }, []);
    
    useEffect(() => {
        if (!showSearch) setSearchQuery('');
    }, [showSearch, setSearchQuery]);

    const handleMobileSearchEnter = (e) => { if (e.key === 'Enter') { e.preventDefault(); handleMobileSearchSubmit(); } };
    
    const handleMobileSearchSubmit = () => {
        if (searchQuery.trim()) {
            if (location.pathname.startsWith('/tools') || location.pathname.startsWith('/services')) {
              setMobileSearchOpen(false);
            } else {
              navigate(`/blogs?q=${encodeURIComponent(searchQuery)}`);
              setMobileSearchOpen(false);
            }
        } else setMobileSearchOpen(false);
    };

    const toggleMobileSearch = () => {
        const isOpening = !mobileSearchOpen;
        setMobileMenuOpen(false);
        setMobileSearchOpen(isOpening);
        if (isOpening) setTimeout(() => searchInputRef.current?.focus(), 300);
    };

    const closeMobileSearch = () => setMobileSearchOpen(false);
    
    const handleMobileNavClick = (url) => { 
        setMobileMenuOpen(false); navigate(url); 
    };
    
    const toggleMobileMenu = () => { setMobileSearchOpen(false); setMobileMenuOpen(!mobileMenuOpen); };
    const closeMobileMenu = () => setMobileMenuOpen(false);

    const isHomePage = location.pathname === '/';
    const isNavbarActive = !isHomePage || isScrolled;

    return (
        <> 
            <nav className={`navbar ${isNavbarActive ? 'scrolled' : ''}`}>
                <NavbarLeft />
                
                <NavbarRight 
                    isSearchOpen={isSearchOpen}
                    setIsSearchOpen={setIsSearchOpen}
                    searchContainerRef={searchContainerRef}
                    searchInputRef={searchInputRef}
                    toggleMobileSearch={toggleMobileSearch}
                    toggleMobileMenu={toggleMobileMenu}
                    mobileMenuOpen={mobileMenuOpen}
                    getPlaceholder={getSearchPlaceholder} 
                    showSearch={showSearch}
                />
            </nav>

            <NavbarCenter 
                isNavbarActive={isNavbarActive} 
                navLinks={navLinks} 
            />

            {mobileMenuOpen && <div className="mobile-overlay active" onClick={closeMobileMenu}></div>}
            <div className={`mobile-menu ${mobileMenuOpen ? 'active' : ''}`}>
                <button className="mobile-menu-close-btn" onClick={closeMobileMenu} aria-label="Close menu">
                    <X size={24} />
                </button>
                <div className="mobile-nav-links">
                    {navLinks.map(link => (
                        <button key={link.label} onClick={() => handleMobileNavClick(link.url)} className="mobile-nav-link">
                            {link.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className={`mobile-search-overlay ${mobileSearchOpen ? 'active' : ''}`} onClick={closeMobileSearch}>
                <div className="mobile-search-panel" onClick={(e) => e.stopPropagation()}>
                    <input
                        ref={mobileSearchOpen ? searchInputRef : null} 
                        type="text"
                        placeholder={getSearchPlaceholder()}
                        className="mobile-search-input"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleMobileSearchEnter}
                    />
                    <button className="mobile-search-submit-btn" onClick={handleMobileSearchSubmit} aria-label="Submit search">
                        <Search size={22} />
                    </button>
                </div>
            </div>
        </>
    );
};

export default Navbar;