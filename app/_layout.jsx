import { StyleSheet, Text, View } from 'react-native';
import { SplashScreen, Slot, Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { useEffect } from 'react';
import { ThemeProvider } from '../context/ThemeContext';

SplashScreen.preventAutoHideAsync(); // Prevent splash screen from auto-hiding

const RootLayout = () => {
  const [fontsLoaded, error] = useFonts({
   
  });

  useEffect(() => {
    if (error) {
      console.error('Font loading error:', error);
      throw error; // Throw the error so it gets caught by error boundaries or logs
    }

    if (fontsLoaded) {
      SplashScreen.hideAsync(); // Hide the splash screen once fonts are loaded
    }
  }, [fontsLoaded, error]);

  if (!fontsLoaded && !error) return null; // Return null until fonts are loaded or an error occurs

  return (
    <ThemeProvider>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="(auth)"
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false
          }}
        />
        {/* Additional screens can be added here */}
        
        {/* <Stack.Screen 
          name="(search/{query})"
          options={{
            headerShown:false
          }}  
        /> */}
      </Stack>
    </ThemeProvider>
  );
};

export default RootLayout;
