import React, { useState } from 'react';
import { GestureHandlerRootView, ScrollView, TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { Image, View, Text, ImageBackground, CheckBox } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '../../constants';
import CustomButton from '../../components/CustomButton';

const SignIn = () => {
  const [form, setForm] = useState({
    registerNumber: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const submit = () => {
    // Your submit logic
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* Set ImageBackground as the main container */}
      <ImageBackground 
        source={images.signinbg1} // Replace with your background image source
        style={{ flex: 1 }} // Ensure it takes full height
        resizeMode="cover"
      >
        
        {/* SafeAreaView to handle notches and insets */}
        <SafeAreaView style={{ flex: 1 }}>
          {/* Logo at the top right corner */}
          <View style={{ position: 'absolute', top: 20, right: 20, zIndex: 10 }}>
            <Image
              source={images.logoSmall}
              resizeMode='contain'
              style={{ width: 100, height: 90 }}
            />
          </View>

          {/* Content within ScrollView */}
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
              {/* Welcome text */}
              <View style={{ width: '100%', alignItems: 'flex-start', marginBottom: 20 }}>
                <Text style={{ fontSize: 36, fontWeight: 'bold', color: '#000', textAlign: 'left', fontFamily: 'Roboto' }}>
                  Hi!
                </Text>
                <Text style={{ fontSize: 36, fontWeight: 'bold', color: '#000', textAlign: 'left', fontFamily: 'Roboto' }}>
                  Welcome
                </Text>
              </View>

              <Text style={{ fontSize: 16, color: '#888', marginBottom: 20, textAlign: 'left', width: '100%' }}>
                Enter your Register Number and Password:
              </Text>

              {/* Register Number input */}
              <TextInput
                style={{
                  width: '100%',
                  borderBottomWidth: 1,
                  borderColor: '#ccc',
                  marginTop: 30,
                  paddingBottom: 8,
                  fontSize: 16
                }}
                placeholder="Register Number"
                value={form.registerNumber}
                onChangeText={(e) => setForm({ ...form, registerNumber: e })}
              />

              {/* Password input */}
              <TextInput
                style={{
                  width: '100%',
                  borderBottomWidth: 1,
                  borderColor: '#ccc',
                  marginTop: 20,
                  marginBottom: 20,
                  paddingBottom: 8,
                  fontSize: 16
                }}
                placeholder="Password"
                secureTextEntry
                value={form.password}
                onChangeText={(e) => setForm({ ...form, password: e })}
              />

              {/* Remember Me and Forgot Password section */}
             {/*  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 20, width: '100%' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <CheckBox
                    value={rememberMe}
                    onValueChange={setRememberMe}
                  />
                  <Text style={{ marginLeft: 5 }}>Remember Me</Text>
                </View>
                <TouchableOpacity>
                  <Text style={{ color: '#888' }}>Forgot Password?</Text>
                </TouchableOpacity>
              </View> */}

              {/* Log In button */}
              <CustomButton
                title="Log In"
                handlePress={submit}
                containerStyles={{
                  marginTop: 20, // Adjusted to prevent overlap
                  width: '100%',
                  backgroundColor: '#333',
                  paddingVertical: 12,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
                textStyle={{ color: '#fff', fontSize: 18 }}
                isLoading={isSubmitting}
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
    </GestureHandlerRootView>
  );
}

export default SignIn;
