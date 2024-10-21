import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator, Image, ImageBackground } from 'react-native';
import CustomButton from '../../components/CustomButton';  // Assuming you have a CustomButton component
import { handleForgotPassword } from '../../lib/appwrite';  // Import the function from appwrite.jsx
import { images } from '../../constants';


const ForgetPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address.');
      return;
    }

    setIsSubmitting(true);

    const result = await handleForgotPassword(email);

    if (result.success) {
      Alert.alert('Success', 'Password reset link sent to your email.');
    } else {
      Alert.alert('Error', result.error || 'Unable to send reset email. Please try again.');
    }

    setIsSubmitting(false);
  };

  return (
    <ImageBackground source={images.signinbg1} style={styles.background}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
        <Image
          source={images.emblem}
          resizeMode='contain'
          style={styles.logo}
        />
        </View>

        <Text style={styles.welcome}>Forgot Password</Text>
        <Text style={styles.instructions}>
          Enter your email address, and we will send you a password reset link.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          value={email}
          onChangeText={(text) => setEmail(text)}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <CustomButton
          title="Send Reset Link"
          handlePress={handleSubmit}
          containerStyles={styles.button}
          textStyle={styles.buttonText}
          isLoading={isSubmitting}
        />

        {isSubmitting && <ActivityIndicator size="large" color="#1C2E4A" />}
      </View>
    </ImageBackground>
  );
};

export default ForgetPassword;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 40,
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 40,
  },
  welcome: {
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'left',
    marginTop: 10,
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
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
