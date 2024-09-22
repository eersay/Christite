import React from 'react';
import { View, Text, StyleSheet, Switch, Alert, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { logOut } from '../../lib/appwrite'; // Import the logOut function
import { router } from 'expo-router'; // Import router from expo-router

export default function Settings() {
  const { isDarkMode, toggleTheme } = useTheme(); // Get the theme and toggle function from context

  const themeStyles = isDarkMode ? darkStyles : lightStyles;

  const handleLogout = async () => {
    try {
      await logOut(); // Call the logOut function
      Alert.alert("Logged out", "You have been successfully logged out.");
      router.replace('/sign-in'); // Navigate to the root `index.jsx` and clear navigation stack
    } catch (error) {
      Alert.alert("Logout failed", error.message);
    }
  };

  return (
    <View style={[styles.container, themeStyles.container]}>
      <Text style={[styles.sectionTitle, themeStyles.text]}>Preferences</Text>
      <View style={styles.settingsItem}>
        <Text style={[styles.settingsText, themeStyles.text]}>Dark Mode</Text>
        <Switch value={isDarkMode} onValueChange={toggleTheme} />
      </View>

      {/* Add styled Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Log Out</Text>
      </TouchableOpacity>
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
  logoutButton: {
    backgroundColor: '#FF6347', // Tomato color for the button
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
