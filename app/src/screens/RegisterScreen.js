import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { REGISTER_USER } from '../queries/users.js';
import { useNavigation } from '@react-navigation/native';
// import { GET_POST } from '../queries/posts.js';


function RegisterScreen() {
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');

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
        variables: { name, username, email, password, role },
      });
 
    } catch (err) {
      console.log(err)
    }
  };

  return (
    <ImageBackground
      src="https://marketplace.canva.com/EAGD_Vn7lkQ/1/0/900w/canva-blue-and-white-modern-watercolor-background-instagram-story-L-nceizV6kA.jpg"
      style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.logoContainer}>
        <Image
          style={styles.logo}
          source={require('../../assets/Catrip.png')}
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
          value={phone}
          onChangeText={setPhone}
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

      <View style={styles.roleContainer}>
        <TouchableOpacity
          style={[styles.roleButton, role === 'Seller' && styles.selectedRole]}
          onPress={() => setRole('Seller')}>
          <Text style={[styles.roleText, role === 'Seller' && styles.selectedRoleText]}>Seller</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.roleButton, role === 'Customer' && styles.selectedRole]}
          onPress={() => setRole('Customer')}>
          <Text style={[styles.roleText, role === 'Customer' && styles.selectedRoleText]}>Customer</Text>
        </TouchableOpacity>
      </View>


      <View style={styles.btnContainer}>
        <TouchableOpacity style={styles.registerBtn} onPress={handleRegister}>
          <Text style={styles.registerText}>Register</Text>
        </TouchableOpacity>
        <Image style={styles.car} source={require('../../assets/car.png')} />
        <View style={styles.roadContainer}>
          <View style={styles.road} />
          <View style={styles.road} />
          <View style={styles.road} />
          <View style={styles.road} />
          <View style={styles.road} />
        </View>
        <TouchableOpacity style={styles.regis} onPress={handleRegister}>
          <Text style={styles.registerText}
            onPress={() => {
              navigation.navigate("Login");
            }}
          >To Login</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 5,
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
  registerBtn: {
    // width: '100%',
    backgroundColor: "#134B70",
    // borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    // marginBottom: 10,
  },
  role: {
    width: '50%',
    backgroundColor: "white",
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 7
    // marginTop: 40,
    // marginBottom: 10,
  },
  roleText: {
    color: 'black',
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
  registerText: {
    color: 'white',
  },
  car: {
    position: 'absolute',
    top: '30.5%',
    left: '15%',
    width: 130,
    height: 65,
    // transform: [{ rotate: '90deg' }],
    zIndex: 1, // Make sure car is on top of other elements
    marginLeft: -32.5, // Adjust position to center the car
    marginTop: 10, // Adjust position to be on top of the button
  },
  btnContainer: {
    // flex: 1
    // backgroundColor: 'black'
  },
  roleContainer: {
    flexDirection: 'row',
    width: '80%',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  roleButton: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    borderRadius: 25,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  selectedRole: {
    backgroundColor: '#134B70',
  },
  roleText: {
    color: '#003f5c',
    fontSize: 16,
  },
  selectedRoleText: {
    color: 'white',
  },
});

export default RegisterScreen;
