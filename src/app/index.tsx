"use client"

import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native"
import { useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"

export default function Home() {
  const router = useRouter()

  return (
    <View style={styles.container}>
      <View style={styles.heroWrap}>
        <Image source={{ uri: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1000" }} style={styles.image} />
        <LinearGradient colors={["rgba(15,16,19,0.45)", "rgba(15,16,19,0)", "rgba(15,16,19,0.35)"]} style={styles.heroShade} />
        <View style={styles.badge}>
          <Ionicons name="restaurant" size={14} color="#10130a" />
          <Text style={styles.badgeText}>RecipeNow</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Descubra receitas{"\n"}para qualquer ocasião</Text>
        <Text style={styles.subtitle}>Busque por nome, filtre por culinária e guarde as favoritas.</Text>

        <TouchableOpacity onPress={() => router.push("/recipes")} style={styles.button} activeOpacity={0.9}>
          <Text style={styles.buttonText}>Explorar Receitas</Text>
          <Ionicons name="arrow-forward" size={20} color="#10130a" />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f1013" },
  heroWrap: { height: "52%", borderBottomLeftRadius: 40, borderBottomRightRadius: 40, overflow: "hidden" },
  image: { width: "100%", height: "100%" },
  heroShade: { ...StyleSheet.absoluteFillObject },
  badge: {
    position: "absolute", top: 56, left: 24, flexDirection: "row", alignItems: "center", gap: 6,
    backgroundColor: "#c6f25a", paddingHorizontal: 12, paddingVertical: 7, borderRadius: 999,
  },
  badgeText: { color: "#10130a", fontWeight: "800", fontSize: 13, letterSpacing: 0.3 },
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 32, justifyContent: "space-between", paddingBottom: 40 },
  title: { color: "white", fontSize: 34, fontWeight: "800", lineHeight: 38, letterSpacing: -1 },
  subtitle: { color: "#a1a7b5", fontSize: 16, lineHeight: 23, marginTop: -8 },
  button: {
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, backgroundColor: "#c6f25a",
    paddingVertical: 18, borderRadius: 22,
  },
  buttonText: { color: "#10130a", fontWeight: "800", fontSize: 18 },
})
