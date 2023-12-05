import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { db } from "../../config/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { getAuth } from "firebase/auth";


const screenWidth = Dimensions.get("window").width;

const RelPressaoArterialScreen = ({ closeModal }) => {
  const [pressaoData, setPressaoData] = useState([]);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    const fetchData = async () => {
      if (user) {
        const q = query(
          collection(db, "pressaoArterial"),
          where("UsuarioID", "==", user.uid)
        );
        const querySnapshot = await getDocs(q);
        const pressoes = querySnapshot.docs
          .map((doc) => {
            const data = doc.data();
            const sistolica = parseFloat(data.Sistolica);
            const diastolica = parseFloat(data.Diastolica);
            if (!isNaN(sistolica) && !isNaN(diastolica)) {
              return {
                id: doc.id,
                sistolica: sistolica,
                diastolica: diastolica,
                humor: data.Humor,
                tontura: data.Tontura,
                dataHora: data.DataHora.toDate(),
              };
            }
            return null;
          })
          .filter(Boolean);
        setPressaoData(pressoes);
      }
    };
    fetchData();
  }, []);

  const sistolicaValues = pressaoData.map((p) => p.sistolica);
  const diastolicaValues = pressaoData.map((p) => p.diastolica);
  const labels = pressaoData.map(
    (p) => `${p.dataHora.getDate()}/${p.dataHora.getMonth() + 1}`
  );

  const exportToPDF = async () => {
   
  };
  

  return (
    <View style={styles.modalOverlay}>
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollViewContent}
      >
        <Text style={styles.title}>Relatorio de Pressão Arterial</Text>
        <View style={styles.tableHeader}>
          <Text style={styles.headerText}>#</Text>
          <Text style={styles.headerText}>Sistólica</Text>
          <Text style={styles.headerText}>Diastólica</Text>
          <Text style={styles.headerText}>Humor</Text>
          <Text style={styles.headerText}>Data</Text>
        </View>
        {pressaoData.map((pressao, index) => (
          <View key={pressao.id} style={styles.recordRow}>
            <Text style={styles.recordCell}>{index + 1}</Text>
            <Text style={styles.recordCell}>{pressao.sistolica}</Text>
            <Text style={styles.recordCell}>{pressao.diastolica}</Text>
            <Text style={styles.recordCell}>{pressao.humor}</Text>
            <Text style={styles.recordCell}>
              {pressao.dataHora.toLocaleDateString()}
            </Text>
          </View>
        ))}
        <LineChart
          data={{
            labels: labels,
            datasets: [
              {
                data: sistolicaValues,
                color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
                strokeWidth: 2,
              },
              {
                data: diastolicaValues,
                color: (opacity = 1) => `rgba(244, 65, 134, ${opacity})`,
                strokeWidth: 2,
              },
            ],
          }}
          width={screenWidth}
          height={220}
          chartConfig={{
            backgroundColor: "#e26a00",
            backgroundGradientFrom: "#fb8c00",
            backgroundGradientTo: "#ffa726",
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: { borderRadius: 16 },
            propsForDots: { r: "6", strokeWidth: "2", stroke: "#ffa726" },
          }}
          bezier
          style={styles.chartContainer}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.exportButton]}
            onPress={exportToPDF}
          >
            <Text style={styles.buttonText}>Exportar para PDF</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.closeButton]}
            onPress={closeModal}
          >
            <Text style={styles.buttonText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.95)", // Semi-transparente para esconder o fundo
  },
  scrollContainer: {
    flex: 1,
    width: "100%",
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 20,
  },
  tableHeader: {
    alignSelf: "stretch",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    textAlign: "left", // Alterado para 'left' para alinhar à esquerda.
    backgroundColor: "#eee", // fundo da cabeçalho da tabela
  },
  headerText: {
    fontWeight: "bold",
    textAlign: "center",
  },
  recordRow: {
    alignSelf: "stretch",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  recordCell: {
    flex: 1,
    textAlign: "left", // Alterado para 'left' para alinhar à esquerda.
  },
  chartContainer: {
    alignSelf: "stretch",
    marginTop: 20,
  },
  buttonContainer: {
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    marginTop: 20,
  },
  button: {
    padding: 15,
    width: "90%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 10,
  },
  exportButton: {
    backgroundColor: "#4CAF50",
  },
  closeButton: {
    backgroundColor: "#f44336",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default RelPressaoArterialScreen;
