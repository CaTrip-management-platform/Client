import React, { useContext, useEffect, useState } from "react";
import { View, StatusBar } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { AuthContext } from "../context/authContext";
import * as SecureStore from "expo-secure-store";
import MainTab from "./MainTab";
import DetailsScreen from "../screens/DetailsScreen";
import SettingsScreen from "../screens/SettingsScreen";
import RegisterScreen from "../screens/RegisterScreen";
import LoginScreen from "../screens/LoginScreen";
import { NavigationContainer } from "@react-navigation/native";
import { ActivityIndicator } from "react-native-paper";
import RightDrawerContent from "../components/rightDrawer";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const AuthStack = () => (
  <Stack.Navigator initialRouteName={"Login"}>
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
  </Stack.Navigator>
);

const AppStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="MainTab"
      component={MainTab}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Detail"
      component={DetailsScreen}
      options={{
        headerStyle: { backgroundColor: "black" },
        headerTitleAlign: "center",
      }}
    />
    <Stack.Screen
      name="Settings"
      component={SettingsScreen}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

const MainStack = () => {
  const { isSignedIn, setIsSignedIn } = useContext(AuthContext);
  const [fetchTokenLoading, setFetchTokenLoading] = useState(true);

  useEffect(() => {
    SecureStore.getItemAsync("accessToken")
      .then((accessToken) => {
        if (accessToken) {
          setIsSignedIn(true);
        }
        setFetchTokenLoading(false);
      });
  }, [setIsSignedIn]);

  if (fetchTokenLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size={"large"} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Drawer.Navigator
        id="RightDrawer"
        drawerContent={(props) => <RightDrawerContent {...props} />}
        screenOptions={{
          drawerPosition: 'right',
          headerShown: false,
          overlayStyle: { backgroundColor: 'rgba(0, 0, 0, 0.1)' }, 
          drawerStyle: {
            backgroundColor: 'rgba(0, 0, 0, 0.2)', 
          },
        }}
        sceneContainerStyle={{ backgroundColor: 'transparent' }} 
      >
        {isSignedIn ? (
          <Drawer.Screen name="AppStack" component={AppStack} />
        ) : (
          <Drawer.Screen name="AuthStack" component={AuthStack} />
        )}
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default MainStack;
