//diabetesScreens.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Switch,
  Button,
  StyleSheet,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { db } from "../../config/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

const GlicemiaScreen = ({ closeModal }) => {
  const [glicemia, setGlicemia] = useState("");
  const [isFasting, setIsFasting] = useState(false);
  const [date, setDate] = useState(new Date());
  const [userId, setUserId] = useState(""); // Supondo que você tenha o ID do usuário logado

  const handleSubmit = async () => {
    try {
      await addDoc(collection(db, "diabetes"), {
        Glicemia: glicemia,
        InFasting: isFasting,
        datetime: date,
        ID_user: `/users/${userId}`, // Certifique-se de que está usando o caminho correto para a referência do usuário
      });
      alert("Dados de glicemia salvos com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar os dados de glicemia: ", error);
      alert("Erro ao salvar os dados.");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Glicemia"
        keyboardType="numeric"
        value={glicemia}
        onChangeText={setGlicemia}
      />
      <View style={styles.switchContainer}>
        <Text>Está em jejum?</Text>
        <Switch value={isFasting} onValueChange={setIsFasting} />
      </View>
      <DateTimePicker
        value={date}
        mode="datetime"
        display="default"
        onChange={(event, selectedDate) => setDate(selectedDate)}
      />
      <Button title="Fechar" onPress={closeModal} />{" "}
      {/* Botão para fechar o modal */}
      <Button title="Salvar Glicemia" onPress={handleSubmit} />{" "}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginTop: 8,
    padding: 10,
    borderRadius: 4,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
});

export default GlicemiaScreen;
