import React, { useState, useContext, useEffect } from "react";
import {
  Image,
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Text,
  Button,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesome, Feather } from "@expo/vector-icons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import HomeScreen from "../screens/HomeScreen";
import AddTripUserScreen from "../screens/AddTripUserScreen";
import SettingsScreen from "../screens/ActivityHistoryScreen";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../context/authContext";
import { Icon } from "react-native-paper";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useQuery } from "@apollo/client";
import { SEARCH_ACTIVITY } from "../queries/searchActivity.js";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import ActivityScreen from "../screens/ActivityScreen.js";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import * as SecureStore from "expo-secure-store";

const Tab = createBottomTabNavigator();

export function LogoTitle() {
  return (
    <Image style={styles.logo} source={require("../../assets/logo.png")} />
  );
}

export default function MainTab() {
  const [isFocused, setIsFocused] = useState(false);
  const navigation = useNavigation();
  const { setIsSignedIn } = useContext(AuthContext);
  const [text, setText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [userRole, setUserRole] = useState(null);

  const [isModalVisible, setIsModalVisible] = useState(false);

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

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const role = await SecureStore.getItemAsync("role");
        if (role) {
          setUserRole(role);
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    };

    fetchUserRole();
  }, []);

  const renderHeaderLeft = () => {
    if (userRole === "admin") {
      return (
        <FontAwesome5
          name="plus-circle"
          size={24}
          color="black"
          style={styles.headerIcon}
          onPress={() => navigation.push("Add")}
        />
      );
    }
    return null;
  };

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync("accessToken");
    await SecureStore.deleteItemAsync("role");
    await SecureStore.deleteItemAsync("_id");
    setIsSignedIn(false);
  };

  return (
    <>
      <Tab.Navigator>
        <Tab.Screen
          name="Home"
          children={() => (
            <HomeScreen searchResults={searchResults} isFocused={isFocused} />
          )}
          options={{
            tabBarLabel: () => null,
            tabBarStyle: { backgroundColor: "white" },
            headerStyle: { backgroundColor: "white" },
            headerTitleAlign: "center",
            headerTitle: () => (
              <View style={styles.addContainer}>
                <View style={styles.inputWrapper}>
                  <TextInput
                    placeholder="Search Activity"
                    placeholderTextColor="#868C97"
                    style={styles.input}
                    value={text}
                    onChangeText={setText}
                    onFocus={() => {
                      setIsFocused(true);
                    }}
                    onBlur={() => {
                      setIsFocused(false);
                    }}
                  />
                  <TouchableOpacity style={styles.iconWrapper}>
                    <Icon name="search" size={24} color="#aaa" />
                  </TouchableOpacity>
                </View>
              </View>
            ),
            headerRight: () => <LogoTitle />,
            headerLeft: () => null,
            tabBarIcon: ({ focused, color, size }) => (
              <MaterialCommunityIcons
                name={focused ? "home" : "home-outline"}
                size={24}
                color="black"
              />
            ),
          }}
        />

        <Tab.Screen
          name="Activity"
          component={ActivityScreen}
          options={{
            tabBarLabel: () => null,
            tabBarStyle: { backgroundColor: "white" },
            headerStyle: { backgroundColor: "white" },
            headerTitleAlign: "center",
            headerTitle: () => <LogoTitle />,
            tabBarIcon: ({ focused, color, size }) =>
              focused ? (
                <MaterialIcons name="luggage" size={25} color="black" />
              ) : (
                <FontAwesome6
                  name="person-walking-luggage"
                  size={24}
                  color="black"
                />
              ),
          }}
        />
        <Tab.Screen
          name="AddTrip"
          component={AddTripUserScreen}
          options={{
            tabBarLabel: () => null,
            headerShown: false,
            tabBarIcon: ({ focused, color, size }) => (
              <MaterialIcons
                name={focused ? "add-location-alt" : "add-location"}
                size={24}
                color="black"
              />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={SettingsScreen}
          options={{
            tabBarLabel: () => null,
            headerLeft: () => renderHeaderLeft(),
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
            headerRight: () => {
              return (
                <View style={styles.headerRightContainer}>
                  <FontAwesome
                    name="sign-out"
                    size={24}
                    color="black"
                    onPress={() => setIsModalVisible(true)}
                  />
                </View>
              );
            },
          }}
        />
      </Tab.Navigator>

      <Modal
        transparent={true}
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Confirm Logout</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to log out?
            </Text>
            <View style={styles.modalButtons}>
              <Button title="Cancel" onPress={() => setIsModalVisible(false)} />
              <Button title="Logout" color="red" onPress={handleLogout} />
            </View>
          </View>
        </View>
      </Modal>
    </>
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
  },
  inputWrapper: {
    flexDirection: "row",
    width: 310,
    right: 30,
    height: 40,
    borderRadius: 20,
    backgroundColor: "silver",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    height: "100%",
    borderRadius: 20,
    paddingHorizontal: 10,
    fontSize: 16,
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
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
});
