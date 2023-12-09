// MedicalPrescriptionScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Image,
  FlatList,
} from 'react-native';
import { db, storage } from '../config/firebaseConfig';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { launchImageLibrary } from 'react-native-image-picker';
import { getAuth } from 'firebase/auth';


const MedicalPrescriptionScreen = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    // Função para buscar as prescrições no Firebase
    async function fetchPrescriptions() {
      const querySnapshot = await getDocs(collection(db, '/medicalPrescription'));
      // Tratar os dados e atualizar o estado
    }
    fetchPrescriptions();
  }, []);

  const handleChoosePhoto = () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
    };
  
    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('O usuário cancelou a seleção da imagem');
      } else if (response.error) {
        console.log('Erro: ', response.error);
      } else if (response.assets && response.assets.length > 0) {
        const selectedPhoto = response.assets[0];
        setSelectedImage(selectedPhoto);
      }
    });
  };
  
  const handleUploadPrescription = async () => {
    if (selectedImage) {
      const uploadUri = selectedImage.uri;
      const response = await fetch(uploadUri);
      const blob = await response.blob();
  
      const fileRef = ref(storage, `prescriptions/${selectedImage.fileName}`);
      await uploadBytes(fileRef, blob);
      const downloadUrl = await getDownloadURL(fileRef);
  
      const auth = getAuth();
      const user = auth.currentUser;
      const userID = user ? user.uid : null;
  
      if (userID) {
        await addDoc(collection(db, '/medicalPrescription'), {
          ID_users: userID,
          Medicamento: 'Nome do medicamento', // Substituir pelo nome real do medicamento
          dateTime: new Date(),
          file: downloadUrl,
          type: selectedImage.type,
        });
  
        // Após adicionar a prescrição, atualizar a lista de prescrições
        await updatePrescriptions();
        setSelectedImage(null);
        setModalVisible(false);
      } else {
        console.error('Nenhum usuário logado');
      }
    } else {
      console.error('Nenhuma imagem selecionada');
    }
  };
   // Função para atualizar a lista de prescrições
   const updatePrescriptions = async () => {
    const querySnapshot = await getDocs(collection(db, '/medicalPrescription'));
    // Tratar os dados e atualizar o estado
    // Por exemplo: setPrescriptions(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

 
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
        <Text style={styles.buttonText}>Acionar Receita</Text>
      </TouchableOpacity>

      <FlatList
        data={prescriptions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
            <TouchableOpacity style={styles.prescriptionItem}>
              <Text>{item.Medicamento}</Text>
              <Image source={{ uri: item.file }} style={styles.image} />
            </TouchableOpacity>
        )}
      />

<Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            {/* Botão de fechar no canto superior esquerdo */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>

            {/* Conteúdo do Modal */}
            <TouchableOpacity onPress={handleChoosePhoto} style={styles.button}>
              <Text style={styles.buttonText}>Upload Receita</Text>
            </TouchableOpacity>
            {selectedImage && (
              <Image source={{ uri: selectedImage.uri }} style={styles.imagePreview} />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)', // Fundo escuro translúcido
      },
      modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 25,
        padding: 18,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '76%', // Largura do modal
      },
      closeButton: {
        alignSelf: 'flex-start', // Alinha o botão no início (esquerda)
        marginBottom: 1, // Espaço abaixo do botão
      },
      closeButtonText: {
        fontSize: 30, // Tamanho do texto
        fontWeight: 'bold', // Texto em negrito
        color: '#333', // Cor do texto
      },
      photoButton: {
        backgroundColor: '#4e9f3d', // Cor do botão para selecionar foto
        borderRadius: 10,
        padding: 10,
        marginVertical: 10,
      },
    container: {
      flex: 1,
      backgroundColor: '#f2f2f2', // Um fundo claro
    },
    button: {
      backgroundColor: '#4e9f3d', // Um verde suave para o botão
      borderRadius: 20,
      padding: 15,
      margin: 10,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 3, // Sombreamento no Android
      shadowOpacity: 0.3, // Sombreamento no iOS
      shadowRadius: 5,
      shadowOffset: { height: 1, width: 0 },
    },
    buttonText: {
      color: '#ffffff',
      fontSize: 18,
      fontWeight: '600',
    },
    prescriptionItem: {
      backgroundColor: '#ffffff', // Fundo branco para os cartões
      borderRadius: 10,
      padding: 10,
      marginVertical: 5,
      marginHorizontal: 10,
      flexDirection: 'row', // Itens lado a lado
      alignItems: 'center', // Centraliza verticalmente
      elevation: 2, // Sombreamento no Android
      shadowOpacity: 0.1, // Sombreamento no iOS
      shadowRadius: 3,
      shadowOffset: { height: 2, width: 0 },
    },
    image: {
      width: 50,
      height: 50,
      borderRadius: 25,
      marginRight: 10,
    },
    imagePreview: {
      width: '100%',
      height: 200,
      marginBottom: 10,
      alignSelf: 'center',
    },
    // Adicione mais estilos conforme necessário
  });

export default MedicalPrescriptionScreen;
