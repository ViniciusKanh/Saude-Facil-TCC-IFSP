import React, { useState } from 'react';
import { View, Alert, TouchableOpacity, Text, TextInput, StyleSheet, Switch } from 'react-native';
import { auth, db } from '../config/firebaseConfig'; // Ajuste o caminho conforme necessário
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore'; 
import Logo from '../components/Logo';


const RegisterScreen = () => {
  const [fullName, setFullName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [race, setRace] = useState('');
  const [takesControlledMedication, setTakesControlledMedication] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = () => {
    if (password !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não correspondem.');
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        setDoc(doc(db, 'users', user.uid), {
          fullName,
          birthDate,
          race,
          takesControlledMedication
        })
        .then(() => {
          Alert.alert('Sucesso', 'Usuário cadastrado com sucesso!');
        });
      })
      .catch((error) => {
        Alert.alert('Erro no cadastro', error.message);
      });
  };

  return (
    <View style={styles.container}>
       <Logo width={150} height={150} /> 
      <TextInput style={styles.input} placeholder="Nome Completo" value={fullName} onChangeText={setFullName} />
      <TextInput style={styles.input} placeholder="Data de Nascimento" value={birthDate} onChangeText={setBirthDate} />
      <TextInput style={styles.input} placeholder="Cor" value={race} onChangeText={setRace} />
      <View style={styles.switchContainer}>
        <Text>Toma Medicamento Controlado?</Text>
        <Switch value={takesControlledMedication} onValueChange={setTakesControlledMedication} />
      </View>
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Senha" value={password} onChangeText={setPassword} secureTextEntry />
      <TextInput style={styles.input} placeholder="Confirme a Senha" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>
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
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default RegisterScreen;
