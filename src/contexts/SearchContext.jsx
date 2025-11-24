/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useContext } from 'react';

// 1. Create the context
const SearchContext = createContext();

// 2. Create the Provider component
export const SearchProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <SearchContext.Provider value={{ searchQuery, setSearchQuery }}>
      {children}
    </SearchContext.Provider>
  );
};

// 3. Create a custom hook for easy access to the context
export const useSearch = () => {
  return useContext(SearchContext);
};