// ReminderEditModalConsulta.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
  Platform,
  ScrollView,
} from "react-native";
import { db } from "../../../config/firebaseConfig";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import Icon from "react-native-vector-icons/FontAwesome5";
import moment from "moment";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";

const inputField = (
  label,
  value,
  onChangeText,
  keyboardType = "default",
  multiline = false
) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>{label}:</Text>
    <TextInput
      style={[styles.input, multiline && { height: 100 }]}
      placeholder={label}
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      multiline={multiline}
    />
  </View>
);

const ReminderEditModalConsulta = ({ isVisible, onClose, reminderToEdit, onSave }) => {
  const [typeConsultation, setTypeConsultation] = useState(
    reminderToEdit?.Type || ""
  );
  const [warningHours, setWarningHours] = useState(
    reminderToEdit?.WarningHours?.toString() || ""
  );
  const [date, setDate] = useState(
    reminderToEdit?.date_time ? new Date(reminderToEdit.date_time) : new Date()
  );
  const [location, setLocation] = useState(reminderToEdit?.location || "");
  const [observation, setObservation] = useState(
    reminderToEdit?.observation || ""
  );
  const [specialist, setSpecialist] = useState(
    reminderToEdit?.specialist || ""
  );
  const [specialty, setSpecialty] = useState(reminderToEdit?.specialty || "");
  const [typeOptions, setTypeOptions] = useState([]);


  // Estado para o DateTimePicker
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

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);

    // Atualiza o estado da data e hora formatadas diretamente
    if (mode === "date") {
      const formattedDateStr = moment(currentDate).format("DD/MM/YYYY");
      setFormattedDate(formattedDateStr);
    } else {
      const formattedTimeStr = moment(currentDate).format("HH:mm");
      setFormattedTime(formattedTimeStr);
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

  const handleUpdate = () => {
    const updatedReminderData = {
      id: reminderToEdit.id, // Certifique-se de que 'reminderToEdit' tem o 'id' do lembrete sendo editado
      Type: typeConsultation,
      WarningHours: parseInt(warningHours, 10),
      date_time: date.toISOString(),
      location: location,
      observation: observation,
      specialist: specialist,
      specialty: specialty
    };

    onSave(updatedReminderData); // Chama a função onSave com os dados atualizados
};


  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalView}>
        <Text style={styles.modalTitle}>Editar Lembrete de Consulta</Text>

        <Picker
          selectedValue={typeConsultation}
          onValueChange={(itemValue, itemIndex) =>
            setTypeConsultation(itemValue)
          }
          style={styles.picker}
        >
          {typeOptions?.map((option) => (
            // Certifique-se de usar 'option.type' como label e 'option.id' como value
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

        <TouchableOpacity style={styles.buttonSalvar} onPress={handleUpdate}>
          <Text style={styles.buttonTextSalvar}>Salvar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonClose} onPress={onClose}>
          <Text style={styles.buttonTextClose}>Fechar</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  card: {
    backgroundColor: "#FFF",
    padding: 16,
    marginVertical: 8,
    borderRadius: 10,
    elevation: 3,
    shadowOffset: { width: 1, height: 1 },
    shadowColor: "#333",
    shadowOpacity: 0.3,
    shadowRadius: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  cardDetail: {
    fontSize: 15,
    color: "#666",
  },
  icons: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconSpacing: {
    marginRight: 16,
  },
  scrollViewContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 30,
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
    marginBottom: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
  picker: {
    width: "80%",
    marginBottom: 20,
  },

  input: {
    width: "80%",
    padding: 10,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
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
  label: {
    alignSelf: "flex-start",
    marginLeft: 1,
    marginVertical: -0,
    marginTop: 30,
    fontSize: 22,
  },
});

export default ReminderEditModalConsulta;
