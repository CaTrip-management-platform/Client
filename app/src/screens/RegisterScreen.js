import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ImageBackground,
  Alert,
} from "react-native";
import { useState } from "react";
import { useMutation } from "@apollo/client";
import { REGISTER_USER } from "../queries/users.js";
import { useNavigation } from "@react-navigation/native";
// import { GET_POST } from '../queries/posts.js';

function RegisterScreen() {
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigation = useNavigation();

  const [registerUser, { loading, error, data }] = useMutation(REGISTER_USER, {
    onCompleted: () => {
      navigation.navigate("Login");
    },
    // refetchQueries:[GET_POST]
  });

  const handleRegister = async () => {
    try {
      const result = await registerUser({
        variables: { username, phoneNumber, email, password },
      });
    } catch (err) {
      console.log(err);
      Alert.alert("Error", err.message);
    }
  };

  return (
    <ImageBackground
      src="https://marketplace.canva.com/EAGD_Vn7lkQ/1/0/900w/canva-blue-and-white-modern-watercolor-background-instagram-story-L-nceizV6kA.jpg"
      style={styles.container}
    >
      <StatusBar style="dark" />
      <View style={styles.logoContainer}>
        <Image
          style={styles.logo}
          source={require("../../assets/Catrip.png")}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Username..."
          placeholderTextColor="#003f5c"
          value={username}
          onChangeText={setUsername}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="PhoneNumber..."
          placeholderTextColor="#003f5c"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Email..."
          placeholderTextColor="#003f5c"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Password..."
          placeholderTextColor="#003f5c"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>
      <View>
        <TouchableOpacity style={styles.registerBtn} onPress={handleRegister}>
          <Text style={styles.registerText}>Register</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.regis} onPress={handleRegister}>
          <Text
            style={{ fontSize: 17 }}
            onPress={() => {
              navigation.navigate("Login");
            }}
          >
            Already have an account? Login
          </Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  logoContainer: {
    marginBottom: 40,
    alignItems: "center",
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 5,
  },
  inputView: {
    width: "80%",
    backgroundColor: "#f2f2f2",
    borderRadius: 25,
    height: 50,
    marginBottom: 20,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  inputText: {
    height: 50,
    color: "black",
  },
  roadContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    marginVertical: 0,
    backgroundColor: "#134B70",
  },
  road: {
    flex: 1,
    backgroundColor: "white",
    height: 7,
    marginHorizontal: 7,
  },
  registerBtn: {
    backgroundColor: "#134B70",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 40,
    borderRadius: 25,
    width: 320,
  },
  role: {
    width: "50%",
    backgroundColor: "white",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 7,
    // marginTop: 40,
    // marginBottom: 10,
  },
  roleText: {
    color: "black",
  },
  regis: {
    borderWidth: 2,
    borderColor: "#134B70",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    borderRadius: 25,
  },
  registerText: {
    color: "white",
    fontSize: 17,
  },
  car: {
    position: "absolute",
    top: "30.5%",
    left: "15%",
    width: 130,
    height: 65,

    zIndex: 1,
    marginLeft: -32.5,
    marginTop: 10,
  },

  roleContainer: {
    flexDirection: "row",
    width: "80%",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  roleButton: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    borderRadius: 25,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
  },
  selectedRole: {
    backgroundColor: "#134B70",
  },
  roleText: {
    color: "#003f5c",
    fontSize: 16,
  },
  selectedRoleText: {
    color: "white",
  },
});

export default RegisterScreen;
