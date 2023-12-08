//RelPressaoArterialScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { db } from "../../config/firebaseConfig";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { LineChart } from "react-native-chart-kit";
import { getAuth } from "firebase/auth";

const screenWidth = Dimensions.get("window").width;
const recordsPerPage = 10; // Adicione esta linha para definir quantos registros por página você deseja

const RelPressaoArterialScreen = ({ closeModal }) => {
  const [pressaoData, setPressaoData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);

  // ...

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const q = query(
          collection(db, "pressaoArterial"),
          where("UsuarioID", "==", user.uid),
          orderBy("DataHora", "desc")
        );
        const querySnapshot = await getDocs(q);
        const newData = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            ...data,
            DataHora: data.DataHora.toDate(),
            Sistolica: Number(data.Sistolica),
            Diastolica: Number(data.Diastolica),
          };
        });
        setPressaoData(newData);
      } catch (error) {
        console.error("Erro ao buscar dados: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filtrando a última semana
  const umaSemanaAtras = new Date();
  umaSemanaAtras.setDate(umaSemanaAtras.getDate() - 7);
  const dadosFiltrados = pressaoData.filter(
    (p) => p.DataHora >= umaSemanaAtras
  );

  const totalPages = Math.ceil(pressaoData.length / recordsPerPage); // Correção para calcular o total de páginas

  // Criando as labels e datasets após a filtragem dos dados
  const labels = dadosFiltrados.map(
    (p) =>
      `${p.DataHora.getDate()}/${
        p.DataHora.getMonth() + 1
      } ${p.DataHora.getHours()}:${p.DataHora.getMinutes()}`
  );
  const sistolicaValues = dadosFiltrados.map((p) => p.Sistolica);
  const diastolicaValues = dadosFiltrados.map((p) => p.Diastolica);

  // Implementando a lógica de paginação para a tabela
  const itensPorPagina = 10;
  const [paginaAtual, setPaginaAtual] = useState(0);
  const paginas = Math.ceil(dadosFiltrados.length / itensPorPagina);

  const dadosPaginados = pressaoData.slice(
    currentPage * recordsPerPage,
    (currentPage + 1) * recordsPerPage
  );

  // Função para mudar de página
  const mudarPagina = (novaPagina) => {
    if (novaPagina >= 0 && novaPagina < totalPages) {
      // Correção para usar totalPages
      setCurrentPage(novaPagina);
    }
  };

  const exportToPDF = async () => {
    // Aqui você implementará a lógica de exportação para PDF.
    // Isso geralmente envolve a criação de um documento PDF com os dados e salvando ou compartilhando o arquivo.
    console.log("Exportar para PDF");
  };

  return (
    <View style={styles.modalOverlay}>
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollViewContent}
      >
        <Text style={styles.title}>Relatório de Pressão Arterial</Text>

        <View style={styles.tableHeader}>
          <Text style={styles.headerText}>Data/Hora</Text>
          <Text style={styles.headerText}>Sistólica</Text>
          <Text style={styles.headerText}>Diastólica</Text>
          <Text style={styles.headerText}>Humor</Text>
        </View>
        {dadosPaginados.map((pressao, index) => (
          <View key={index} style={styles.recordRow}>
            <Text style={styles.recordCell}>
              {pressao.DataHora
                ? `${pressao.DataHora.toLocaleDateString()} ${pressao.DataHora.toLocaleTimeString()}`
                : "Data não disponível"}
            </Text>
            <Text style={styles.recordCell}>{pressao.Sistolica}</Text>
            <Text style={styles.recordCell}>{pressao.Diastolica}</Text>
            <Text style={styles.recordCell}>{pressao.Humor}</Text>
          </View>
        ))}

        <View style={styles.paginationContainer}>
          <TouchableOpacity
            onPress={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 0}
            style={styles.paginationButton}
          >
            <Text>Anterior</Text>
          </TouchableOpacity>

          <Text style={styles.pageNumberText}>
            {currentPage + 1} de {totalPages}
          </Text>

          <TouchableOpacity
            onPress={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages - 1}
            style={styles.paginationButton}
          >
            <Text>Próximo</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>Historico da Pressão Arterial</Text>

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
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    paddingTop: 20, // Ajustar conforme necessário para mover o conteúdo para baixo
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
    // Adicionar paddingTop aqui se você não quiser adicionar no modalOverlay
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
    marginTop: 10,
    marginRight: 30,  // Garante que a margem direita seja 0

    // Certifique-se de que não há padding ou margin que afete a largura
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
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  pageNumberText: {
    fontSize: 16,
  },
  paginationButton: {
    padding: 10,
    backgroundColor: "#E0E0E0",
    borderRadius: 5,
  },
});

export default RelPressaoArterialScreen;
