import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { REGISTER_USER } from '../queries/users.js'; 
import { useNavigation } from '@react-navigation/native';
// import { GET_POST } from '../queries/posts.js';


function RegisterScreen() {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState('');
  
const navigation = useNavigation()

const [registerUser] = useMutation(REGISTER_USER, {
  onCompleted: () => {
    navigation.navigate('Login');
  },
// refetchQueries:[GET_POST]
});

  const handleRegister = async () => {
    try {
      const { data } = await registerUser({
        variables: { name, username, email, password, image },
      });
      
      } catch (err) {
    console.log(err)
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.logoContainer}>
        <Image
          style={styles.logo}
          source={{
            uri: 'https://img.freepik.com/premium-vector/white-letter-r-black-background_853558-3686.jpg?w=740',
          }}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Name..."
          placeholderTextColor="#003f5c"
          value={name}
          onChangeText={setName}
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
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Image URL..."
          placeholderTextColor="#003f5c"
          value={image}
          onChangeText={setImage}
        />
      </View>
      <TouchableOpacity style={styles.registerBtn} onPress={handleRegister}>
        <Text style={styles.registerText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 100,
  },
  inputView: {
    width: '80%',
    backgroundColor: '#f2f2f2',
    borderRadius: 25,
    height: 50,
    marginBottom: 20,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  inputText: {
    height: 50,
    color: 'black',
  },
  registerBtn: {
    width: '80%',
    backgroundColor: '#0B60B0',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 10,
  },
  registerText: {
    color: 'white',
  },
});

export default RegisterScreen;
