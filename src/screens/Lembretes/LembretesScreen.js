import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';

const LembretesScreen = ({ navigation }) => {
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
          <TouchableOpacity style={styles.button} onPress={() => {}}>
            <Text style={styles.buttonText}>Registrar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => {}}>
            <Text style={styles.buttonText}>Visualizar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    elevation: 1,
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
