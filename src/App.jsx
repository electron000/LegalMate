import React from 'react';
import { useLocation } from 'react-router-dom';

// Layout Components
import ScrollToTop from './components/ScrolltoTop';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';

// Import the Routes
import AppRoutes from './routes';

// Styles
import './styles/index.css';

function App() {
  const location = useLocation();
  
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
      
      {shouldShowNavbar && <Navbar />}
      
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

      {shouldShowFooter && <Footer />}
    </div>
  );
}

export default App;