import React from 'react';
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
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#65BF85', // Define a cor de fundo do cabeçalho
        },
        headerTintColor: '#fff', // Define a cor dos títulos e botões do cabeçalho
        headerTitleStyle: {
          fontWeight: 'bold', // Define o estilo do título do cabeçalho
        },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
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
  );
};

export default AppNavigator;
