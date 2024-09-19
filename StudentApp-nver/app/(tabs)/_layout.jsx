import { StatusBar } from "expo-status-bar";
import { Image, Text, View, StyleSheet } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Home from './home';
import Attendance from './attendance';
import Marks from './marks';
import Profile from './profile';
import Announcements from './announcements';
import Settings from "./settings";
import { ThemeProvider, useTheme } from '../../context/ThemeContext';

// Define the colors manually
const mycolor = {
  beigePantone: '#D2AE6D',
  grayDark: '#4A4A4A',
  offWhite: '#F8F8F8',
  bluePantone: '#2957A4',
};

// Create the Drawer Navigator
const Drawer = createDrawerNavigator();

const DrawerIcon = ({ icon, color, name, focused }) => {
  const iconSize = (name === 'Attendance' || name === 'Marks') ? 30 : 24;
  return (
    <View style={styles.iconContainer}>
      <Image
        source={icon}
        resizeMode="contain"
        style={{ width: iconSize, height: iconSize, tintColor: color }}
      />
      <Text
        style={[
          focused ? styles.drawerLabelFocused : styles.drawerLabel,
          { color: color }
        ]}
      >
        {name}
      </Text>
    </View>
  );
};

const DrawerLayout = () => {
  const { isDarkMode } = useTheme();
  const themeStyles = isDarkMode ? darkStyles : lightStyles;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: isDarkMode ? '#333' : '#fff', // Change this to any color you want for the header
          },
          headerTintColor: isDarkMode ? '#fff' : '#333',
          drawerActiveTintColor: mycolor.beigePantone,
          drawerInactiveTintColor: mycolor.grayDark,
          drawerStyle: [styles.drawerStyle, themeStyles.drawerContent],
          drawerLabelStyle: [styles.drawerLabel, themeStyles.drawerItemText],
          drawerContentStyle: {
            borderTopWidth: 1,
            borderTopColor: mycolor.bluePantone,
          },
        }}

        /* screenOptions={{
          headerStyle: {
            backgroundColor: isDarkMode ? '#333' : '#fff', // Change this to any color you want for the header
          },
          headerTintColor: isDarkMode ? '#fff' : '#333',   // Change the color of the header title (e.g., 'Settings')
          drawerActiveTintColor: mycolor.beigePantone,
          drawerInactiveTintColor: mycolor.grayDark,
          drawerStyle: [styles.drawerStyle, themeStyles.drawerContent],
        }} */
      >
        {/* Screens */}
        <Drawer.Screen name="home" component={Home} options={{ title: "Home" }} />
        <Drawer.Screen name="attendance" component={Attendance} options={{ title: "Attendance" }} />
        <Drawer.Screen name="marks" component={Marks} options={{ title: "Marks" }} />
        <Drawer.Screen name="profile" component={Profile} options={{ title: "Profile" }} />
        <Drawer.Screen name="announcements" component={Announcements} options={{ title: "Announcements" }} />
        <Drawer.Screen name="settings" component={Settings} options={{ title: "Settings" }} />
      </Drawer.Navigator>
    </GestureHandlerRootView>
  );
};

// Updated styles similar to Code 2
const styles = StyleSheet.create({
  iconContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  drawerLabel: {
    fontFamily: 'Arial',
    fontSize: 16, // Adjusted font size to match Code 2
    color: '#333',
  },
  drawerLabelFocused: {
    fontFamily: 'Arial-BoldMT', // Bold version for focused label
    fontSize: 16, // Match the same font size
  },
  drawerStyle: {
    backgroundColor: '#fff', // Light mode background color
  },
});

// Dark mode styles
const darkStyles = StyleSheet.create({
  drawerContent: {
    backgroundColor: '#333', // Dark mode background
  },
  drawerItemText: {
    color: '#fff', // Dark mode text color
  },
});

// Light mode styles
const lightStyles = StyleSheet.create({
  drawerContent: {
    backgroundColor: '#fff', // Light mode background
  },
  drawerItemText: {
    color: '#333', // Light mode text color
  },
});

export default DrawerLayout;
