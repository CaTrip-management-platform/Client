import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { useQuery } from "@apollo/client";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator } from "react-native-paper";
import { GET_USER_BY_ID } from "../queries/users.js";
import * as SecureStore from "expo-secure-store"
import { jwtDecode } from "jwt-decode";

function SettingsScreen() {
  const [user, setUser] = useState(null);








  const [userid, setUserid] = useState("");

    const fetchTokenData = async () => {
      try {
        const token = await SecureStore.getItemAsync("accessToken");
        // console.log(token)
        if (token) {
          const decoded = jwtDecode(token);
          setUserid(decoded);
        }
      } catch (error) {
        console.error("Error fetching token data:", error);
      }
    };

    fetchTokenData();



  const { _id, imageUser } = userid;



  const { loading, error, data } = useQuery(GET_USER_BY_ID, {
    variables: { userId: _id }
  });

  useEffect(() => {
    if (data && data.findUserById) {
      setUser(data.findUserById);
    }
  }, [data]);

 

  if (loading) {
    return (
      <ActivityIndicator size="large" color="blue" style={styles.loader} />
    );
  }

  if (error) {
    return <Text style={styles.errorText}>Error! {error.message}</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Image
          source={{
            uri: imageUser || "https://i0.wp.com/terpanas.id/wp-content/uploads/2017/07/VIDEO-LUCU-ORANG-UTAN-SAAT-CARI-PERHATIAN-3.jpg?resize=590%2C350",
          }}
          style={styles.profilePicture}
        />
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.username}>@{user?.username}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{user?.email}</Text>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color:"white"
  },
  username: {
    fontSize: 16,
    color: "#555",
    marginBottom: 10,
  },
  infoContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color:"white",
    alignContent:"center",
    alignItems:"center"
  },
  value: {
    fontSize: 16,
    marginBottom: 10,
    color:"white"
  },
  button: {
    backgroundColor: "#1DA1F2",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
});

export default SettingsScreen;
