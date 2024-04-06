// LoginScreen.js
import React, { useState } from 'react';
import {
  View,
  Alert,
  TouchableOpacity,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { auth } from '../config/firebaseConfig';
import Logo from "../components/Logo";
import { signInWithEmailAndPassword } from 'firebase/auth';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        Alert.alert("Sucesso", "Login efetuado com sucesso");
        navigation.navigate("Menu"); // Adiciona esta linha
      })
      .catch((error) => {
        Alert.alert("Erro no login", error.message);
      });
  };

  const handleGoToRegister = () => {
    navigation.navigate("Register");
  };


  return (
    <ScrollView style={styles.scroll}>

      <View style={styles.container}>
        <Logo width={250} height={250} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
        />
       <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.registerButton]}
          onPress={handleGoToRegister}
        >
          <Text style={styles.buttonText}>Cadastre-se</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: "#fff", // Cor de fundo da tela
    padding: 20,
  },
  container: {
    justifyContent: "center",


  },
  input: {
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  registerButton: {
    backgroundColor: "#4CAF50", // Botão "Cadastre-se" com fundo verde
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default LoginScreen;