import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { useTheme } from './ThemeContext'; // Use the theme context

export default function Settings() {
  const { isDarkMode, toggleTheme } = useTheme(); // Get the theme and toggle function from context

  const themeStyles = isDarkMode ? darkStyles : lightStyles;

  return (
    <View style={[styles.container, themeStyles.container]}>
      <Text style={[styles.sectionTitle, themeStyles.text]}>Preferences</Text>
      <View style={styles.settingsItem}>
        <Text style={[styles.settingsText, themeStyles.text]}>Dark Mode</Text>
        <Switch value={isDarkMode} onValueChange={toggleTheme} />
      </View>
    </View>
  );
}

// Base styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  settingsItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  settingsText: {
    fontSize: 16,
  },
});

// Light mode styles
const lightStyles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  text: {
    color: '#000',
  },
});

// Dark mode styles
const darkStyles = StyleSheet.create({
  container: {
    backgroundColor: '#333',
  },
  text: {
    color: '#fff',
  },
});
