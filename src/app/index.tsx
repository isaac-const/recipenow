"use client"

import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native"
import { useRouter } from "expo-router"

export default function Home() {
  const router = useRouter()

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>RecipeNow</Text>
        <Text style={styles.subtitle}>Descubra receitas deliciosas para qualquer ocasião</Text>

        <Image source={{ uri: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c" }} style={styles.image} />

        <TouchableOpacity onPress={() => router.push("/recipes")} style={styles.button}>
          <Text style={styles.buttonText}>Explorar Receitas</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1e1e24",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  content: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#b4d335",
    marginBottom: 8,
  },
  subtitle: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
    marginBottom: 32,
  },
  image: {
    width: 256,
    height: 256,
    borderRadius: 128,
    marginBottom: 40,
    shadowColor: "#b4d335",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
  },
  button: {
    backgroundColor: "#b4d335",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 50,
    width: 256,
  },
  buttonText: {
    color: "#1e1e24",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18,
  },
})
