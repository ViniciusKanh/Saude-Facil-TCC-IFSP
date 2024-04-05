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
import * as LocalAuthentication from 'expo-local-authentication';
import { signInWithEmailAndPassword } from 'firebase/auth';
import ReactNativeBiometrics from 'react-native-biometrics';

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

  const promptBiometricLogin = () => {
    ReactNativeBiometrics.isSensorAvailable()
      .then((resultObject) => {
        const { available, biometryType } = resultObject;

        if (available && biometryType === ReactNativeBiometrics.FaceID) {
          ReactNativeBiometrics.simplePrompt({ promptMessage: 'Confirme o seu rosto' })
            .then((resultObject) => {
              const { success } = resultObject;

              if (success) {
                console.log('Face ID autenticado');
                // Aqui você poderia chamar handleLogin ou outra lógica de autenticação
              } else {
                console.log('Face ID falhou ou foi cancelado');
              }
            })
            .catch(() => {
              console.log('Falha ao autenticar com Face ID');
            });
        } else {
          console.log('Face ID não disponível');
        }
      })
      .catch(() => {
        console.log('Erro ao verificar o sensor');
      });
  };

  const handleBiometricAuth = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();
  
    if (hasHardware && isEnrolled && supportedTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate',
        cancelLabel: 'Cancelar',
        disableDeviceFallback: false,
      });
  
      if (result.success) {
        // Autenticação bem-sucedida
        Alert.alert('Autenticação', 'Sucesso no Face ID!');
        // Navegação ou outras ações pós-autenticação
      } else {
        Alert.alert('Autenticação', 'Falha na autenticação!');
      }
    } else {
      Alert.alert('Dispositivo não compatível', 'Seu dispositivo não suporta ou não tem o Face ID configurado.');
    }
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