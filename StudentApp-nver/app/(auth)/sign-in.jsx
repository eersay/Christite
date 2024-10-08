import React, { useState } from 'react';
import { GestureHandlerRootView, TouchableOpacity } from 'react-native-gesture-handler';
import { View, Text, StyleSheet, Image, ImageBackground, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '../../constants';
import CustomButton from '../../components/CustomButton';
import FormField from '../../components/FormField';
import { Link } from 'expo-router';
import { getCurrentUser, signIn } from '../../lib/appwrite';
import { router } from 'expo-router';
import { useGlobalContext } from "../../context/GlobalProvider";

const SignIn = ({ navigation }) => {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Destructure setUser and setIsLoggedIn from the global context
  const { setUser, setIsLoggedIn } = useGlobalContext();

  const submit = async () => {
    if (form.email === "" || form.password === "") {
      Alert.alert("Error", "Please fill in all fields");
      return; // Prevent submission if fields are empty
    }
  
    setIsSubmitting(true);
  
    try {
      await signIn(form.email, form.password);
      const result = await getCurrentUser();
  
      setUser(result);
      setIsLoggedIn(true);
      
      router.replace('/home');
    } catch (error) {
      // Handle incorrect password case
      if (error.message.includes("Invalid credentials")) {
        Alert.alert("Incorrect Password", "The password you entered is incorrect. Please try again.");
      } else {
        Alert.alert('Error', error.message); // Handle other errors
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ImageBackground source={images.signinbg1} style={styles.background}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.select({ ios: 0, android: 25 })}
        >
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <SafeAreaView style={styles.container}>
              {/* Header */}
              <View style={{ position: 'absolute', top: 70, right: 20, zIndex: 10 }}>
                <Image
                  source={images.emblem}
                  resizeMode='contain'
                  style={{ width: 100, height: 90 }}
                />
              </View>

              {/* Welcome Message */}
              <Text style={styles.welcome}>Hi !</Text>
              <Text style={styles.welcomee}>Welcome</Text>
              <Text style={styles.instructions}>Enter your Register Number and Password:</Text>

              {/* Email Input */}
              <FormField
                style={styles.input}
                title="Email"
                placeholder="Email"
                value={form.email}
                onChangeText={(e) => setForm({ ...form, email: e })}
              />

              {/* Password Input */}
              <FormField
                style={styles.input}
                title="Password"
                placeholder="Password"
                value={form.password}
                handleChangeText={(e) => setForm({ ...form, password: e })}
              />

              {/* Forgot Password */}
              <Link 
                href="/forgot"
                style={styles.row}>
                <Text style={styles.forgotPassword}>Forgot Password?</Text>
              </Link>

              {/* Log In Button */}
              <CustomButton
                title="Log In"
                handlePress={submit}
                containerStyles={styles.button}
                textStyle={styles.buttonText}
                isLoading={isSubmitting}
              />
            </SafeAreaView>
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
    </GestureHandlerRootView>
  );
};

export default SignIn;


// Styles
const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
    justifyContent: 'center',
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
