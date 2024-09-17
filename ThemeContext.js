import React, { createContext, useState, useContext } from 'react';
import { useColorScheme } from 'react-native';

// Create context to manage the theme
const ThemeContext = createContext();

// Hook to easily access theme context
export const useTheme = () => useContext(ThemeContext);

// Theme provider component
export const ThemeProvider = ({ children }) => {
  // Detect system theme initially
  const systemColorScheme = useColorScheme();
  
  // State to control light/dark mode manually, defaulting to system theme
  const [isDarkMode, setDarkMode] = useState(systemColorScheme === 'dark');

  // Toggle dark mode
  const toggleTheme = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  // Provide the theme and toggle function to the entire app
  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
