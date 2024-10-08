// DrawerHeader.js
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { images } from '../../constants';

const DrawerHeader = ({ isDarkMode }) => {
  return (
    <View style={[styles.headerContainer, isDarkMode ? styles.headerContainerDark : styles.headerContainerLight]}>
      <Image
        source={images.logoSmall} // Replace with your actual image import if needed
        resizeMode='contain'
        style={styles.logo}
      />
      <Text style={[styles.appName, isDarkMode ? styles.appNameDark : styles.appNameLight]}>
        Student App
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row', // Align items horizontally
    alignItems: 'center',  // Center items vertically
    paddingVertical: 20,
    paddingHorizontal: 15, // Add some horizontal padding
  },
  headerContainerDark: {
    backgroundColor: '#333', // Dark mode background color
    borderBottomColor: '#444', // Dark mode border color
  },
  headerContainerLight: {
    backgroundColor: '#fff', // Light mode background color
  },
  logo: {
    width: 50, // Adjust the width as needed
    height: 50, // Adjust the height as needed
    marginRight: 10, // Add some space between the logo and text
  },
  appName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  appNameDark: {
    color: '#fff', // Dark mode text color
  },
  appNameLight: {
    color: '#333', // Light mode text color
  },
});

export default DrawerHeader;
