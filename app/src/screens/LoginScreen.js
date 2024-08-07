import { useMutation } from "@apollo/client";
import { StatusBar } from "expo-status-bar";
import * as SecureStore from "expo-secure-store";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ImageBackground,
} from "react-native";
import { LOGIN_USER } from "../queries/users";
import { useContext, useState } from "react";
import { AuthContext } from "../context/authContext";

function LoginScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setIsSignedIn } = useContext(AuthContext);
  const [loginFn, { loading, error, data }] = useMutation(LOGIN_USER);
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ImageBackground
      src="https://marketplace.canva.com/EAGD_Vn7lkQ/1/0/900w/canva-blue-and-white-modern-watercolor-background-instagram-story-L-nceizV6kA.jpg"
      style={styles.container}>
      <StatusBar style="dark" />
      <Image
        style={styles.logo}
        source={require('../../assets/Catrip.png')}
      />

      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Username..."
          placeholderTextColor="#003f5c"
          onChangeText={setUsername}
        />
      </View>

      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Password..."
          placeholderTextColor="#003f5c"
          secureTextEntry
          onChangeText={setPassword}
        />
      </View>
      <View style={styles.btnContainer}>

        <TouchableOpacity
          style={styles.loginBtn}
          onPress={async () => {
            console.log(username, password, '<==')
            const result = await loginFn({
              variables: { password, username },
            });
            console.log(result, '<==')

            setIsSignedIn(true);

            await SecureStore.setItemAsync(
              "accessToken",
              result.data.login.accessToken
            );
          }}
        >
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>
        <Image style={styles.car} source={require('../../assets/car.png')} />
        <View style={styles.roadContainer}>
          <View style={styles.road} />
          <View style={styles.road} />
          <View style={styles.road} />
          <View style={styles.road} />
          <View style={styles.road} />
        </View>

        <TouchableOpacity
          style={styles.regis}
          onPress={() => {
            navigation.navigate("Register");
          }}
        >
          <Text style={styles.loginText}>To Register</Text>
        </TouchableOpacity>
      </View >
    </ImageBackground >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 40,
  },
  inputView: {
    width: "80%",
    backgroundColor: "#f2f2f2",
    borderRadius: 25,
    height: 50,
    marginBottom: 20,
    justifyContent: "center",
    padding: 20,
  },
  inputText: {
    height: 50,
    color: "#134B70",

  },
  loginBtn: {
    // width: "10",
    backgroundColor: "#134B70",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    marginBottom: -1,
  },
  roadContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginVertical: 0,
    backgroundColor: "#134B70",
  },
  road: {
    flex: 1,
    backgroundColor: "white",
    height: 7,
    marginHorizontal: 7,
  },
  regis: {
    // width: "100%",
    backgroundColor: "#134B70",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    // marginTop: 3,
    marginBottom: 10,
  },
  loginText: {
    color: "white",
    fontSize: 17
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
  errorText: {
    fontSize: 20,
    color: "red",
  },
  car: {
    position: 'absolute',
    top: '30.5%',
    left: '73%',
    width: 130,
    height: 65,
    // transform: [{ rotate: '90deg' }],
    zIndex: 1, // Make sure car is on top of other elements
    marginLeft: -32.5, // Adjust position to center the car
    marginTop: 10, // Adjust position to be on top of the button
  },
  btnContainer: {
    // flex: 1
  }
});

export default LoginScreen;
