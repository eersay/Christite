import { StyleSheet, Text, View } from 'react-native'
import { SplashScreen, Slot, Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { useEffect } from 'react';

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const [fontsLoaded, error] =useFonts({
    "Arial":require("../assets/fonts/Arial.ttf"),
    "ArialBlackItalic": require("../assets/fonts/ArialBlackItalic.ttf"),
    "ArialBold": require("../assets/fonts/ArialBold.ttf"),
    "ArialItalic": require("../assets/fonts/ArialItalic.ttf"),
    "BookmanOldStyle":require("../assets/fonts/BookmanOldStyle.ttf"),
    "BookmanOldStyleBold":require("../assets/fonts/BookmanOldStyleBold.ttf"),
    "BookmanOldStlyeBoldItalic":require("../assets/fonts/BookmanOldStyleBoldItalic.ttf"),
    "BookmanOldStyleItalic":require("../assets/fonts/BookmanOldStyleItalic.ttf"),
    "TimesNewRoman": require("../assets/fonts/TimesNewRoman.ttf"),
    "TimesNewRomanBold": require("../assets/fonts/TimesNewRomanBold.ttf"),
    "TimesNewRomanItalic": require("../assets/fonts/TimesNewRomanItalic.ttf"),
    "TimesNewRomanBoldItalic": require("../assets/fonts/TimesNewRomanBoldItalic.ttf"),
  })

  useEffect(()=>{
    if(error) throw error;

    if(fontsLoaded) SplashScreen.hideAsync();
  },[fontsLoaded,error])

  if(!fontsLoaded && !error) return null;

  return(
    <Stack>
      <Stack.Screen 
        name="index"
        options={{
          headerShown:false
        }}  
        />
    </Stack>
  )
}

export default RootLayout
 