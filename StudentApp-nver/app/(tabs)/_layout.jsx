import { StatusBar } from "expo-status-bar";
import { Redirect, Tabs } from "expo-router";
import { Image, Text, View } from "react-native";
import { icons } from "../../constants";
import tailwindConfig from "../../tailwind.config";

const { colors } = tailwindConfig.theme.extend;

const TabIcon = ({ icon, color, name, focused }) => {
  const iconSize = (name === 'Attendance' || name === 'Marks') ? 30 : 24;
  return (
    <View className="flex items-center justify-center gap-2">
      <Image
        source={icon}
        resizeMode="contain"
        tintColor={color}
        className="w-6 h-6"
        style={{ width: iconSize, height: iconSize }} // Set dynamic width and height
      />
      <Text
        className={`${focused ? "font-arialBold" : "font-arial"} text-xs`}
        style={{ color: color }}
      >
        {name}
      </Text>
    </View>
  );
};


const TabsLayout = () => {
  return (
    <>
      <Tabs
        screenOptions={
          {
            tabBarShowLabel: false,
            tabBarActiveTintColor : colors.beigePantone,
            tabBarInactiveTintColor: colors.grayDark,
            tabBarStyle: { backgroundColor: colors.offWhite },
            borderTopWidth: 1,
            borderTopColor: colors.bluePantone,
            HEIGHT: 84,

          }
        }
      >
        <Tabs.Screen
          name="home"
          options={
            {
              title: 'Home',
              headerShown: false,
              tabBarIcon: ({color, focused})=>(
                <TabIcon
                  icon={icons.home}
                  color={color}
                  name="Home"
                  focused={focused}
                />
              )
            }        
          }

        />

<Tabs.Screen
          name="attendance"
          options={
            {
              title: 'Attendance',
              headerShown: false,
              tabBarIcon: ({color, focused})=>(
                <TabIcon
                  icon={icons.attendance}
                  color={color}
                  name="Attendance"
                  focused={focused}
                />
              )
            }        
          }

        />


<Tabs.Screen
          name="marks"
          options={
            {
              title: 'Marks',
              headerShown: false,
              tabBarIcon: ({color, focused})=>(
                <TabIcon
                  icon={icons.marks}
                  color={color}
                  name="Marks"
                  focused={focused}
                />
              )
            }        
          }

        />

<Tabs.Screen
          name="profile"
          options={
            {
              title: 'Profile',
              headerShown: false,
              tabBarIcon: ({color, focused})=>(
                <TabIcon
                  icon={icons.profile}
                  color={color}
                  name="Profile"
                  focused={focused}
                />
              )
            }        
          }

        />

      </Tabs>
    </>
  )
}

export default TabsLayout