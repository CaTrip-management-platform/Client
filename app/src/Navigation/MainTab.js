import React, { useState, useContext } from "react";
import {
  Image,
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesome, Feather } from "@expo/vector-icons";
import HomeScreen from "../screens/HomeScreen";
import SearchScreen from "../screens/SearchScreen";
import SettingsScreen from "../screens/SettingsScreen";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../context/authContext";
import { Icon } from "react-native-paper";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const Tab = createBottomTabNavigator();

export function LogoTitle() {
  return (
    <Image style={styles.logo} source={require("../../assets/logo.png")} />
  );
}

export default function MainTab() {
  const navigation = useNavigation();
  const { setIsSignedIn } = useContext(AuthContext);
  const [text, setText] = useState("");

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarStyle: { backgroundColor: "white" },
          headerStyle: { backgroundColor: "white" },
          headerTitleAlign: "center",
          headerTitle: () => (
            <View style={styles.searchContainer}>
              <View style={styles.inputWrapper}>
                <TextInput
                  placeholder="Cari"
                  placeholderTextColor="black"
                  style={styles.input}
                  value={text}
                  onChangeText={setText}
                />
                <TouchableOpacity style={styles.iconWrapper}>
                  <Icon name="search" size={24} color="#aaa" />
                </TouchableOpacity>
              </View>
            </View>
          ),
          headerLeft: () => <LogoTitle />,
          headerRight: () => (
            <View style={styles.headerRightContainer}>
              <MaterialIcons name="luggage" size={25} color="black"
                onPress={() => navigation.navigate('Activity')}
              />
              <Feather
                name="menu"
                size={27}
                color={"black"}
                onPress={() => navigation.getParent("RightDrawer").openDrawer()}
                style={styles.headerIcon}
              />
            </View>
          ),
          tabBarIcon: ({ focused, color, size }) => (
            <FontAwesome
              name={focused ? "home" : "plane"}
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
          headerTitle: () => <LogoTitle />,
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
          headerTitle: () => <LogoTitle />,
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

const styles = StyleSheet.create({
  logo: {
    width: 80,
    height: 80,
  },
  searchContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    width: 250,
    height: 40,
    borderRadius: 20,
    borderColor: "black",
    backgroundColor: "#aaa",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  input: {
    flex: 1,
    height: "100%",
    borderRadius: 20,
    paddingHorizontal: 10,
  },
  iconWrapper: {
    padding: 10,
  },
  headerRightContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10, // Adjust margin as needed
  },
  headerIcon: {
    marginLeft: 15, // Space between icons
  },
});