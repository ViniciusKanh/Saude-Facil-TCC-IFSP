import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import PerfilScreen from '../screens/PerfilScreen';
import DCNTScreen from '../screens/DCNT/DCNT';
import MedicalPrescriptionScreen from '../screens/medicalPrescriptionScreen'
import InformationSaudeScreen from '../screens/InformationSaudeScreen'; 


const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#60B886', // Define a cor de fundo do cabeçalho
        },
        headerTintColor: '#fff', // Define a cor dos títulos e botões do cabeçalho
        headerTitleStyle: {
          fontWeight: 'bold', // Define o estilo do título do cabeçalho
        },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Perfil" component={PerfilScreen} />
      <Stack.Screen name="DCNT" component={DCNTScreen} />
      <Stack.Screen name="Receitas" component={MedicalPrescriptionScreen} />
      <Stack.Screen name="InformationSaude" component={InformationSaudeScreen} />

      {/* ... outras telas ... */}
    </Stack.Navigator>
  );
};

export default AppNavigator;
