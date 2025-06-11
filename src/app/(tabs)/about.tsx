import { View, Text, Image, ScrollView, Linking, TouchableOpacity, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"

export default function AboutScreen() {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>RecipeNow</Text>
          <Text style={styles.version}>Versão 1.0.0</Text>
          <Text style={styles.subtitle}>Aplicativo de Receitas Foda🐀</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Tecnologias Utilizadas</Text>
          <View style={styles.tagsContainer}>
            {["React Native", "Expo Router", "TypeScript", "DummyJSON API", "AsyncStorage"].map((tech, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tech}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Funcionalidades</Text>
          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <Ionicons name="search" size={20} color="#b4d335" />
              <Text style={styles.featureText}>Busca inteligente de receitas</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="heart" size={20} color="#b4d335" />
              <Text style={styles.featureText}>Sistema de favoritos</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="filter" size={20} color="#b4d335" />
              <Text style={styles.featureText}>Filtros por categoria</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Desenvolvido por:</Text>
          <View style={styles.developerContainer}>
            <Image source={{ uri: "https://avatars.githubusercontent.com/u/179552476?s=400&u=22f36682051e12bc5e5d7128deba62b08e4928f9&v=478" }} style={styles.avatar} />
            <Text style={styles.developerName}>Isaac</Text>
            <Text style={styles.developerEmail}>isaaccs.code@gmail.com</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Sobre o Aplicativo</Text>
          <Text style={styles.description}>
            RecipeNow é um aplicativo de receitas desenvolvido com React Native e Expo Router. Feito para descobrir, pesquisar e salvar receitas.
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Projeto feito para Sistemas para Internet, quero 9,5 👍</Text>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1e1e24",
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
    paddingVertical: 20,
  },
  title: {
    color: "#b4d335",
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
  },
  version: {
    color: "#9ca3af",
    fontSize: 16,
    marginBottom: 4,
  },
  subtitle: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#252530",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  sectionTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  tag: {
    backgroundColor: "#333340",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: "#b4d335",
    fontSize: 14,
    fontWeight: "500",
  },
  featuresList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  featureText: {
    color: "white",
    fontSize: 16,
    marginLeft: 12,
  },
  developerContainer: {
    alignItems: "center",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
  },
  developerName: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  developerEmail: {
    color: "#9ca3af",
    fontSize: 16,
    marginBottom: 20,
  },
  socialLinks: {
    flexDirection: "row",
    gap: 16,
  },
  socialButton: {
    backgroundColor: "#333340",
    borderRadius: 50,
    padding: 12,
  },
  description: {
    color: "#d1d5db",
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 12,
  },
  attributionsList: {
    gap: 12,
  },
  attributionItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  attributionText: {
    color: "#d1d5db",
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  footer: {
    alignItems: "center",
    paddingVertical: 24,
  },
  footerText: {
    color: "#9ca3af",
    fontSize: 14,
  },
})
