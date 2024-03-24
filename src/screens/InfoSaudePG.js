import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { getAuth } from "firebase/auth";
import { db } from "../config/firebaseConfig";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";

const InfoSaudePG = () => {
  const [pressaoData, setPressaoData] = useState([]);
  const [glicemiaData, setGlicemiaData] = useState([]);
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    const fetchPressaoArterial = async () => {
      const umaSemanaAtras = new Date();
      umaSemanaAtras.setDate(umaSemanaAtras.getDate() - 30);

      const q = query(
        collection(db, "pressaoArterial"),
        where("UsuarioID", "==", user.uid),
        where("DataHora", ">=", umaSemanaAtras),
        orderBy("DataHora", "desc")
      );
      const querySnapshot = await getDocs(q);
      setPressaoData(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    const fetchGlicemia = async () => {
      const umaSemanaAtras = new Date();
      umaSemanaAtras.setDate(umaSemanaAtras.getDate() - 30);

      const q = query(
        collection(db, "diabetes"),
        where("ID_user", "==", user.uid),
        where("Datetime", ">=", umaSemanaAtras),
        orderBy("Datetime", "desc")
      );
      const querySnapshot = await getDocs(q);
      setGlicemiaData(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    fetchPressaoArterial();
    fetchGlicemia();
  }, [user]);

  const TableHeader = ({ headers }) => (
    <View style={styles.tableHeaderRow}>
      {headers.map((header, index) => (
        <Text key={index} style={styles.tableHeaderCell}>{header}</Text>
      ))}
    </View>
  );
  
  const renderPressaoTable = () => (
    <View style={styles.table}>
      <TableHeader headers={['Data/Hora', 'Pressão Alta/Baixa', 'Humor', 'Tontura/Dor']} />
      {pressaoData.map((item, index) => {
        const sistolica = parseInt(item.Sistolica, 10);
        const diastolica = parseInt(item.Diastolica, 10);
        let backgroundColor = '#fff'; // Cor padrão
  
        // Altera a cor de fundo se a pressão estiver alta ou baixa
        if (sistolica > 140 || diastolica > 90) {
          backgroundColor = '#ffcccc'; // Vermelho claro para pressão alta
        } else if (sistolica < 110 || diastolica < 60) {
          backgroundColor = '#ccccff'; // Azul claro para pressão baixa
        }
  
        return (
          <View key={index} style={[styles.tableRow, { backgroundColor }]}>
            <Text style={styles.tableCell}>{new Date(item.DataHora.seconds * 1000).toLocaleString()}</Text>
            <Text style={styles.tableCell}>{`${item.Sistolica}/${item.Diastolica}`}</Text>
            <Text style={styles.tableCell}>{item.Humor}</Text>
            <Text style={styles.tableCell}>{item.Tontura ? 'Sim' : 'Não'}</Text>
          </View>
        );
      })}
    </View>
  );
  
  const calculateGlicemiaSummary = () => {
    if (!glicemiaData.length) {
      return (
        <Text style={styles.summaryText}>Carregando dados...</Text>
      );
    }
  
    const totalGlicemia = glicemiaData.reduce((acc, curr) => acc + parseInt(curr.Glicemia, 10), 0);
    const averageGlicemia = totalGlicemia / glicemiaData.length;
  
    const humorCounts = glicemiaData.reduce((acc, curr) => {
      acc[curr.Humor] = (acc[curr.Humor] || 0) + 1;
      return acc;
    }, {});
    const mostFrequentHumor = Object.keys(humorCounts).reduce((a, b) => humorCounts[a] > humorCounts[b] ? a : b, '');
  
    const jejumDias = glicemiaData.filter(item => item.Infasting).length;
  
    return (
      <Text style={styles.summaryText}>
        A média de glicemia do usuário foi <Text style={styles.boldText}>{averageGlicemia.toFixed(1)} mg/dL</Text>
        {' '}nos últimos 30 dias. O humor mais frequente foi <Text style={styles.boldText}>{mostFrequentHumor}</Text>
        {', '}e a pessoa esteve em jejum por <Text style={styles.boldText}>{jejumDias}</Text> dias.
      </Text>
    );
  };
  
  const renderGlicemiaTable = () => (
    <View style={styles.table}>
      <TableHeader headers={['Data e Hora', 'Glicemia', 'Em Jejum', 'Humor']} />
      {glicemiaData.map((item, index) => {
        let backgroundColor = '#fff'; // Cor padrão para linhas normais
  
        if (item.Glicemia > 100) {
          backgroundColor = '#ffcccc'; // Vermelho claro para glicemia alta
        } else if (item.Glicemia < 70) {
          backgroundColor = '#ccccff'; // Azul claro para glicemia baixa
        }
  
        return (
          <View key={index} style={[styles.tableRow, { backgroundColor }]}>
            <Text style={styles.tableCell}>{new Date(item.Datetime.seconds * 1000).toLocaleString()}</Text>
            <Text style={styles.tableCell}>{`${item.Glicemia} mg/dL`}</Text>
            <Text style={styles.tableCell}>{item.Infasting ? 'Sim' : 'Não'}</Text>
            <Text style={styles.tableCell}>{item.Humor}</Text>
          </View>
        );
      })}
    </View>
  );
  
  const calculateSummary = () => {
    if (!pressaoData.length) return 'Carregando dados...';
  
    const totalSistolica = pressaoData.reduce((acc, curr) => acc + parseInt(curr.Sistolica, 10), 0);
    const totalDiastolica = pressaoData.reduce((acc, curr) => acc + parseInt(curr.Diastolica, 10), 0);
    const averageSistolica = totalSistolica / pressaoData.length;
    const averageDiastolica = totalDiastolica / pressaoData.length;
  
    const humorCounts = pressaoData.reduce((acc, curr) => {
      acc[curr.Humor] = (acc[curr.Humor] || 0) + 1;
      return acc;
    }, {});
    const mostFrequentHumor = Object.keys(humorCounts).reduce((a, b) => humorCounts[a] > humorCounts[b] ? a : b, '');
  
    const tonturaDias = pressaoData.filter(item => item.Tontura).length;
  
    return (
      <Text style={styles.summaryText}>
        O usuário teve uma média de pressão{' '}
        <Text style={styles.boldText}>{averageSistolica.toFixed(1)}/{averageDiastolica.toFixed(1)}</Text>
        {' '}nesses 30 dias, seus humores variaram, porém ele ficou mais{' '}
        <Text style={styles.boldText}>{mostFrequentHumor}</Text>
        {' '}e teve{' '}
        <Text style={styles.boldText}>{tonturaDias}</Text>
        {' '}dias de dor e tontura.
      </Text>
    );
  };
  
  
  const SummarySection = () => (
    <View style={styles.summarySection}>
      <Text style={styles.summaryText}>{calculateSummary()}</Text>
    </View>
  );
  const GlicemiaSummarySection = () => (
    <View style={styles.summarySection}>
      {calculateGlicemiaSummary()}
    </View>
  );
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.title}>Pressão Arterial - Últimos 30 dias</Text>
        {renderPressaoTable()}
      </View>
      <SummarySection />
      <View style={[styles.section, styles.sectionWithSpacing]}>
        <Text style={styles.title}>Glicemia - Últimos 30 dias</Text>
        {renderGlicemiaTable()}
      </View>
      <GlicemiaSummarySection />
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
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  table: {
    alignSelf: 'stretch', // Para ocupar toda a largura disponível
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: 'center', // Para centralizar os itens na linha
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  tableCell: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 2, // Adiciona um pequeno espaçamento horizontal
    textAlign: 'center', // Centraliza o texto na célula
  },
  tableHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
    backgroundColor: '#f0f0f0', // Cor de fundo do cabeçalho
  },
  tableHeaderCell: {
    fontWeight: 'bold', // Texto em negrito
    fontSize: 16, // Tamanho do texto
    // Adicione mais estilos conforme necessário
  },
  summaryText: {
    fontSize: 18, // Make sure the text is larger if needed
    marginTop: 10, // Add some space above the summary for clarity
    // Add any other styling you wish here
  },
  boldText: {
    fontWeight: 'bold',
    // You might not need additional properties here as <Text> style inheritance works within nested <Text> components
  },
  // Make sure you have styles for your summarySection if you need to adjust layout or padding
  summarySection: {
    paddingTop: 10,
    paddingBottom: 20, // Adjust this value as needed for bottom padding
    // Add any other layout adjustments here
  },

  // Add a new style for the section that comes after a summary section
  sectionWithSpacing: {
    marginTop: 20, // Adjust this value as needed for top margin
  },

});

export default InfoSaudePG;
