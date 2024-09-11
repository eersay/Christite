import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { Image, Text, View } from 'react-native';
import { Redirect, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';
import { images } from '../constants';
import tailwindConfig from "../tailwind.config";
import CustomButton from '../components/CustomButton';

const { colors } = tailwindConfig.theme.extend;

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView className="bg-white h-full">
        <ScrollView contentContainerStyle={{ paddingVertical: 20 }}>
          <View className="w-full justify-center items-center min-h-[85vh] px-6">
            <Image
              source={images.logoGold}
              className="w-[200px] h-[100px] mb-4"
              resizeMode="contain"
            />

            <Image
              source={images.openingScreen}
              className="max-w-[450px] w-full h-[400px] mb-4"
              resizeMode="contain"
            />
            <Text className="text-2xl text-darkBlue font-timesNewRomanBold text-center mb-6">
              CHRISTITE: Student App
            </Text>

            <CustomButton
              title="Get Started"
              handlePress={() => router.push('/sign-in')}
              containerStyles="w-full mt-7 bg-bluePantone hover:bg-lightBlue active:bg-darkBlue"
              textStyles="text-white"
            />
          </View>
        </ScrollView>

        <StatusBar backgroundColor={colors.darkBlue} style='light' />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
