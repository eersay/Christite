import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

const lightThemeColors = {
  background: '#FFFFFF',
  text: '#000000',
};

const darkThemeColors = {
  background: '#000000',
  text: '#FFFFFF',
};

export const ThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme();

  const [isDarkMode, setDarkMode] = useState(systemColorScheme === 'dark');

  // Update the theme when the system theme changes
  useEffect(() => {
    setDarkMode(systemColorScheme === 'dark');
  }, [systemColorScheme]);

  const toggleTheme = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  const themeColors = isDarkMode ? darkThemeColors : lightThemeColors;

  return (
    <ThemeContext.Provider value={{ isDarkMode, themeColors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
