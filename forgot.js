import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ImageBackground, Alert } from 'react-native';
import { Client, Databases, Query } from 'appwrite';

function ForgotScreen() {
  const [email, setEmail] = useState('');

  // Appwrite client setup
  const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1') // Replace with your Appwrite endpoint
    .setProject('66e1ce680031e1324a89');                  // Replace with your Appwrite project ID

  const databases = new Databases(client);

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Please enter your email');
      return;
    }

    try {
      // Fetch the user data from the database based on email
      const response = await databases.listDocuments('001', '66e1cfa7000c3653a2ca', [
        Query.equal('email', email),
      ]);

      if (response.total === 0) {
        Alert.alert('No user found with this email.');
        return;
      }

      // Assuming there's only one user per email
      const user = response.documents[0];

      // Send an alert with the user's password
      Alert.alert('Password Reset', `Your password is: ${user.password}`);

      // Optionally, you can implement email sending here via Appwrite Functions or SMTP integration.
    } catch (error) {
      console.error('Error fetching user:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  return (
    <ImageBackground source={require('./assets/bg.jpeg')} style={styles.background}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Image source={require('./assets/emblem.png')} style={styles.logo} />
        </View>

        {/* Forgot Password Message */}
        <Text style={styles.welcome}>Forgot Password</Text>
        <Text style={styles.instructions}>Enter your email to reset your password:</Text>

        {/* Email Input */}
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />

        {/* Reset Password Button */}
        <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
          <Text style={styles.buttonText}>Send Reset Link</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

export default ForgotScreen;

// Styles (same as App.js with background image)
const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 40
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  welcome: {
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'left',
    marginTop: 50,
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
