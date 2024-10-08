import { StatusBar } from "expo-status-bar";
import { Image, Text, View, StyleSheet } from "react-native";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Home from './home';
import Attendance from './attendance';
import Marks from './marks';
import Profile from './profile';
import Announcements from './announcements';
import Settings from "./settings";
import Timetable from "./timetable";
import Support from "./support";
import { ThemeProvider, useTheme } from '../../context/ThemeContext';
import DrawerHeader from './DrawerHeader'; // Import your new header component

// Define the colors manually
const mycolor = {
  beigePantone: '#D2AE6D',
  grayDark: '#4A4A4A',
  offWhite: '#F8F8F8',
  bluePantone: '#2957A4',
};

// Create the Drawer Navigator
const Drawer = createDrawerNavigator();

const DrawerLayout = () => {
  const { isDarkMode } = useTheme();
  const themeStyles = isDarkMode ? darkStyles : lightStyles;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: isDarkMode ? '#333' : '#fff',
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
        drawerContent={(props) => (
          <DrawerContentScrollView {...props}>
            <DrawerHeader isDarkMode={isDarkMode} /> 
            <DrawerItemList {...props} />
          </DrawerContentScrollView>
        )}
      >
        {/* Screens */}
        <Drawer.Screen name="home" component={Home} options={{ title: "Home" }} />
        <Drawer.Screen name="attendance" component={Attendance} options={{ title: "Attendance" }} />
        <Drawer.Screen name="marks" component={Marks} options={{ title: "Marks" }} />
        <Drawer.Screen name="timetable" component={Timetable} options={{ title: "Timetable" }} />
        <Drawer.Screen name="profile" component={Profile} options={{ title: "Profile" }} />
        <Drawer.Screen name="announcements" component={Announcements} options={{ title: "Announcements" }} />
        <Drawer.Screen name="support" component={Support} options={{ title: "Support" }} />
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
    fontSize: 16,
    color: '#333',
  },
  drawerLabelFocused: {
    fontFamily: 'Arial-BoldMT',
    fontSize: 16,
  },
  drawerStyle: {
    backgroundColor: '#fff',
  },
});

// Dark mode styles
const darkStyles = StyleSheet.create({
  drawerContent: {
    backgroundColor: '#333',
  },
  drawerItemText: {
    color: '#fff',
  },
});

// Light mode styles
const lightStyles = StyleSheet.create({
  drawerContent: {
    backgroundColor: '#fff',
  },
  drawerItemText: {
    color: '#333',
  },
});

export default DrawerLayout;
