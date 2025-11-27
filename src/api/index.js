// src/api/index.js

// 1. Export Configuration 
export * from './config';

// 2. Export LegalMate APIs 
export * from './LegalMate/LegalMateAPI';
export * from './LegalMate/sessionmanager';

// 3. Export DocGen Service & Utilities
export * from './DocGen/DocGenAPI'; 

// 4. Export Blog APIs 
export * from './Blogs/BlogAPI';

// 5. Export DocAnalyzer APIs
export * from './DocAnalyzer/DocAnalyzerAPI';