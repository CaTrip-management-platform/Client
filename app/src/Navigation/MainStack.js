import { View, Text, StatusBar } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthContext } from "../context/authContext";
import * as SecureStore from "expo-secure-store"
import MainTab, { LogoTitle } from "./MainTab";
import DetailsScreen from "../screens/DetailsScreen";
import SearchScreen from "../screens/SearchScreen";
import SettingsScreen from "../screens/SettingsScreen";
import RegisterScreen from "../screens/RegisterScreen";
import LoginScreen from "../screens/LoginScreen";
import { NavigationContainer } from "@react-navigation/native";
import { ActivityIndicator } from "react-native-paper";

const Stack = createNativeStackNavigator();
const MainStack = () => {
    const {isSignedIn, setIsSignedIn} = useContext(AuthContext)
const [fetchTokenLoading, setfetchTokenLoading] = useState(true)
    useEffect(() => {
        SecureStore.getItemAsync("accessToken")
        .then((accessToken) => {
          if (accessToken) {
            setIsSignedIn(true);
          }
          setfetchTokenLoading(false)
        });
      }, [setIsSignedIn]);

      if (fetchTokenLoading){
        return <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
<ActivityIndicator size={"large"}/>
        </View>
      }
    
  return (
    <NavigationContainer>
      <StatusBar style="auto" />

      <Stack.Navigator initialRouteName={"Login"}>
        {isSignedIn ? (
          <>
            <Stack.Screen
              name="MainTab"
              component={MainTab}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Detail"
              component={DetailsScreen}
              options={{
                tabBarStyle: { backgroundColor: "black" },
                headerStyle: { backgroundColor: "black" },
                headerTitleAlign: "center",
                headerTitle: (props) => <LogoTitle {...props} />,
                tabBarIcon: ({ focused, color, size }) => (
                  <FontAwesome
                    name={focused ? "home" : "twitter"}
                    size={size}
                    color={color}
                  />
                ),
              }}
            />
            <Stack.Screen
              name="Settings"
              component={SettingsScreen}
              options={{ headerShown: false }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{
                headerStyle: { backgroundColor: "black" },
                headerTitleAlign: "center",
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{
                headerStyle: { backgroundColor: "black" },
                headerTitleAlign: "center",
                headerShown: false,
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainStack;
