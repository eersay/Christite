import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { Image, Text, View, StyleSheet } from 'react-native';
import { Redirect, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';
import { images } from '../constants';
import CustomButton from '../components/CustomButton';
import { useGlobalContext } from '../context/GlobalProvider';

export default function App() {
  const {isLoading, isLoggedIn}=useGlobalContext();
  if(!isLoading && isLoggedIn) return <Redirect href="/home"/>
 
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.safeAreaView}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.container}>
            <Image
              source={images.logoGold}
              style={styles.logoImage}
              resizeMode="contain"
            />

            <Image
              source={images.openingScreen}
              style={styles.openingImage}
              resizeMode="contain"
            />

            <Text style={styles.titleText}>
              CHRISTITE: Student App
            </Text>

            <CustomButton
              title="Get Started"
              handlePress={() => router.push('/sign-in')}
              containerStyles={styles.buttonContainer}
              textStyles={styles.buttonText}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    backgroundColor: 'white',
    flex: 1,
  },
  scrollViewContent: {
    paddingVertical: 20,
  },
  container: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '85%',
    paddingHorizontal: 24, // Equivalent to `px-6` (6 * 4 = 24 in Tailwind)
  },
  logoImage: {
    width: 200,  // Equivalent to `w-[200px]`
    height: 100, // Equivalent to `h-[100px]`
    marginBottom: 16, // Equivalent to `mb-4` (4 * 4 = 16 in Tailwind)
  },
  openingImage: {
    maxWidth: 450, // Equivalent to `max-w-[450px]`
    width: '100%', // Equivalent to `w-full`
    height: 400,   // Equivalent to `h-[400px]`
    marginBottom: 16, // Equivalent to `mb-4`
  },
  titleText: {
    fontSize: 24, // Equivalent to `text-2xl`
    color: '#1E3A8A', // Equivalent to `text-darkBlue` (assuming a custom Tailwind color)
    fontWeight: 'bold',
    fontFamily: 'TimesNewRoman', // Equivalent to `font-timesNewRomanBold`
    textAlign: 'center',
    marginBottom: 24, // Equivalent to `mb-6`
  },
  buttonContainer: {
    width: '100%',
    marginTop: 28, // Equivalent to `mt-7` (7 * 4 = 28)
    backgroundColor: '#2957A4', // Equivalent to `bg-bluePantone`
  },
  buttonText: {
    color: 'white', // Equivalent to `text-white`
  },
});
