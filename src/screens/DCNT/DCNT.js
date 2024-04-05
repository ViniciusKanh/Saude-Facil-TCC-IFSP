// DCNT.js
import React, { useState } from "react";
import { View, Text, Modal, TouchableOpacity, StyleSheet } from "react-native";
import GlicemiaScreen from "./GlicemiaScreen";
import PressaoArterialScreen from "./PressaoArterialScreen";
import RelPressaoArterialScreen from "./RelPressaoArterialScreen";
import RelGlicemiaScreen from "./GlicemiaReportScreen";

const DCNTScreen = ({ navigation }) => {
  // Estados para controlar a visibilidade dos modais
  const [isGlicemiaModalVisible, setGlicemiaModalVisible] = useState(false);
  const [isPressaoArterialModalVisible, setPressaoArterialModalVisible] =
    useState(false);
  const [
    isRelPressaoArterialModalVisible,
    setIsRelPressaoArterialModalVisible,
  ] = useState(false);
  const [isRelGlicemiaModalVisible, setIsRelGlicemiaModalVisible] =
    useState(false);

  // Funções para abrir e fechar o modal de relatório
  const openRelPressaoArterialModal = () => {
    setIsRelPressaoArterialModalVisible(true);
  };

  const closeRelPressaoArterialModal = () => {
    setIsRelPressaoArterialModalVisible(false);
  };

  const openRelGlicemiaModal = () => {
    setIsRelGlicemiaModalVisible(true);
  };

  const closeRelGlicemiaModal = () => {
    setIsRelGlicemiaModalVisible(false);
  };

  return (
    <View style={styles.screenContainer}>
      <Text style={styles.title}>Pressão</Text>
      <View style={styles.pressaoContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setPressaoArterialModalVisible(true)}
        >
          <Text style={styles.buttonText}>Registrar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={openRelPressaoArterialModal}
        >
          <Text style={styles.buttonText}>Visualizar</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Diabetes</Text>
      <View style={styles.diabetesContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setGlicemiaModalVisible(true)}
        >
          <Text style={styles.buttonText}>Registrar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={openRelGlicemiaModal}>
          <Text style={styles.buttonText}>Visualizar</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isGlicemiaModalVisible}
        onRequestClose={() => setGlicemiaModalVisible(false)}
      >
        <GlicemiaScreen closeModal={() => setGlicemiaModalVisible(false)} />
      </Modal>

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

      <Modal
        animationType="slide"
        transparent={true}
        visible={isRelPressaoArterialModalVisible}
        onRequestClose={closeRelPressaoArterialModal}
      >
        <RelPressaoArterialScreen closeModal={closeRelPressaoArterialModal} />
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isRelGlicemiaModalVisible}
        onRequestClose={closeRelGlicemiaModal}
      >
        <RelGlicemiaScreen closeModal={closeRelGlicemiaModal} />
      </Modal>
    </View>
  );
};

// Estilos para DCNTScreen
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    justifyContent: "center", // Isso vai centralizar os contêineres verticalmente
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  pressaoContainer: {
    width: "80%",
    padding: 20,
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: "#EDF3EF",
    borderWidth: 1,
    borderColor: '#65BF85',
  },
  diabetesContainer: {
    width: "80%",
    padding: 20,
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: "#EDF3EF",
    borderWidth: 1,
    borderColor: '#65BF85',
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#000000',
    textAlign: 'center',
  },
  button: {
    backgroundColor: "#ffff",
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#65BF85",
    marginVertical: 10, // Espaço uniforme acima e abaixo de cada botão
    width: "100%", // Faz com que o botão se expanda para a largura do contêiner
  },
  buttonText: {
    color: "#000",
    fontSize: 18,
    textAlign: "center", // Centraliza o texto no botão
  },
});
export default DCNTScreen;