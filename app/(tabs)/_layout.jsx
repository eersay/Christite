import { Text, View, StyleSheet, Image, TouchableOpacity, Linking } from "react-native";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Home from './home';
import Attendance from './attendance';
import Marks from './marks';
import Profile from './profile';
import Announcements from './announcements';
import Settings from "./settings";
import Timetable from "./timetable";
import Faculty from "./faculty";
import Forms from "./forms";
import { ThemeProvider, useTheme } from '../../context/ThemeContext';
import Icon from 'react-native-vector-icons/FontAwesome';
import { images } from '../../constants';

const mycolor = {
  beigePantone: '#D2AE6D',
  grayDark: '#4A4A4A',
  offWhite: '#F8F8F8',
};

const Drawer = createDrawerNavigator();

// Social media logos component with clickable icons
const SocialMediaLogos = () => {
  const handlePress = (url) => {
    Linking.openURL(url).catch((err) => console.error("An error occurred", err));
  };

  return (
    <View style={styles.socialMediaContainer}>
      <TouchableOpacity onPress={() => handlePress('https://www.facebook.com/www.christuniversity.in/')}>
        <Icon name="facebook-square" size={30} color="#3b5998" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handlePress('https://www.instagram.com/christ_university_bangalore/?hl=en')}>
        <Icon name="instagram" size={30} color="#C13584" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => Linking.openURL('https://x.com/christbangalore')}>
      <Image 
        source={images.twitter} // Path to your X logo image
        style={{ width: 29, height: 35 }}
      />
    </TouchableOpacity>
    </View>
  );
};

// Custom Drawer Component
const CustomDrawerContent = (props) => {
  const { isDarkMode } = useTheme();
  const themeStyles = isDarkMode ? darkStyles : lightStyles;

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContainer}>
      {/* Header Section */}
      <View style={styles.headerContainer}>
        <Image
          source={require('../../../StudentApp-nver/assets/images/emblem.png')} // Correct the relative path
          style={styles.logo}
        />
        <Text style={[styles.appTitle, themeStyles.drawerItemText]}>Student App</Text>
      </View>

      {/* Improved Divider */}
      <View style={[styles.sectionSeparator, themeStyles.sectionSeparator]} />

      {/* Menu Section */}
      <View style={styles.menuSection}>
        <DrawerItem
          label="Home"
          icon={() => <Icon name="home" size={24} color={isDarkMode ? mycolor.offWhite : '#406882'} />}
          labelStyle={themeStyles.drawerItemText} // Label styled for dark mode
          onPress={() => props.navigation.navigate('home')}
        />
        <DrawerItem
          label="Attendance"
          icon={() => <Icon name="check-square" size={24} color={isDarkMode ? mycolor.offWhite : '#406882'} />}
          labelStyle={themeStyles.drawerItemText} // Label styled for dark mode
          onPress={() => props.navigation.navigate('attendance')}
        />
        <DrawerItem
          label="Marks"
          icon={() => <Icon name="graduation-cap" size={24} color={isDarkMode ? mycolor.offWhite : '#406882'} />}
          labelStyle={themeStyles.drawerItemText} // Label styled for dark mode
          onPress={() => props.navigation.navigate('marks')}
        />
        <DrawerItem
          label="Timetable"
          icon={() => <Icon name="calendar" size={24} color={isDarkMode ? mycolor.offWhite : '#406882'} />}
          labelStyle={themeStyles.drawerItemText} // Label styled for dark mode
          onPress={() => props.navigation.navigate('timetable')}
        />
        <DrawerItem
          label="Announcements"
          icon={() => <Icon name="bullhorn" size={24} color={isDarkMode ? mycolor.offWhite : '#406882'} />}
          labelStyle={themeStyles.drawerItemText} // Label styled for dark mode
          onPress={() => props.navigation.navigate('announcements')}
        />
        <DrawerItem
          label="Faculty List"
          icon={() => <Icon name="users" size={24} color={isDarkMode ? mycolor.offWhite : '#406882'} />}
          labelStyle={themeStyles.drawerItemText} // Label styled for dark mode
          onPress={() => props.navigation.navigate('faculty')}
        />
        <DrawerItem
          label="Student Support"
          icon={() => <Icon name="university" size={24} color={isDarkMode ? mycolor.offWhite : '#406882'} />}
          labelStyle={themeStyles.drawerItemText} // Label styled for dark mode
          onPress={() => props.navigation.navigate('forms')}
        />
      </View>

      {/* Improved Divider */}
      <View style={[styles.sectionSeparator, themeStyles.sectionSeparator]} />

      <View style={styles.menuSection}>
        <DrawerItem
          label="Profile"
          icon={() => <Icon name="user" size={24} color={isDarkMode ? mycolor.offWhite : '#406882'} />}
          labelStyle={themeStyles.drawerItemText} // Label styled for dark mode
          onPress={() => props.navigation.navigate('profile')}
        />
        <DrawerItem
          label="Settings"
          icon={() => <Icon name="cog" size={24} color={isDarkMode ? mycolor.offWhite : '#406882'} />}
          labelStyle={themeStyles.drawerItemText} // Label styled for dark mode
          onPress={() => props.navigation.navigate('settings')}
        />
      </View>

      {/* Improved Divider */}
      <View style={[styles.sectionSeparator, themeStyles.sectionSeparator]} />

      <Text style={[styles.trademarkText, themeStyles.drawerItemText]}>
        {'\u2122'} Made by Team NOVA
      </Text>

      <View style={styles.footer}>
        <SocialMediaLogos />
      </View>
    </DrawerContentScrollView>
  );
};

