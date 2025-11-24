import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../../assets/legal-logo.png'; 
import './NavbarLeft.css';

const NavbarLeft = () => {
    return (
        <div className="navbar-brand">
            <Link to="/" className="navbar-brand-link">
                <img src={logo} alt="AI LegalMate Logo" className="brand-logo" />
                <span className="brand-text">LegalMate</span>
            </Link>
        </div>
    );
};

export default NavbarLeft;