// src/api/index.js

// 1. Export Configuration 
export * from './config';

// 2. Export LegalMate APIs 
export * from './LegalMate/LegalMateAPI';
export * from './LegalMate/sessionmanager';

// 3. Export Legal Research APIs 
// export * from './LegalResearch/LegalResearchAPI';

// 4. Export DocGen Service & Utilities
// This will export 'DocGenService' and 'downloadBlob' from the file above
export * from './DocGen/DocGenAPI'; 

// 5. Export Blog APIs 
export * from './Blogs/BlogAPI';