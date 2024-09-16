import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import CustomButton from '../../components/CustomButton';  // Assuming you have a CustomButton component
import { handleForgotPassword } from '../../lib/appwrite';  // Import the function from appwrite.jsx

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
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>
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
  );
};

export default ForgetPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1C2E4A',
  },
  instructions: {
    fontSize: 16,
    color: '#1C2E4A',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
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
