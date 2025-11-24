import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSearch } from '../../../contexts/SearchContext.jsx';
import { Menu, X, Search } from 'lucide-react';
import './NavbarRight.css'; 

const NavbarRight = ({ 
    isSearchOpen, 
    setIsSearchOpen, 
    searchContainerRef, 
    searchInputRef, 
    toggleMobileSearch,
    toggleMobileMenu,
    mobileMenuOpen,
    showSearch 
}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { searchQuery, setSearchQuery } = useSearch();

    const getPlaceholder = () => {
        if (location.pathname.startsWith('/tools')) return 'Search tools...';
        if (location.pathname.startsWith('/services')) return 'Search services...';
        return 'Search blogs...';
    };
    
    useEffect(() => {
        if (isSearchOpen) {
             requestAnimationFrame(() => searchInputRef.current?.focus());
        }
    }, [isSearchOpen, searchInputRef]);

    const handleSearchIconClick = () => {
        setIsSearchOpen(prev => !prev);
    };

    const handleSearchSubmit = (e) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            e.preventDefault();
            if (location.pathname.startsWith('/tools') || location.pathname.startsWith('/services')) {
              setIsSearchOpen(false);
              searchInputRef.current?.blur();
            } else {
              navigate(`/blogs?q=${encodeURIComponent(searchQuery)}`);
              setIsSearchOpen(false);
            }
        }
    };

    return (
        <>
            <div className="navbar-right">
                {showSearch && (
                    <div 
                        className={`navbar-search ${isSearchOpen ? 'active' : ''}`} 
                        ref={searchContainerRef}>
                        <button 
                            onClick={handleSearchIconClick} 
                            onMouseDown={(e) => e.preventDefault()}
                            className="search-icon-btn" 
                            aria-label="Toggle search"
                        >
                            <Search size={22} />
                        </button>
                        <input
                            ref={searchInputRef}
                            type="text"
                            placeholder={getPlaceholder()}
                            className="search-input"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onBlur={() => { if (!searchQuery) setIsSearchOpen(false);}}
                            onKeyDown={handleSearchSubmit}
                        />
                    </div>
                )}
            </div>

            <div className="navbar-actions">
                {showSearch && (
                    <button onClick={toggleMobileSearch} className="mobile-search-btn" aria-label="Toggle search">
                        <Search size={22} />
                    </button>
                )}
                <button onClick={toggleMobileMenu} className="mobile-menu-btn" aria-label="Toggle mobile menu">
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>
        </>
    );
};

export default NavbarRight;