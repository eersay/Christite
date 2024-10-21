import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { Image, Text, View, StyleSheet, Alert } from 'react-native';
import { Redirect, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';
import * as Notifications from 'expo-notifications'; // Import for notifications
import { images } from '../constants';
import CustomButton from '../components/CustomButton';
import { useEffect, useState } from 'react'; // Import useEffect and useState

async function registerForPushNotificationsAsync() {
  let token;

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    Alert.alert('Failed to get push token for notifications!');
    return;
  }

  token = (await Notifications.getExpoPushTokenAsync()).data;
  console.log('Expo Push Token:', token);

  // You need to store this token in your database for each user
  return token;
}

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState('');

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    // Handle notification received while the app is in the foreground
    const subscription = Notifications.addNotificationReceivedListener(notification => {
      Alert.alert('New Notification', notification.request.content.body);
    });

    return () => {
      Notifications.removeNotificationSubscription(subscription);
    };
  }, []);

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
    paddingHorizontal: 24,
  },
  logoImage: {
    width: 200,
    height: 100,
    marginBottom: 16,
  },
  openingImage: {
    maxWidth: 450,
    width: '100%',
    height: 400,
    marginBottom: 16,
  },
  titleText: {
    fontSize: 24,
    color: '#1E3A8A',
    fontWeight: 'bold',
    fontFamily: 'TimesNewRoman',
    textAlign: 'center',
    marginBottom: 24,
  },
  buttonContainer: {
    width: '100%',
    marginTop: 28,
    backgroundColor: '#2957A4',
  },
  buttonText: {
    color: 'white',
  },
});
