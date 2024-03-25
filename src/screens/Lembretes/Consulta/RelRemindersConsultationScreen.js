// RelRemindersConsultationScreen.js
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
import ReminderEditModalConsulta from './ReminderEditModalConsulta';


const RelRemindersConsultationScreen = () => {
  const [reminders, setReminders] = useState([]);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [currentReminderToEdit, setCurrentReminderToEdit] = useState({});
  const [typeOptions, setTypeOptions] = useState([]); // Assume this is fetched or defined somewhere

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const querySnapshot = await getDocs(
          collection(db, "remindersConsultation")
        );
        const fetchedReminders = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          formattedDate: moment(doc.data().date_time).format("DD/MM/YYYY"),
          formattedTime: moment(doc.data().date_time).format("HH:mm"),
        }));
        setReminders(fetchedReminders);
      } catch (error) {
        console.error("Error fetching reminders:", error);
      }
    };

    fetchReminders();
  }, []);

   // Função para abrir o modal de edição
 const openEditModal = (reminder) => {
  setCurrentReminderToEdit(reminder);
  setIsEditModalVisible(true);
};

  const onSave = async (reminderData) => {
    try {
      await updateDoc(
        doc(db, "remindersConsultation", reminderData.id),
        reminderData
      );
      // Atualiza a lista de lembretes para refletir as mudanças feitas
      setReminders((prevReminders) =>
        prevReminders.map((item) =>
          item.id === reminderData.id ? { ...item, ...reminderData } : item
        )
      );
      setIsEditModalVisible(false); // Fecha o modal de edição
    } catch (error) {
      console.error("Error updating reminder:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "remindersConsultation", id));
      setReminders(reminders.filter((reminder) => reminder.id !== id));
    } catch (error) {
      console.error("Error deleting reminder:", error);
    }
  };



  // Supondo que `currentReminderToEdit` seja seu estado que mantém o lembrete atual sendo editado
  const handleUpdate = async () => {
    const updatedReminder = {
      ...currentReminderToEdit,
      Type: typeConsultation,
      WarningHours: warningHours,
      date_time: date.toISOString(),
      location,
      observation,
      specialist,
      specialty,
    };

    try {
      await updateDoc(
        doc(db, "remindersConsultation", updatedReminder.id),
        updatedReminder
      );

      // Após a atualização, você pode querer atualizar a lista de lembretes ou fechar o modal
      setIsEditModalVisible(false);
      // Atualize sua lista de lembretes aqui, se necessário
    } catch (error) {
      console.error("Error updating reminder:", error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>
          Dr(a). {item.specialist} - {item.specialty}
        </Text>
        <Text style={styles.cardDetail}>Date: {item.formattedDate}</Text>
        <Text style={styles.cardDetail}>Time: {item.formattedTime}</Text>
        <Text style={styles.cardDetail}>Location: {item.location}</Text>
        <Text style={styles.cardDetail}>Observation: {item.observation}</Text>
        <Text style={styles.cardDetail}>
          Alert: {item.WarningHours} horas antes
        </Text>
        {/* Tipo de Consulta */}
        <Text style={styles.typeConsultation}>
  {item.TypeName} {/* Substitua `TypeName` pelo nome correto do campo */}
</Text>
      </View>
      <View style={styles.icons}>
        <TouchableOpacity onPress={() => openEditModal(item)}>
          <Icon name="edit" size={22} color="blue" style={styles.iconSpacing} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item.id)}>
          <Icon name="trash" size={24} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );
  

  return (
    <View style={styles.container}>
      <FlatList
        data={reminders}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
      {isEditModalVisible && (
        <ReminderEditModalConsulta
          isVisible={isEditModalVisible}
          onClose={() => setIsEditModalVisible(false)}
          reminderToEdit={currentReminderToEdit}
          onSave={onSave}
          typeOptions={typeOptions}
        />
      )}
    </View>
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
  typeConsultation: {
    fontWeight: 'bold',
    color: 'red',
    textAlign: 'center',
    marginTop: 5, // Ajuste conforme necessário
  },
  // Estilos adicionais conforme necessário...
});

export default RelRemindersConsultationScreen;
