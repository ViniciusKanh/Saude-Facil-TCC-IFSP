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
      <View style={styles.registroContainer}>
        <Text style={styles.title}>Registro</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setGlicemiaModalVisible(true)}
        >
          <Text style={styles.buttonText}>Glicemia</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setPressaoArterialModalVisible(true)}
        >
          <Text style={styles.buttonText}>Pressão Arterial</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.visualizacaoContainer}>
        <Text style={styles.title}>Visualização</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={openRelPressaoArterialModal}
        >
          <Text style={styles.buttonText}>Relatório de Pressão</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={openRelGlicemiaModal}>
          <Text style={styles.buttonText}>Relatório de Glicemia</Text>
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
  registroContainer: {
    width: "80%",
    alignItems: "center",
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#EDF3EF",
    marginBottom: 20, // Valor reduzido para diminuir o espaço
    borderWidth: 1,
    borderColor: '#9CCC65',
  },
  visualizacaoContainer: {
    width: "80%",
    alignItems: "center",
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#EDF3EF",
    marginTop: 20, // Valor reduzido para diminuir o espaço
    borderWidth: 1,
    borderColor: '#9CCC65',
  },
  title: {
    fontWeight: "bold",
    fontSize: 22,
    marginBottom: 10,
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
    fontSize: 18,
    textAlign: "center", // Centraliza o texto no botão
  },
});
export default DCNTScreen;
