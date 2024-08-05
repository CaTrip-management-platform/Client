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
} from "react-native";
import { LOGIN_USER } from "../queries/users";
import { useContext, useState } from "react";
import { ActivityIndicator } from "react-native-paper";
import { AuthContext } from "../context/authContext";

function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setIsSignedIn } = useContext(AuthContext);
  const [loginFn, { loading, error, data }] = useMutation(LOGIN_USER);

  // const handleLogin = async () => {
  //   try {
  //     const response = await login({
  //       variables: {
  //         username,
  //         password,
  //       },
  //     });
  //     // navigation.navigate('Navigation');
  //     await SecureStore.setItemAsync("accessToken", data.login.access_token);
  //     setIsSignedIn(true);
  //     console.log(isSignedIn);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // if (error ) {
  //   return (
  //     <View style={styles.errorContainer}>
  //       <Text style={styles.errorText}>Incorrect Username or Password!</Text>
  //     </View>
  //   );
  // }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Text
        style={{
          textAlign: "center",
          width: 150,
          height: 210,
        }}
      >
        <Image
          style={{ width: 100, height: 100 }}
          source={{
            uri: "https://img.freepik.com/premium-vector/white-letter-r-black-background_853558-3686.jpg?w=740",
          }}
        />
      </Text>

      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Email..."
          placeholderTextColor="#003f5c"
          keyboardType="email-address"
          onChangeText={setEmail}
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

      <TouchableOpacity
        style={styles.loginBtn}
        onPress={async () => {
          const result = await loginFn({
            variables: { email, password },
          });

          setIsSignedIn(true);

          await SecureStore.setItemAsync(
            "accessToken",
            result.data.login.accessToken
          );
        }}
      >
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>
      <Text style={styles.loginText}>Don't Have an Account?</Text>

      <TouchableOpacity
        style={styles.regis}
        onPress={() => {
          navigation.navigate("Register");
        }}
      >
        <Text style={styles.loginText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    fontWeight: "bold",
    fontSize: 50,
    color: "#1DA1F2",
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
    color: "black",
  },
  loginBtn: {
    width: "80%",
    backgroundColor: "#0B60B0",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    marginBottom: 10,
  },
  regis: {
    width: "80%",
    backgroundColor: "#0B60B0",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  loginText: {
    color: "white",
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
});

export default LoginScreen;
