import React, { useContext, useEffect } from "react";
import { Button, Image, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { FontAwesome, Feather } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import {
  useFonts,
  FiraSans_100Thin,
  FiraSans_100Thin_Italic,
  FiraSans_200ExtraLight,
  FiraSans_200ExtraLight_Italic,
  FiraSans_300Light,
  FiraSans_300Light_Italic,
  FiraSans_400Regular,
  FiraSans_400Regular_Italic,
  FiraSans_500Medium,
  FiraSans_500Medium_Italic,
  FiraSans_600SemiBold,
  FiraSans_600SemiBold_Italic,
  FiraSans_700Bold,
  FiraSans_700Bold_Italic,
  FiraSans_800ExtraBold,
  FiraSans_800ExtraBold_Italic,
  FiraSans_900Black,
  FiraSans_900Black_Italic,
} from "@expo-google-fonts/fira-sans";
import HomeScreen from "../screens/HomeScreen";
import DetailsScreen from "../screens/DetailsScreen";
import SearchScreen from "../screens/SearchScreen";
import SettingsScreen from "../screens/SettingsScreen";
import RegisterScreen from "../screens/RegisterScreen";
import LoginScreen from "../screens/LoginScreen";
import { ApolloProvider } from "@apollo/client";
import { AuthContext } from "../context/authContext";
import * as SecureStore from "expo-secure-store"

const Tab = createBottomTabNavigator();


export function LogoTitle() {
  return (
    <Image
      style={{ width: 54, height: 54 }}
      source={require("../../assets/logo.png")}
    />
  );
}
export default function MainTab({ route }) {
    const { setIsSignedIn} = useContext(AuthContext)
    return (

  

      <Tab.Navigator>
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarStyle: { backgroundColor: "black" },
            headerStyle: { backgroundColor: "black" },
            headerTitleAlign: "center",
            headerTitle: (props) => <LogoTitle {...props} />,
            headerRight: () => (
              <Feather
                name="log-out"
                size={27}
                color={"white"}
                onPress={async () => {
                  await SecureStore.deleteItemAsync("accessToken");
                  setIsSignedIn(false);
                }}
                style={{
                  paddingLeft: 8,
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              />
            ),
            tabBarIcon: ({ focused, color, size }) => (
              <FontAwesome
                name={focused ? "home" : "twitter"}
                size={size}
                color={color}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Search"
          component={SearchScreen}
          options={{
            tabBarStyle: { backgroundColor: "black" },
            headerStyle: { backgroundColor: "black" },
            headerTitleAlign: "center",
            headerTitle: (props) => <LogoTitle {...props} />,
            tabBarIcon: ({ focused, color, size }) => (
              <FontAwesome
                name={focused ? "search" : "globe"}
                size={size}
                color={color}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={SettingsScreen}
          options={{
            tabBarStyle: { backgroundColor: "black" },
            headerStyle: { backgroundColor: "black" },
            headerTitleAlign: "center",
            headerTitle: (props) => <LogoTitle {...props} />,
            tabBarIcon: ({ focused, color, size }) => (
              
              <Feather
                name={focused ? "user" : "users"}
                size={size}
                color={color}
              />
            ),
          }}
        />
      </Tab.Navigator>
    );
  }
  