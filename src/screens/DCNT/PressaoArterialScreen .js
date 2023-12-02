// PressaoArterialScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Switch, Button, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { db } from "../../config/firebaseConfig";
import { collection, addDoc, getDocs, serverTimestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";



const PressaoArterialScreen = ({ closeModal }) => {
  const [sistolica, setSistolica] = useState('');
  const [diastolica, setDiastolica] = useState('');
  const [humor, setHumor] = useState('');
  const [tontura, setTontura] = useState(false);
  const [humores, setHumores] = useState([]);
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchHumores = async () => {
      const querySnapshot = await getDocs(collection(db, "humores"));
      const fetchedHumores = querySnapshot.docs.map(doc => ({ label: doc.data().descricao, value: doc.id }));
      setHumores(fetchedHumores);
    };

    fetchHumores();
  }, []);

  const handleSalvarPressao = async () => {
    if (!user || !sistolica || !diastolica) {
      Alert.alert('Erro', 'Por favor, insira os valores de pressão arterial e certifique-se de que está logado.');
      return;
    }
  
    try {
      const docRef = await addDoc(collection(db, "pressaoArterial"), {
        Sistolica: sistolica,
        Diastolica: diastolica,
        Humor: humor,
        Tontura: tontura,
        UsuarioID: user.uid,
        DataHora: serverTimestamp(), // Aqui usamos serverTimestamp
      });
      Alert.alert('Sucesso', 'Pressão arterial salva com sucesso!');
      closeModal();
    } catch (error) {
      console.error("Erro ao salvar os dados de pressão arterial: ", error);
      Alert.alert('Erro', 'Não foi possível salvar os dados de pressão arterial.');
    }
  };

  // Verifique se o usuário está logado antes de tentar salvar os dados
  if (!user) {
    Alert.alert('Usuário não logado', 'Você precisa estar logado para salvar a pressão arterial.');
    return null; // ou lidar com a navegação/redirecionamento conforme necessário
  }
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Pressão Sistólica (SYS)"
        keyboardType="numeric"
        value={sistolica}
        onChangeText={setSistolica}
      />
      <TextInput
        style={styles.input}
        placeholder="Pressão Diastólica (DIA)"
        keyboardType="numeric"
        value={diastolica}
        onChangeText={setDiastolica}
      />
      
      <Text>Humor:</Text>
      <Picker
        selectedValue={humor}
        onValueChange={(itemValue, itemIndex) => setHumor(itemValue)}
        style={styles.picker}
      >
        {humores.map((h) => (
          <Picker.Item key={h.value} label={h.label} value={h.value} />
        ))}
      </Picker>

      <View style={styles.switchContainer}>
        <Text>Tontura ou dor de cabeça?</Text>
        <Switch
          value={tontura}
          onValueChange={setTontura}
        />
      </View>
      
      <Button title="Salvar" onPress={handleSalvarPressao} />
      <Button title="Fechar" onPress={closeModal} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 8,
    padding: 10,
    borderRadius: 4,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
});

export default PressaoArterialScreen;
