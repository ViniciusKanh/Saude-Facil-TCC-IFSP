import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Logo from '../components/Logo'; // Certifique-se de que o caminho está correto

const HomeScreen = ({ navigation }) => {
  const handlePress = (screen) => {
    // Aqui você pode usar navigation.navigate(screen) para navegar
    alert(`${screen} Pressed`);
  };

  const Icon = ({ name, label, onPress }) => (
    <TouchableOpacity style={styles.iconWrapper} onPress={onPress}>
      <FontAwesome name={name} size={32} color="#2e7d32" />
      <Text style={styles.iconLabel}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Logo />
      <View style={styles.iconGrid}>
        <Icon name="bell" label="Alarme" onPress={() => handlePress('Alarme')} />
        <Icon name="heart" label="Saúde" onPress={() => handlePress('Saúde')} />
        <Icon name="file-text" label="Receitas" onPress={() => handlePress('Receitas')} />
        <Icon name="line-chart" label="Histórico DCNT" onPress={() => handlePress('Histórico DCNT')} />
      </View>
      <Icon name="user" label="Perfil" onPress={() => handlePress('Perfil')} style={styles.profileIcon} />
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
