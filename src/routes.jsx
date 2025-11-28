import React from 'react';
import { Route, Routes } from 'react-router-dom';

// --- Page Imports ---

// Core Pages
import Home from './pages/HomePage/HomePage';
import AboutPage from './pages/AboutPage/AboutPage';
import ContactModal from './pages/ContactModal/ContactModal';
import PricingPage from './pages/PricingPage/PricingPage';

// Services
import ServicesPage from './pages/ServicesPage/ServicesPage';
import LegalMate from './pages/ServicesPage/Services/LegalMate/LegalMate';
import Docanalyzer from './pages/ServicesPage/Services/DocAnalyzer/DocAnalyzer';
import LegalResearch from './pages/ServicesPage/Services/LegalResearch/LegalResearch';

// Tools (New Architecture)
import ToolsPage from './pages/ToolsPage/ToolsPage';
import DocGenTool from './pages/ToolsPage/Tools/DocGenTool/DocGenTool';

// Blogs
import AllBlogsPage from './pages/BlogPage/AllBlogsPage/AllBlogsPage';
import BlogViewPage from './pages/BlogPage/BlogViewPage/BlogViewPage';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Core Pages */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/contact" element={<ContactModal />} />

      {/* Specific Services */}
      <Route path="/legalmate-ai" element={<LegalMate />} />
      <Route path="/doc-analyzer" element={<Docanalyzer />} /> 
      <Route path="/legal-research" element={<LegalResearch />} /> 

      {/* --- TOOLS ROUTING --- */}
      {/* 1. The Dashboard (List of all tools) */}
      <Route path="/tools" element={<ToolsPage />} />
      
      {/* 2. The Dynamic Engine (Handles cra, will, mfa, sd, and all future tools) */}
      <Route path="/tools/:toolId" element={<DocGenTool />} />

      {/* Blog Pages */}
      <Route path="/blogs" element={<AllBlogsPage isUserPage={false} />} />
      <Route path="/blogs/:blogId" element={<BlogViewPage />} />
    </Routes>
  );
};

export default AppRoutes;