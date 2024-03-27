import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import RemindersConsultationScreen from './Consulta/RemindersConsultationScreen';

const LembretesScreen = ({ navigation }) => {
  const [isModalVisible, setModalVisible] = useState(false);

  // Funções para abrir e fechar o modal
  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

    // Função para navegar para a tela de visualização
    const navigateToRelReminders = () => {
      navigation.navigate('Consultas');
    };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Medicamentos</Text>
          <TouchableOpacity style={styles.button} onPress={() => {}}>
            <Text style={styles.buttonText}>Registrar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => {}}>
            <Text style={styles.buttonText}>Visualizar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Consultas</Text>
          <TouchableOpacity style={styles.button} onPress={openModal}>
            <Text style={styles.buttonText}>Registrar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={navigateToRelReminders}>
            <Text style={styles.buttonText}>Visualizar</Text>
          </TouchableOpacity>
        </View>
      </View>

      <RemindersConsultationScreen isVisible={isModalVisible} onClose={closeModal} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center", // Isso vai centralizar os contêineres verticalmente
    backgroundColor: '#FFFFFF',
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#9CCC65',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  content: {
    padding: 20,
  },
  card: {
    backgroundColor: '#EDF3EF',
    widht: "80%",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#9CCC65',
  },
  cardTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#000000',
    textAlign: 'center',
  },
  button: {
    backgroundColor: "#2e7d32",
    padding: 15,
    borderRadius: 10,
    marginVertical: 10, // Espaço uniforme acima e abaixo de cada botão
    width: "100%", // Faz com que o botão se expanda para a largura do contêiner
  },
  buttonText: {
    color: "#fff",
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: "center", // Centraliza o texto no botão
  },
});

export default LembretesScreen;
