import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export default function App() {
  // Placeholder functions for button press actions
  const handleAlarmPress = () => alert('Alarme Pressed');
  const handleHealthPress = () => alert('Saúde Pressed');
  const handleRecipePress = () => alert('Receitas Pressed');
  const handleHistoryPress = () => alert('Histórico DCNT Pressed');
  const handleProfilePress = () => alert('Perfil Pressed');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>SAÚDE+FÁCIL</Text>
      </View>
      <View style={styles.menu}>
        <TouchableOpacity style={styles.menuItem} onPress={handleAlarmPress}>
          <FontAwesome name="bell" size={32} color="#2e7d32" />
          <Text style={styles.menuText}>Alarme</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={handleHealthPress}>
          <FontAwesome name="heart" size={32} color="#2e7d32" />
          <Text style={styles.menuText}>Saúde</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={handleRecipePress}>
          <FontAwesome name="file-text" size={32} color="#2e7d32" />
          <Text style={styles.menuText}>Receitas</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={handleHistoryPress}>
          <FontAwesome name="line-chart" size={32} color="#2e7d32" />
          <Text style={styles.menuText}>Histórico DCNT</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.profile} onPress={handleProfilePress}>
        <FontAwesome name="user" size={32} color="#2e7d32" />
        <Text style={styles.profileText}>Perfil</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    marginTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  menu: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 20,
  },
  menuItem: {
    alignItems: 'center',
    width: '40%',
    margin: 10,
    padding: 20,
    backgroundColor: '#e8f5e9',
    borderRadius: 10,
    elevation: 3, // adds shadow on Android
    shadowOpacity: 0.3, // adds shadow on iOS
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  menuText: {
    marginTop: 8,
    color: '#2e7d32',
    fontWeight: 'bold',
  },
  profile: {
    alignItems: 'center',
    marginBottom: 20,
    padding: 20,
    alignSelf: 'center',
    backgroundColor: '#e8f5e9',
    borderRadius: 10,
    elevation: 3, // adds shadow on Android
    shadowOpacity: 0.3, // adds shadow on iOS
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  profileText: {
    marginTop: 8,
    color: '#2e7d32',
    fontWeight: 'bold',
  },
});