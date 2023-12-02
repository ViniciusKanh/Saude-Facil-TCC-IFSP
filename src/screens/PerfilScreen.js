import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  Platform,
} from "react-native";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, updateDoc, Timestamp } from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import RNPickerSelect from "react-native-picker-select";
import * as ImagePicker from "expo-image-picker";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { collection, getDocs } from "firebase/firestore";
import { Picker } from "@react-native-picker/picker";

const auth = getAuth();
const calendarIcon = require("../assets/icones/calendario.png");

const PerfilScreen = (props) => {
  const [userData, setUserData] = useState({
    fullName: "",
    birthDate: new Date(), // Inicialize com um objeto Date
    race: "",
    email: "",
    bloodType: "",
    isOrganDonor: false,
    hasDiabetes: false,
    hasHypertension: false,
    hadHeartAttack: false,
    hadStroke: false,
    takesControlledMedication: false,
    profileImageUrl: "",
    height: "",
    weight: "",
    phoneNumber: "",
  });
  const [userId, setUserId] = useState("");
  const [availableBloodTypes, setAvailableBloodTypes] = useState([]);
  const [date, setDate] = useState(new Date()); // Estado para gerenciar a data
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [availableRaces, setAvailableRaces] = useState([]);
  const { navigation } = props; // Aqui, desestruturamos 'navigation' de 'props'

  // Função para mostrar o DateTimePicker
  const showDatePicker = () => {
    setIsDatePickerVisible(true);
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setIsDatePickerVisible(Platform.OS === "ios"); // Esconda o DatePicker para Android após a seleção
    setDate(currentDate); // Atualize o estado 'date' com a nova data
    setUserData({
      ...userData,
      birthDate: currentDate.toLocaleDateString("pt-BR"), // Atualize a data de nascimento no estado 'userData'
    });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        fetchUserProfile(user.uid);
      }
    });

    fetchRaces(); // Chama a função para carregar as raças

    setAvailableBloodTypes(["A+", "O-", "AB+", "AB-"]);

    return () => unsubscribe();
  }, []);

  const onBloodTypeChange = (itemValue) => {
    setUserData({ ...userData, bloodType: itemValue });
  };

  const fetchUserProfile = async (uid) => {
    try {
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);
  
      if (userSnap.exists()) {
        let userProfileData = userSnap.data();
        let raceId = userProfileData.race;
        let raceDescription = "Não especificado"; // Descrição padrão se não encontrar a raça
  
        // Só faz a busca se raceId é uma string e não é "Não especificado"
        if (typeof raceId === 'string' && raceId !== "Não especificado") {
          // Extrai o ID real da raça se estiver em formato de path
          if (raceId.includes('/')) {
            const parts = raceId.split('/');
            raceId = parts[parts.length - 1];
          }
          
          // Busca a descrição da raça no banco de dados
          const raceRef = doc(db, "race", raceId);
          const raceSnap = await getDoc(raceRef);
          if (raceSnap.exists()) {
            raceDescription = raceSnap.data().Cor;
          } else {
            console.log('Referência de raça não encontrada:', raceId);
          }
        }
  
        // Processa a data de nascimento
        let birthDate = userProfileData.birthDate.toDate ? userProfileData.birthDate.toDate() : new Date();
  
        // Atualiza o estado com os dados do usuário
        setUserData({
          ...userData,
          ...userProfileData,
          birthDate: birthDate.toLocaleDateString("pt-BR"),
          race: raceDescription, // Use a descrição da raça
        });
      } else {
        Alert.alert("Erro", "Perfil do usuário não encontrado.");
      }
    } catch (error) {
      Alert.alert("Erro", "Falha ao buscar dados do perfil do usuário.");
    }
  };
  
  

  function converterDataParaISO(dataString) {
    const partes = dataString.split("/");
    if (partes.length !== 3) {
      throw new Error("Formato de data inválido");
    }
    const [dia, mes, ano] = partes;
    return `${ano}-${mes}-${dia}`;
  }

  const handleSaveProfile = async () => {
    if (userId) {
      const userRef = doc(db, "users", userId);
      let birthDateObj = new Date(userData.birthDate); // Use o objeto Date já armazenado no estado

      if (isNaN(birthDateObj)) {
        Alert.alert("Erro", "Data de nascimento inválida.");
        return;
      }

      const updatedUserData = {
        ...userData,
        birthDate: Timestamp.fromDate(birthDateObj), // Converte a data para Timestamp
        race: userData.race ? doc(db, "race", userData.race) : null, // Se 'race' for um ID válido, cria uma referência para o documento
      };

      try {
        await updateDoc(userRef, updatedUserData);
        Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
      } catch (error) {
        console.error("Erro ao atualizar perfil:", error);
        Alert.alert("Erro", "Falha ao atualizar o perfil.");
      }
    }
  };

  const fetchRaces = async () => {
    const raceCollectionRef = collection(db, "race");
    const raceSnapshot = await getDocs(raceCollectionRef);
    const races = raceSnapshot.docs.map((doc) => ({
      label: doc.data().Cor,
      value: doc.id,
    }));
    setAvailableRaces(races); // Atualiza o estado com as raças disponíveis
  };

  const handleTextChange = (text, field) => {
    setUserData({ ...userData, [field]: text });
  };
  // Substitua 'default_avatar.png' pelo caminho para a sua imagem padrão
  const defaultAvatar = Image.resolveAssetSource(
    require("../assets/perfil/profile-pic.jpg")
  ).uri;

  const handleImagePick = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.cancelled) {
      uploadImage(result.assets[0].uri);
    }
  };

  // Função para lidar com a mudança dos Switches
  const handleSwitchChange = (value, field) => {
    setUserData({ ...userData, [field]: value });
  };

  const uploadImage = async (uri) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const storageRef = ref(getStorage(), `profile_images/${userId}.jpg`);
      await uploadBytes(storageRef, blob);

      const downloadUrl = await getDownloadURL(storageRef);
      setUserData({ ...userData, profileImageUrl: downloadUrl });
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        // Deslogou com sucesso, redirecione para a tela de login
        navigation.reset({
          index: 0,
          routes: [{ name: "Login" }], // O nome 'Login' deve corresponder ao nome da rota definida no Stack.Navigator
        });
      })
      .catch((error) => {
        // Houve um erro no logout
        Alert.alert("Erro ao sair", error.message);
      });
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <TouchableOpacity
        style={styles.profileImageContainer}
        onPress={handleImagePick}
      >
        <Image
          style={styles.profileImage}
          source={{ uri: userData.profileImageUrl || defaultAvatar }}
        />
      </TouchableOpacity>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Nome</Text>
        <TextInput
          style={styles.input}
          value={userData.fullName}
          onChangeText={(text) => handleTextChange(text, "fullName")}
        />

        <Text style={styles.label}>Data de Nascimento</Text>
        <TouchableOpacity
          style={styles.datePickerInput}
          onPress={showDatePicker}
        >
          {/* Converta o objeto Date em uma string antes de renderizá-lo */}
          <Text style={styles.datePickerText}>
            {date ? date.toLocaleDateString("pt-BR") : ""}
          </Text>
          <Image source={calendarIcon} style={styles.calendarIcon} />
        </TouchableOpacity>

        {isDatePickerVisible && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}

        <Text style={styles.label}>Cor</Text>
        <Picker
          selectedValue={userData.race}
          onValueChange={(itemValue, itemIndex) =>
            setUserData({ ...userData, race: itemValue })
          }
          style={styles.picker}
        >
          {availableRaces.map((race) => (
            <Picker.Item
              key={race.value}
              label={race.label}
              value={race.value}
            />
          ))}
        </Picker>

        <Text style={styles.label}>Tipo Sanguíneo</Text>
        <RNPickerSelect
          onValueChange={(value) => handleTextChange(value, "bloodType")}
          items={availableBloodTypes.map((bt) => ({ label: bt, value: bt }))}
          style={pickerSelectStyles}
          value={userData.bloodType}
          useNativeAndroidPickerStyle={false} // desativa o estilo nativo do picker no Android
        />

        <Text style={styles.label}>Altura</Text>
        <TextInput
          style={styles.input}
          value={userData.height}
          onChangeText={(text) => handleTextChange(text, "height")}
        />
        <Text style={styles.label}>Peso(KG)</Text>
        <TextInput
          style={styles.input}
          value={userData.weight}
          onChangeText={(text) => handleTextChange(text, "weight")}
        />
        <Text style={styles.label}>Telefone de Contato</Text>
        <TextInput
          style={styles.input}
          value={userData.phoneNumber}
          onChangeText={(text) => handleTextChange(text, "phoneNumber")}
        />

        <Text style={styles.label}>Doador de Órgãos?</Text>
        <Switch
          value={userData.isOrganDonor}
          onValueChange={(value) => handleSwitchChange(value, "isOrganDonor")}
        />

        <Text style={styles.label}>Diabetes?</Text>
        <Switch
          value={userData.hasDiabetes}
          onValueChange={(value) => handleSwitchChange(value, "hasDiabetes")}
        />

        <Text style={styles.label}>Pressão Alta?</Text>
        <Switch
          value={userData.hasHypertension}
          onValueChange={(value) =>
            handleSwitchChange(value, "hasHypertension")
          }
        />

        <Text style={styles.label}>Teve Infarto?</Text>
        <Switch
          value={userData.hadHeartAttack}
          onValueChange={(value) => handleSwitchChange(value, "hadHeartAttack")}
        />

        <Text style={styles.label}>Teve AVC?</Text>
        <Switch
          value={userData.hadStroke}
          onValueChange={(value) => handleSwitchChange(value, "hadStroke")}
        />

        <Text style={styles.label}>Toma Medicamento Controlado?</Text>
        <Switch
          value={userData.takesControlledMedication}
          onValueChange={(value) =>
            handleSwitchChange(value, "takesControlledMedication")
          }
        />
        <TouchableOpacity style={styles.button} onPress={handleSaveProfile}>
          <Text style={styles.buttonText}>Salvar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    color: "black",
    paddingRight: 30, // para garantir que o texto não fique escondido atrás do ícone
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: "purple",
    borderRadius: 8,
    color: "black",
    paddingRight: 30, // para garantir que o texto não fique escondido atrás do ícone
  },
});
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  contentContainer: {
    alignItems: "center", // Agora isso é aplicado corretamente
    justifyContent: "center",
  },
  profileImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 1,
    borderColor: "gray",
    marginTop: 20,
    overflow: "hidden",
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  infoContainer: {
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  pickerContainer: {
    marginVertical: 20, // Adiciona espaço vertical
    width: "100%", // Ocupa toda a largura
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 10,
  },
  picker: {
    height: 10,
    width: "100%", // Ocupa toda a largura da View contêiner
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  datePickerInput: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    padding: 10,
    marginTop: 8,
  },
  datePickerText: {
    fontSize: 16,
  },
  calendarIcon: {
    width: 20,
    height: 20,
  },
  logoutButton: {
    backgroundColor: "red", // Cor do botão de logout
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  logoutButtonText: {
    color: "white", // Cor do texto dentro do botão de logout
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default PerfilScreen;
