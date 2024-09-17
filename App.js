import React from 'react';
import { Image, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import HomePage from './homepage';
import Announcement from './announcement';
import Settings from './Settings'; // Import the Settings screen
import { ThemeProvider, useTheme } from './ThemeContext'; // Import the theme context

const Drawer = createDrawerNavigator();

// Custom drawer content component
function CustomDrawerContent(props) {
  const { isDarkMode } = useTheme(); // Get the current theme state

  const themeStyles = isDarkMode ? darkStyles : lightStyles; // Select theme styles

  return (
    <View style={[styles.drawerContent, themeStyles.drawerContent]}>
      <Text style={[styles.drawerTitle, themeStyles.drawerTitle]}>Menu</Text>

      <TouchableOpacity
        style={[styles.drawerItem, themeStyles.drawerItem]}
        onPress={() => props.navigation.navigate('HomePage')}
      >
        <Text style={[styles.drawerItemText, themeStyles.drawerItemText]}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.drawerItem, themeStyles.drawerItem]}
        onPress={() => props.navigation.navigate('Announcements')}
      >
        <Text style={[styles.drawerItemText, themeStyles.drawerItemText]}>Announcements</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.drawerItem, themeStyles.drawerItem]}
        onPress={() => props.navigation.navigate('Calendar')}
      >
        <Text style={[styles.drawerItemText, themeStyles.drawerItemText]}>My Calendar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.drawerItem, themeStyles.drawerItem]}
        onPress={() => props.navigation.navigate('Assignments')}
      >
        <Text style={[styles.drawerItemText, themeStyles.drawerItemText]}>Assignments</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.drawerItem, themeStyles.drawerItem]}
        onPress={() => props.navigation.navigate('Exams')}
      >
        <Text style={[styles.drawerItemText, themeStyles.drawerItemText]}>Exams</Text>
      </TouchableOpacity>

      {/* Settings Option */}
      <TouchableOpacity
        style={[styles.drawerItem, themeStyles.drawerItem]}
        onPress={() => props.navigation.navigate('Settings')}
      >
        <Text style={[styles.drawerItemText, themeStyles.drawerItemText]}>Settings</Text>
      </TouchableOpacity>
    </View>
  );
}

function AppNavigator() {
  const { isDarkMode } = useTheme(); // Access current theme
  const themeStyles = isDarkMode ? darkHeaderStyles : lightHeaderStyles;

  return (
    <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />}>
      <Drawer.Screen
        name="HomePage"
        component={HomePage}
        options={{
          title: '',
          headerTitle: () => (
            <Image
              source={require('./assets/emblemm.png')}
              style={{ width: 40, height: 40, resizeMode: 'contain' }}
            />
          ),
          headerTitleAlign: 'center',
          headerStyle: themeStyles.headerStyle,
          headerTintColor: themeStyles.headerTintColor,
        }}
      />
      <Drawer.Screen
        name="Announcements"
        component={Announcement}
        options={{
          headerTitle: 'Announcements',
          headerStyle: themeStyles.headerStyle,
          headerTintColor: themeStyles.headerTintColor,
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={Settings}
        options={{
          headerTitle: 'Settings',
          headerStyle: themeStyles.headerStyle,
          headerTintColor: themeStyles.headerTintColor,
        }}
      />
    </Drawer.Navigator>
  );
}

// Main App Component with Theme Provider
export default function App() {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </ThemeProvider>
  );
}

// Base styles for drawer
const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    padding: 20,
  },
  drawerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  drawerItem: {
    paddingVertical: 15,
  },
  drawerItemText: {
    fontSize: 16,
  },
});

// Light mode styles
const lightStyles = StyleSheet.create({
  drawerContent: {
    backgroundColor: '#fff',
  },
  drawerTitle: {
    color: '#333',
  },
  drawerItemText: {
    color: '#333',
  },
});

// Dark mode styles
const darkStyles = StyleSheet.create({
  drawerContent: {
    backgroundColor: '#333',
  },
  drawerTitle: {
    color: '#fff',
  },
  drawerItemText: {
    color: '#fff',
  },
});

// Light and dark mode header styles
const lightHeaderStyles = {
  headerStyle: { backgroundColor: '#1b4769' },
  headerTintColor: '#dcecfc',
};

const darkHeaderStyles = {
  headerStyle: { backgroundColor: '#000' },
  headerTintColor: '#fff',
};
