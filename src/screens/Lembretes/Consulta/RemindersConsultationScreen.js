// RemindersConsultationScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TextInput,
  Platform,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { db } from "../../../config/firebaseConfig";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const RemindersConsultationScreen = ({ isVisible, onClose }) => {
  const [typeConsultation, setTypeConsultation] = useState("");
  const [warningHours, setWarningHours] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [location, setLocation] = useState("");
  const [observation, setObservation] = useState("");
  const [specialist, setSpecialist] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [typeOptions, setTypeOptions] = useState([]);

  const auth = getAuth();
  const user = auth.currentUser;

  // Estado para o DateTimePicker
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);
  const [formattedDate, setFormattedDate] = useState("");
  const [formattedTime, setFormattedTime] = useState("");

  // Função para formatar data e hora
  const formatDate = (date) => {
    // Você pode ajustar o formato conforme necessário
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // +1 pois getMonth() começa do zero
    const year = date.getFullYear();
    setFormattedDate(`${day}/${month}/${year}`);

    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    setFormattedTime(`${hours}:${minutes}`);
  };

  const resetForm = () => {
    setTypeConsultation("");
    setWarningHours("");
    // setDateTime(''); // Se você estiver usando dateTime para algo, considere resetar também
    setLocation("");
    setObservation("");
    setSpecialist("");
    setSpecialty("");
    setDate(new Date()); // Reseta para a data atual
    setFormattedDate("");
    setFormattedTime("");
    // Se necessário, resete outros estados aqui
  };

  // Função para mostrar o date picker
  const showDatePicker = () => {
    setShow(true);
    setMode("date");
  };

  // Função para mostrar o time picker
  const showTimePicker = () => {
    setShow(true);
    setMode("time");
  };

  // Função chamada quando uma data é selecionada
  const onChange = (event, selectedDate) => {
    setShow(Platform.OS === "ios");
    if (selectedDate) {
      setDate(selectedDate);
      if (mode === "date") {
        // Atualize seu estado formattedDate aqui
        setFormattedDate(/* sua lógica de formatação de data */);
      } else {
        // Atualize seu estado formattedTime aqui
        setFormattedTime(/* sua lógica de formatação de hora */);
      }
    }
  };
  useEffect(() => {
    // Busca os tipos de consulta ao abrir o modal
    const fetchTypeConsultation = async () => {
      const querySnapshot = await getDocs(collection(db, "/TypeConsultation"));
      const fetchedTypes = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTypeOptions(fetchedTypes);
    };

    if (isVisible) {
      fetchTypeConsultation();
    }
    formatDate(date); // Chama a função para formatar a data inicial
  }, [isVisible]);

  const handleSaveReminder = async () => {
    if (!user) {
      alert("Usuário não está logado.");
      return;
    }

    // Obter o deslocamento do fuso horário local em minutos e converter em milissegundos
    const timezoneOffset = new Date().getTimezoneOffset() * 60000;
    // Obter o nome do tipo de consulta baseado no ID selecionado
    const selectedTypeOption = typeOptions.find(
      (option) => option.id === typeConsultation
    );
    const typeName = selectedTypeOption ? selectedTypeOption.type : ""; // Substitua 'type' pela propriedade correta que contém o nome

    // Ajustar a data para o fuso horário local antes de converter para string
    const localDate = new Date(date - timezoneOffset);
    const formattedDateTime = localDate.toISOString();

    try {
      await addDoc(collection(db, "remindersConsultation"), {
        ID_user: user.uid,
        Type: typeConsultation, // ID do tipo de consulta
        TypeName: typeName, // Nome do tipo de consulta
        WarningHours: Number(warningHours),
        date_time: formattedDateTime,
        location: location,
        observation: observation,
        specialist: specialist,
        specialty: specialty,
      });
      alert("Lembrete salvo com sucesso!");
      alert("Lembrete salvo com sucesso!");
      resetForm();
      onClose(); // Fecha o modal
    } catch (error) {
      console.error("Erro ao salvar lembrete: ", error);
      alert("Erro ao salvar lembrete.");
    }
  };

  const handleOnClose = () => {
    resetForm(); // Limpa o formulário
    onClose(); // Propaga o evento onClose, caso exista alguma ação adicional a ser feita pelo componente pai
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalView}>
        <ScrollView contentContainerStyle={{ alignItems: "center" }}>
          <Text style={styles.modalTitle}>Adicionar Novo Lembrete</Text>
          <Picker
            selectedValue={typeConsultation}
            onValueChange={(itemValue, itemIndex) =>
              setTypeConsultation(itemValue)
            }
            style={styles.picker}
          >
            {typeOptions.map((option) => (
              <Picker.Item
                key={option.id}
                label={option.type}
                value={option.id}
              />
            ))}
          </Picker>

          <View style={styles.dateTimeWrapper}>
            <View style={styles.dateTimeContainer}>
              <TouchableOpacity
                onPress={showDatePicker}
                style={styles.dateButton}
              >
                <Text style={styles.buttonText}>Escolher data</Text>
              </TouchableOpacity>
              {show && mode === "date" && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={date}
                  mode="date"
                  is24Hour={true}
                  display="default"
                  onChange={onChange}
                />
              )}
              <Text style={styles.dateTimeText}>{formattedDate}</Text>
            </View>

            <View style={styles.dateTimeContainer}>
              <TouchableOpacity
                onPress={showTimePicker}
                style={styles.dateButton}
              >
                <Text style={styles.buttonText}>Escolher hora</Text>
              </TouchableOpacity>
              {show && mode === "time" && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={date}
                  mode="time"
                  is24Hour={true}
                  display="default"
                  onChange={onChange}
                />
              )}
              <Text style={styles.dateTimeText}>{formattedTime}</Text>
            </View>
          </View>

          <TextInput
            placeholder="Horas de aviso"
            value={warningHours.toString()}
            onChangeText={(text) => setWarningHours(Number(text))}
            style={styles.input}
            keyboardType="numeric"
          />

          <TextInput
            placeholder="Local"
            value={location}
            onChangeText={setLocation}
            style={styles.input}
          />

          <TextInput
            placeholder="Observação"
            value={observation}
            onChangeText={setObservation}
            style={styles.input}
          />

          <TextInput
            placeholder="Especialista"
            value={specialist}
            onChangeText={setSpecialist}
            style={styles.input}
          />

          <TextInput
            placeholder="Especialidade"
            value={specialty}
            onChangeText={setSpecialty}
            style={styles.input}
          />

          <TouchableOpacity
            style={styles.buttonSalvar}
            onPress={handleSaveReminder}
          >
            <Text style={styles.buttonTextSalvar}>Salvar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.buttonClose} onPress={handleOnClose}>
            <Text style={styles.buttonTextClose}>Fechar</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  // Estilos para o modal, inputs, botões, etc.
  // ...
  modalView: {
    margin: 26,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 40,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    marginBottom: -40,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
  picker: {
    width: "100%",
    marginBottom: -20,
  },

  input: {
    width: "100%",
    padding: 10,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  saveButton: {
    backgroundColor: "#28a745",
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  saveButtonText: {
    color: "#ffffff",
    fontSize: 16,
    textAlign: "center",
  },
  buttonSalvar: {
    backgroundColor: "#34A853",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    minWidth: "100%",
    marginTop: 10,
  },
  buttonTextSalvar: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 18,
  },
  buttonClose: {
    backgroundColor: "#D32F2F",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    minWidth: "100%",
    marginTop: 10,
  },
  buttonTextClose: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 18,
  },
  dateTimeWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 20, // Espaçamento vertical entre este elemento e os outros
    width: "100%", // Ocupa toda a largura disponível
  },
  dateTimeContainer: {
    alignItems: "center",
    flex: 1, // Faz com que cada container ocupe metade da largura disponível
  },
  dateButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10, // Espaçamento entre o botão e o texto
  },
  dateTimeText: {
    color: "#007bff",
    fontSize: 16,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "bold",
  },
});

export default RemindersConsultationScreen;
