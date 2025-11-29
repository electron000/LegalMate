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
  const [isContactOpen, setIsContactOpen] = useState(false);

  // Helper functions
  const openContactModal = () => setIsContactOpen(true);
  const closeContactModal = () => setIsContactOpen(false);

  const noAnimationPaths = [
    '/', 
    '/legalmate-ai', 
    '/doc-analyzer', 
    '/case-management', 
    '/legal-research'
  ];

  const shouldSkipAnimation = noAnimationPaths.includes(location.pathname);
  
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
    <div className="app" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', margin: 0, padding: 0 }}>
      <ScrollToTop />
      {shouldShowNavbar && (
        <>
           <Navbar /> 
           <MobileNavbar onContactClick={openContactModal} />
        </>
      )}
      
      <main className="mBotn-content" style={{ flex: '1 0 auto', margin: 0, padding: 0 }}>
        {/* 3. Apply the class conditionally based on the array check */}
        <div 
          key={location.pathname} 
          className={shouldSkipAnimation ? '' : 'page-animate'}
        >
          <AppRoutes />
        </div>
      </main>
      {shouldShowFooter && <Footer onContactClick={openContactModal} />}
      <ContactModal isOpen={isContactOpen} onClose={closeContactModal} />
    </div>
  );
}

export default App;