const DrawerLayout = () => {
  const { isDarkMode } = useTheme();
  const themeStyles = isDarkMode ? darkStyles : lightStyles;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          headerStyle: {
            backgroundColor: isDarkMode ? '#333' : '#fff',
          },
          headerTintColor: isDarkMode ? mycolor.offWhite : '#333',
          drawerActiveTintColor: mycolor.beigePantone,
          drawerInactiveTintColor: isDarkMode ? mycolor.offWhite : mycolor.grayDark,
          drawerStyle: [styles.drawerStyle, themeStyles.drawerContent],
          drawerLabelStyle: [styles.drawerLabel, themeStyles.drawerItemText],
        }}
      >
        <Drawer.Screen name="home" component={Home} options={{ title: "Home" }} />
        <Drawer.Screen name="attendance" component={Attendance} options={{ title: "Attendance" }} />
        <Drawer.Screen name="marks" component={Marks} options={{ title: "Marks" }} />
        <Drawer.Screen name="profile" component={Profile} options={{ title: "Profile" }} />
        <Drawer.Screen name="announcements" component={Announcements} options={{ title: "Announcements" }} />
        <Drawer.Screen name="settings" component={Settings} options={{ title: "Settings" }} />
        <Drawer.Screen name="timetable" component={Timetable} options={{ title: "Timetable" }} />
        <Drawer.Screen name="faculty" component={Faculty} options={{ title: "Faculty List" }} />
        <Drawer.Screen name="forms" component={Forms} options={{ title: "Student Support" }} />
      </Drawer.Navigator>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  headerContainer: {
    alignItems: 'center',
    paddingTop: 40,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  appTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  sectionSeparator: {
    height: 1,
    backgroundColor: '#D3D3D3',
    marginVertical: 5,
  },
  menuSection: {
    paddingHorizontal: 10,
  },
  drawerLabel: {
    fontFamily: 'Arial',
    fontSize: 16,
  },
  drawerStyle: {
    backgroundColor: '#fff',
  },
  socialMediaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: mycolor.grayDark,
    paddingVertical: 10,
  },
  trademarkText: {
    fontSize: 12,
    textAlign: 'center',
  },
});

// Dark mode styles
const darkStyles = StyleSheet.create({
  drawerContent: {
    backgroundColor: '#333',
  },
  drawerItemText: {
    color: mycolor.offWhite,  // Off-white for the labels in dark mode
  },
  sectionSeparator: {
    backgroundColor: mycolor.offWhite, // Divider in dark mode
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