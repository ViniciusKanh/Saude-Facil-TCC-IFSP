//InformationSaudeScreen.js

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { db } from '../config/firebaseConfig';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const InformationSaudeScreen = () => {
  const [userData, setUserData] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    const fetchUserData = async () => {
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const data = userSnap.data();
          // Converte o Timestamp de birthDate para uma string legível
          const birthDate = data.birthDate?.toDate().toLocaleDateString('pt-BR');
          setUserData({ ...data, birthDate });
        } else {
          console.log('Usuário não encontrado');
        }
      }
    };

    const fetchPrescriptions = async () => {
      if (user) {
        const prescQuery = query(collection(db, 'medicalPrescription'), where('ID_users', '==', user.uid));
        const querySnapshot = await getDocs(prescQuery);
        const prescData = querySnapshot.docs.map(doc => {
          const data = doc.data();
          // Converte o Timestamp de dateTime para uma string legível
          const dateTime = data.dateTime?.toDate().toLocaleDateString('pt-BR');
          return { ...data, dateTime };
        });

        setPrescriptions(prescData);
      }
    };

    fetchUserData();
    fetchPrescriptions();
  }, []);

  if (!userData) return <Text>Carregando...</Text>;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.header}>Perfil do Usuário</Text>
        <Image source={{ uri: userData.profileImageUrl || 'https://via.placeholder.com/100' }} style={styles.profileImage} />
        <Text style={styles.info}>Nome: {userData.fullName}</Text>
        <Text style={styles.info}>Data de Nascimento: {userData.birthDate}</Text>
        <Text style={styles.info}>Tipo Sanguíneo: {userData.bloodType}</Text>
        <Text style={styles.info}>Doador de Órgãos: {userData.isOrganDonor ? 'Sim' : 'Não'}</Text>
        {/* Outras informações */}
      </View>
      <View style={styles.section}>
        <Text style={styles.header}>Prescrições Médicas</Text>
        {prescriptions.map((prescription, index) => (
          <View key={index} style={styles.prescriptionCard}>
            <Text style={styles.info}>Medicamento: {prescription.Medicamento}</Text>
            <Text style={styles.info}>Tipo: {prescription.type}</Text>
            <Text style={styles.info}>Data: {prescription.dateTime}</Text>
            <Image source={{ uri: prescription.file || 'https://via.placeholder.com/200' }} style={styles.prescriptionImage} />
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  section: {
    marginBottom: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  info: {
    fontSize: 16,
    marginBottom: 5,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  prescriptionCard: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
  },
  prescriptionImage: {
    width: '100%',
    height: 200,
    marginTop: 10,
    borderRadius: 5,
  },
});

export default InformationSaudeScreen;
