// HomeScreen.js
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Logo from '../components/Logo'; // Certifique-se de que o caminho está correto

const HomeScreen = ({ navigation }) => {
  // Atualizado para navegar para a tela correspondente
  const handlePress = (screen) => {
    navigation.navigate(screen);
  };

  // Agora cada Icon pode ter sua própria ação de navegação
  const Icon = ({ name, label, screen }) => (
    <TouchableOpacity style={styles.iconWrapper} onPress={() => handlePress(screen)}>
      <FontAwesome name={name} size={32} color="#2e7d32" />
      <Text style={styles.iconLabel}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Logo />
      <View style={styles.iconGrid}>
        {/* Atualize o parâmetro onPress com o nome da tela para a qual deseja navegar */}
        <Icon name="bell" label="Alarme" screen="Alarme" />
        <Icon name="heart" label="Saúde" screen="Saúde" />
        <Icon name="file-text" label="Receitas" screen="Receitas" />
        <Icon name="line-chart" label="Histórico DCNT" screen="HistóricoDCNT" />
      </View>
      {/* Atualize este Icon para navegar para a PerfilScreen */}
      <Icon name="user" label="Perfil" screen="Perfil" />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 20,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  iconWrapper: {
    backgroundColor: '#e8f5e9',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40%',
    margin: 10,
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconLabel: {
    marginTop: 8,
    color: '#2e7d32',
    fontWeight: 'bold',
  },
  profileIcon: {
    width: '80%', // Ajustar a largura conforme necessário
  },
});

export default HomeScreen;
