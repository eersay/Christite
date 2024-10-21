import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

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

  // Load saved theme preference from AsyncStorage when the app starts
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem('themePreference');
        if (storedTheme !== null) {
          setDarkMode(storedTheme === 'dark');
        } else {
          setDarkMode(systemColorScheme === 'dark'); // Use system default if no preference is saved
        }
      } catch (error) {
        console.error("Failed to load theme preference:", error);
      }
    };
    loadThemePreference();
  }, [systemColorScheme]);

  // Save the theme preference to AsyncStorage when it changes
  useEffect(() => {
    const saveThemePreference = async () => {
      try {
        await AsyncStorage.setItem('themePreference', isDarkMode ? 'dark' : 'light');
      } catch (error) {
        console.error("Failed to save theme preference:", error);
      }
    };
    saveThemePreference();
  }, [isDarkMode]);

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
