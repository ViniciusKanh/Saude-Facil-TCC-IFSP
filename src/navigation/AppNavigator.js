//AppNavigator.js
import React, { useEffect, useState } from 'react';
import { StyleSheet,Image, TouchableOpacity, View, Text, Modal, Button } from 'react-native';
import { getAuth, signOut } from 'firebase/auth';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import PerfilScreen from '../screens/PerfilScreen';
import DCNTScreen from '../screens/DCNT/DCNT';
import MedicalPrescriptionScreen from '../screens/medicalPrescriptionScreen';
import InformationSaudeScreen from '../screens/InformationSaudeScreen'; 
import InfoSaudePGScreen from '../screens/InfoSaudePG'; 
import MedicationScreen from '../screens/MedicationScreen'; 
import DadosSaudeSaudeScreen from '../screens/InfSaudeScreen'; 
import LembretesScreen from '../screens/Lembretes/LembretesScreen'; 
import RelRemindersConsultationScreen from './../screens/Lembretes/Consulta/RelRemindersConsultationScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {

  const [modalVisible, setModalVisible] = useState(false);
  const [userProfileImageUrl, setUserProfileImageUrl] = useState('');
  const auth = getAuth();
  const storage = getStorage();
  const placeholderImage = require('../assets/perfil/profile-pic.jpg'); // Adicione o caminho para a imagem padrão aqui

   // Carregue a imagem do perfil do usuário quando ele estiver autenticado
   useEffect(() => {
    if (auth.currentUser) {
      const userImageRef = ref(storage, `profile_images/${auth.currentUser.uid}.jpg`);
      getDownloadURL(userImageRef)
        .then((url) => {
          setUserProfileImageUrl(url);
        })
        .catch(() => {
          // Se não encontrar a imagem, pode usar uma imagem padrão.
          setUserProfileImageUrl(Image.resolveAssetSource(placeholderImage).uri);
        });
    }
  }, [auth.currentUser]);

  const login = () => {
    // Aqui vai sua lógica de autenticação...
    // Após o login bem-sucedido, resete a pilha de navegação
    navigation.reset({
      index: 0, // Define o início da nova pilha
      routes: [{ name: 'Home' }], // Define a tela Home como a única tela na pilha
    });
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        // Após o logout bem-sucedido, resete a pilha de navegação para levar o usuário de volta à tela de Login
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      })
      .catch((error) => {
        // Trate erros de logout aqui
        console.error("Erro no logout", error);
      });
  };
  const navigateToScreen = (screenName) => {
    navigation.navigate(screenName);
    setModalVisible(false); // Fechar o modal após navegar
  };

  const screenOptions = {
    headerStyle: { backgroundColor: '#65BF85' },
    headerTintColor: '#fff',
    headerTitleStyle: { fontWeight: 'bold' },
  };

  const getHeaderRight = (routeName) => {
    if (routeName === "Login" || routeName === "Register") {
      return null; // Não exibe nada para a tela de Login e Registro
    } else {
      return () => (
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Image
            source={{ uri: userProfileImageUrl || Image.resolveAssetSource(placeholderImage).uri }}
            style={styles.profilePic}
          />
        </TouchableOpacity>
      );
    }
  };
  
  return (
    <>
      <Stack.Navigator
        screenOptions={({ route }) => ({
          headerStyle: {
            backgroundColor: '#65BF85',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          // Apenas exibe a opção do perfil a partir da tela Home em diante
          headerRight: () => (
            route.name !== "Login" && route.name !== "Register" ? (
              <TouchableOpacity onPress={() => setModalVisible(true)}>
                <Image
                  source={{ uri: userProfileImageUrl || Image.resolveAssetSource(placeholderImage).uri }}
                  style={styles.profilePic}
                />
              </TouchableOpacity>
            ) : null
          ),
          headerStyle: { backgroundColor: '#65BF85' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
          headerRight: getHeaderRight(route.name), // Personaliza o ícone do perfil com base na tela
        })}
      >
      {/* Stack.Screen para Login, Register, Home, e outras telas */}
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Menu" component={HomeScreen} />
        <Stack.Screen name="Dados Pessoais" component={PerfilScreen} />
        <Stack.Screen name="Pressão / Diabetes" component={DCNTScreen} />
        <Stack.Screen name="Receitas" component={MedicalPrescriptionScreen} />
        <Stack.Screen name="Perfil" component={InformationSaudeScreen} />
        <Stack.Screen name="Histórico" component={InfoSaudePGScreen} />
        <Stack.Screen name="Medicamentos" component={MedicationScreen} />
        <Stack.Screen name="Informações Saúde" component={DadosSaudeSaudeScreen} />
        <Stack.Screen name="Lembretes" component={LembretesScreen} />
        <Stack.Screen name="Consultas" component={RelRemindersConsultationScreen} />
        {/* ... outras telas ... */}
    </Stack.Navigator>

  
      {/* Modal para logout */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Escolha uma Opção</Text>
            {/* Botões de navegação */}
            <TouchableOpacity style={styles.buttonStyle} onPress={() => navigateToScreen('Perfil')}>
              <Text style={styles.buttonText}>Dados Pessoais</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonStyle} onPress={() => navigateToScreen('Informações Saúde')}>
              <Text style={styles.buttonText}>Informações de Saúde</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonStyle} onPress={() => navigateToScreen('Medicamentos')}>
              <Text style={styles.buttonText}>Gestão de Medicamentos</Text>
            </TouchableOpacity>
            {/* Botões de ação */}
            <TouchableOpacity style={[styles.buttonStyle, styles.logoutButton]} onPress={handleLogout}>
              <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.buttonStyle, styles.cancelButton]} onPress={() => setModalVisible(false)}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      </>
  );
  

  
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Fundo semi-transparente
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: '80%', // Tamanho do modal
  },
  modalTitle: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333'
  },
  buttonStyle: {
    backgroundColor: '#65BF85', // Cor verde para botões de navegação
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    width: '100%', // Botões ocupam a largura total do modal
    alignItems: 'center',
    marginVertical: 5, // Espaçamento vertical
  },
  logoutButton: {
    backgroundColor: '#ff6347', // Cor vermelha para o logout
    marginTop: 20, // Espaço extra acima do botão de logout
  },
  cancelButton: {
    backgroundColor: '#6c757d', // Cor cinza para o cancelar
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
  profilePic: {
    width: 45,
    height: 35,
    borderRadius: 15,
    marginRight: 10
  },
});

export default AppNavigator;
