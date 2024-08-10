import React, { useState, useContext, useEffect } from "react";
import {
  Image,
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesome, Feather } from "@expo/vector-icons";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import HomeScreen from "../screens/HomeScreen";
import AddScreen from "../screens/AddScreen";
import SettingsScreen from "../screens/ActivityHistoryScreen";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../context/authContext";
import { Icon } from "react-native-paper";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useQuery } from "@apollo/client";
import { SEARCH_ACTIVITY } from "../queries/searchActivity.js";
import Map from "../googleMap/Map.js";
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
  const [searchResults, setSearchResults] = useState([]);

  const { refetch } = useQuery(SEARCH_ACTIVITY, {
    variables: { searchTerm: text },
    skip: true,
    onCompleted: (data) => {
      setSearchResults(data.searchActivity);
    },
  });

  useEffect(() => {
    if (text) {
      refetch({ searchTerm: text });
    } else {
      setSearchResults([]);
    }
  }, [text, refetch]);

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        children={() => <HomeScreen searchResults={searchResults} />}
        options={{
          tabBarLabel: () => null,
          tabBarStyle: { backgroundColor: "white" },
          headerStyle: { backgroundColor: "white" },
          headerTitleAlign: "center",
          headerTitle: () => (
            <View style={styles.addContainer}>
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
              <MaterialIcons
                name="luggage"
                size={25}
                color="black"
                onPress={() => navigation.navigate("Activity")}
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
            <MaterialCommunityIcons name={focused ? "home" : "home-outline"} size={24} color="black" />
          ),
        }}
      />
      <Tab.Screen
        name="Add"
        component={AddScreen}
        options={{
          tabBarLabel: () => null,
          tabBarStyle: { backgroundColor: "white" },
          headerStyle: { backgroundColor: "white" },
          headerTitleAlign: "center",
          headerTitle: () => <LogoTitle />,
          tabBarIcon: ({ focused, color, size }) => (
            <MaterialIcons name={focused ? "add-location-alt" : "add-location"} size={24} color="black" />
          ),
        }}
      />
      <Tab.Screen
        name="Map"
        component={Map}
        options={{
          tabBarLabel: () => null,
          tabBarStyle: { backgroundColor: "white" },
          headerStyle: { backgroundColor: "white" },
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
          tabBarLabel: () => null,
          tabBarStyle: { backgroundColor: "white" },
          headerStyle: { backgroundColor: "white" },
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
  addContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
    marginRight: 10,
  },
  headerIcon: {
    marginLeft: 15,
  },
});
