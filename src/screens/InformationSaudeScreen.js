import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebaseConfig"; // Certifique-se de que está importando corretamente
import { useNavigation } from "@react-navigation/native";

// Importe a imagem padrão aqui
const defaultProfileImage = require("../assets/perfil/profile-pic.jpg");

// Função para classificar a faixa etária com base na idade
function getClassificationByAge(age) {
  if (age >= 0 && age <= 12) {
    return "Criança";
  } else if (age >= 13 && age <= 17) {
    return "Adolescente";
  } else if (age >= 18 && age <= 29) {
    return "Jovem";
  } else if (age >= 30 && age <= 59) {
    return "Adulto";
  } else if (age >= 60 && age <= 100) {
    return "Idoso";
  } else if (age > 100) {
    return "Ancião";
  } else {
    return "Não especificado";
  }
}

const InformationSaudeScreen = () => {
  const [userData, setUserData] = useState(null);
  const auth = getAuth(); // Instância do Auth

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          const birthDate = data.birthDate.toDate();
          const age = getAge(birthDate);
          const classification = getClassificationByAge(age);
          setUserData({
            ...data,
            birthDate: birthDate.toLocaleDateString("pt-BR"),
            age,
            classification, // Adiciona a classificação ao estado
          });
        } else {
          console.log("Usuário não encontrado");
        }
      }
    };

    fetchUserData();
  }, []);

  // Função para calcular a idade com base na data de nascimento
  function getAge(birthDate) {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  const calculateIMC = (weight, height) => {
    if (weight && height) {
      const heightInMeters = height / 100; // converte a altura de cm para metros
      const imc = weight / (heightInMeters * heightInMeters);
      return imc.toFixed(2); // retorna o IMC com duas casas decimais
    }
    return null;
  };

  const getClassificacaoIMC = (imc) => {
    if (imc < 18.5) {
      return { classificacao: "Magreza", grau: 0 };
    } else if (imc >= 18.5 && imc <= 24.9) {
      return { classificacao: "Normal", grau: 0 };
    } else if (imc >= 25.0 && imc <= 29.9) {
      return { classificacao: "Sobrepeso", grau: 1 };
    } else if (imc >= 30.0 && imc <= 39.9) {
      return { classificacao: "Obesidade", grau: 2 };
    } else if (imc > 40.0) {
      return { classificacao: "Obesidade Grave", grau: 3 };
    } else {
      return { classificacao: "Indeterminado", grau: "Indeterminado" };
    }
  };

  const imc = calculateIMC(userData?.weight, userData?.height); // Assume que esta função retorna o IMC
  const classificacao = getClassificacaoIMC(imc);

  // Usaremos o gancho de navegação para lidar com a navegação entre telas
  const navigation = useNavigation();

  // Adicione funções para lidar com a navegação quando os botões são pressionados
  const handlePResumoPG = () => {
    navigation.navigate("Histórico");
  };

    // Adicione funções para lidar com a navegação quando os botões são pressionados
    const handlePressInfoSaude = () => {
      navigation.navigate("Informações Saúde");
    };
  const handlePressMedicamentos = () => {
    navigation.navigate("Medicamentos");

    
  };

  const handlePressLembretes = () => {
    navigation.navigate("Lembretes");
  };

  const handlePressDadosPessoais = () => {
    navigation.navigate("Dados Pessoais");
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileHeader}>
        <Image
          style={styles.profileImage}
          source={
            userData?.profileImageUrl
              ? { uri: userData.profileImageUrl }
              : defaultProfileImage
          }
        />
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>
            {userData?.fullName || "Nome do Usuário"}
          </Text>
          <Text style={styles.profileBirthDate}>
            {userData?.birthDate || "Data Nascimento"} -{" "}
            {userData?.age ? `${userData.age} anos` : ""} (
            {userData?.classification})
          </Text>
        </View>
      </View>
      <TouchableOpacity style={styles.button} onPress={handlePressInfoSaude}>
        <Text style={styles.buttonText}>Informações de Saúde</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handlePResumoPG}>
        <Text style={styles.buttonText}>Hitórico de Pressão Arterial e Glicemia</Text>
      </TouchableOpacity>


      <TouchableOpacity style={styles.button} onPress={handlePressMedicamentos}>
        <Text style={styles.buttonText}>Medicamentos</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={handlePressDadosPessoais}
      >
        <Text style={styles.buttonText}>Dados Pessoais</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center", // Centraliza horizontalmente
    marginVertical: 20, // Espaço vertical para separar da parte superior
  },
  profileImage: {
    width: 120, // Tamanho maior para a imagem
    height: 120, // Tamanho maior para a imagem
    borderRadius: 60, // Arredonda a imagem para formar um círculo
    marginRight: 20, // Espaço entre a imagem e o texto
  },
  profileInfo: {
    justifyContent: "center", // Centraliza verticalmente o texto
    // Não é necessário marginLeft aqui, pois o marginRight na imagem já cria espaço
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  profileBirthDate: {
    fontSize: 16,
  },
  button: {
    backgroundColor: "#e8f5e9",
    padding: 20,
    margin: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "#2e7d32",
    fontWeight: "bold",
  },
  profileImageContainer: {
    // Ajustar conforme o layout desejado
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: "center", // Centraliza o container da imagem
    marginTop: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ccc", // ou outra cor de sua preferência
  },
  infoContainer: {
    paddingHorizontal: 20,
    alignItems: "center", // Centralizar os itens no eixo horizontal
  },
  label: {
    // Estilo para os textos do label
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 8,
  },
  healthInfo: {
    fontSize: 16,
    color: "#333",
    marginTop: 4, // Ajuste o valor conforme necessário para o espaçamento
  },
});

export default InformationSaudeScreen;
