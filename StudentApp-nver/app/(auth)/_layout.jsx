import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import tailwindConfig from "../../tailwind.config";

const { colors } = tailwindConfig.theme.extend;

const AuthLayout = () => {
  return (
    <>
    <Stack>
      <Stack.Screen 
        name="sign-in"
        options={{
          headerShown:false
        }}  
        />
    </Stack>

    <StatusBar backgroundColor={colors.darkBlue} style='light' />


    </>
  )
}

export default AuthLayout