import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import GlicemiaScreen from './diabetesScreen';
import PressaoArterialScreen from './PressaoArterialScreen ';

const DCNTScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [isGlicemiaModalVisible, setGlicemiaModalVisible] = useState(false);
  const [isPressaoArterialModalVisible, setPressaoArterialModalVisible] =
    useState(false);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  return (
    <View style={styles.screenContainer}>
      {/* Botão para abrir o modal de Glicemia */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => setGlicemiaModalVisible(true)}
      >
        <Text style={styles.buttonText}>Glicemia</Text>
      </TouchableOpacity>

      {/* Botão para abrir o modal de Pressão Arterial */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => setPressaoArterialModalVisible(true)}
      >
        <Text style={styles.buttonText}>Pressão Arterial</Text>
      </TouchableOpacity>

      {/* Modal para o GlicemiaScreen */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isGlicemiaModalVisible}
        onRequestClose={() => setGlicemiaModalVisible(false)}
      >
        <GlicemiaScreen closeModal={() => setGlicemiaModalVisible(false)} />
      </Modal>

      {/* Modal para o PressaoArterialScreen */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isPressaoArterialModalVisible}
        onRequestClose={() => setPressaoArterialModalVisible(false)}
      >
        <PressaoArterialScreen
          closeModal={() => setPressaoArterialModalVisible(false)}
        />
      </Modal>
    </View>
  );
};

// Estilos para DCNTScreen
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  button: {
    backgroundColor: "#2e7d32",
    padding: 20,
    borderRadius: 10,
    margin: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
});

export default DCNTScreen;
