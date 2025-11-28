import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

// Layout Components
import ScrollToTop from './components/ScrolltoTop';
import Navbar from './components/Navbar/Navbar';
import MobileNavbar from './components/MobileNavbar/MobileNavbar'; // 1. Import MobileNavbar
import Footer from './components/Footer/Footer';

// Import the Routes
import AppRoutes from './routes';

// Import the Contact Modal
import ContactModal from './pages/ContactModal/ContactModal';

// Styles
import './styles/index.css';

function App() {
  const location = useLocation();
  
  // Create State for the Modal
  const [isContactOpen, setIsContactOpen] = useState(false);

  // Helper functions to open/close
  const openContactModal = () => setIsContactOpen(true);
  const closeContactModal = () => setIsContactOpen(false);
  
  // Logic to hide Navbar/Footer on specific paths
  const noFooterPaths = [
    '/legalmate-ai', 
    '/doc-analyzer',
    '/legal-research',
    '/blogs/', 
    '/tools/',    
    '/services/'  
  ];
  
  const noNavbarPaths = [
    '/legalmate-ai', 
    '/doc-analyzer',
    '/legal-research',
    '/tools/',    
    '/services/'  
  ];

  const shouldShowFooter = !noFooterPaths.some(path => location.pathname.startsWith(path));
  const shouldShowNavbar = !noNavbarPaths.some(path => location.pathname.startsWith(path));

  return (
    <div
      className="app"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        margin: 0,
        padding: 0
      }}
    >
      <ScrollToTop />
      
      {/* 2. Render Navbars - CSS handles visibility at 767px breakpoint */}
      {shouldShowNavbar && (
        <>
           <Navbar /> 
           <MobileNavbar onContactClick={openContactModal} />
        </>
      )}
      
      <main
        className="mBotn-content"
        style={{
          flex: '1 0 auto',
          margin: 0,
          padding: 0
        }}
      >
        {/* Render the extracted Routes here */}
        <AppRoutes />
      </main>

      {/* Pass the open function to Footer */}
      {shouldShowFooter && <Footer onContactClick={openContactModal} />}

      {/* Render the Modal outside the main flow */}
      <ContactModal 
        isOpen={isContactOpen} 
        onClose={closeContactModal} 
      />
    </div>
  );
}

export default App;