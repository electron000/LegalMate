import { createRoot } from 'react-dom/client';
// Removed AuthProvider import
import { SearchProvider } from './contexts/SearchContext.jsx';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <Router>
    {/* Removed AuthProvider wrapper */}
    <SearchProvider>
      <App />
    </SearchProvider>
  </Router>
);