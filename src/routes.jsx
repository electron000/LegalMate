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

// CMS Imports
import CMSLayout from './pages/ServicesPage/Services/caseManagement/CMSLayout';
import CMSDashboard from './pages/ServicesPage/Services/caseManagement/Dashboard';
import CMSClients from './pages/ServicesPage/Services/caseManagement/Clients';
import CaseDetails from './pages/ServicesPage/Services/caseManagement/CaseDetails';

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
      <Route path="/tools" element={<ToolsPage />} />
      <Route path="/tools/:toolId" element={<DocGenTool />} />

      {/* Blog Pages */}
      <Route path="/blogs" element={<AllBlogsPage isUserPage={false} />} />
      <Route path="/blogs/:blogId" element={<BlogViewPage />} />
      <Route path="*" element={<div>Page Not Found</div>} />

      {/* --- CASE MANAGEMENT SYSTEM ROUTING --- */}
      <Route path="/case-management" element={<CMSLayout />}>
      <Route index element={<CMSDashboard />} />
      <Route path="clients" element={<CMSClients />} />
      <Route path="case/:caseNumber" element={<CaseDetails />} />
      </Route>
    </Routes>

  );
};

export default AppRoutes;