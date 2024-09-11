import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ImageBackground } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Forgot from './forgot';  // Import the Forgot.js file

// HomeScreen Component
function HomeScreen({ navigation }) {
  const [registerNumber, setRegisterNumber] = useState('');
  const [password, setPassword] = useState('');

  return (
    <ImageBackground source={require('./assets/bg.jpeg')} style={styles.background}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
        <View style={styles.headerText}>
            <Text style={styles.universityText}>CHRIST</Text>
            <Text style={styles.universityTextSmall}>University</Text>
          </View>
          <Image source={require('./assets/emblem.png')} style={styles.logo} />
        </View>

        {/* Welcome Message */}
        <Text style={styles.welcome}>Hi !</Text>
        <Text style={styles.welcomee}>Welcome</Text>
        <Text style={styles.instructions}>Enter your Register Number and Password:</Text>

        {/* Register Number Input */}
        <TextInput
          style={styles.input}
          placeholder="Register Number"
          value={registerNumber}
          onChangeText={setRegisterNumber}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {/* Forgot Password */}
        <View style={styles.row}>
          <TouchableOpacity onPress={() => navigation.navigate('Forgot')}>
            <Text style={styles.forgotPassword}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        {/* Log In Button */}
        <TouchableOpacity style={styles.button} onPress={() => alert('Logging in')}>
          <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

// Set up the Stack Navigator
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Forgot" component={Forgot} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Styles (updated to align logo and text to the right)
const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',  // Align items horizontally
    justifyContent: 'right',  // Push text to left and logo to right
    alignItems: 'center',  // Vertically align the logo and text
    marginBottom: 40,
  },
  headerText: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  universityText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  universityTextSmall: {
    fontSize: 14,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40, 
  },
  welcome: {
    fontSize: 70,
    fontWeight: 'bold',
    paddingTop: 70,
    color: '#dcecfc',
  },
  welcomee: {
    fontSize: 60,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#1C2E4A',
  },
  instructions: {
    textAlign: 'left',
    fontSize: 14,
    color: '#000000',
    marginBottom: 30,
  },
  input: {
    height: 40,
    borderColor: '#1C2E4A',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  forgotPassword: {
    fontSize: 14,
    color: '#000000',
    alignSelf: 'flex-end',
  },
  button: {
    backgroundColor: '#1C2E4A',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
