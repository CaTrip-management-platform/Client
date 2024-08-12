import React, { useContext, useEffect, useState } from "react";
import { View, StatusBar, ActivityIndicator, StyleSheet } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import { AuthContext } from "../context/authContext";
import MainTab from "./MainTab";
import DetailsScreen from "../screens/DetailsScreen";
import ActivityHistoryScreen from "../screens/ActivityHistoryScreen";
import RegisterScreen from "../screens/RegisterScreen";
import LoginScreen from "../screens/LoginScreen";
import ActivityScreen from "../screens/ActivityScreen";
import Map from "../googleMap/Map";
import HomeScreen from "../screens/HomeScreen";
import AddScreen from "../screens/AddScreen";
const Stack = createNativeStackNavigator();

const AuthStack = () => (
  <Stack.Navigator initialRouteName="Login"> 
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
      name="ActivityHistory"
      component={ActivityHistoryScreen}
      options={{ headerShown: false }}
    />
       <Stack.Screen
      name="Add"
      component={AddScreen}
      options={{ headerShown: true }}
    />
    <Stack.Screen
      name="Activity"
      component={ActivityScreen}
      options={{ headerShown: true }}
    />
    <Stack.Screen name="Map" component={Map} options={{ headerShown: true }} />
    <Stack.Screen
      name="Home"
      component={HomeScreen}
      options={{ headerShown: true }}
    />
  </Stack.Navigator>
);

const MainStack = () => {
  const { isSignedIn, setIsSignedIn } = useContext(AuthContext);
  const [fetchTokenLoading, setFetchTokenLoading] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const accessToken = await SecureStore.getItemAsync("accessToken");
        console.log("MainStack Token:", accessToken); 
        if (accessToken) {
          setIsSignedIn(true);
        } else {
          setIsSignedIn(false);
        }
      } catch (error) {
        console.error("Error fetching token:", error);
        setIsSignedIn(false);
      } finally {
        setFetchTokenLoading(false);
      }
    };

    checkToken();
  }, [setIsSignedIn]);

  if (fetchTokenLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isSignedIn ? (
          <Stack.Screen
            name="AppStack"
            component={AppStack}
            options={{ headerShown: false }}
          />
        ) : (
          <Stack.Screen
            name="AuthStack"
            component={AuthStack}
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default MainStack;
