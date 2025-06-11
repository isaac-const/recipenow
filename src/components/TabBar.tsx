import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { useRouter, usePathname } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import type { TabBarProps } from "../types"

export default function TabBar({ currentRoute }: TabBarProps) {
  const router = useRouter()
  const pathname = usePathname()

  const isActive = (path: string): boolean => {
    if (path === "/") return pathname === "/"
    return pathname.startsWith(path)
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.tabItem} onPress={() => router.push("/")}>
        <Ionicons name={isActive("/") ? "home" : "home-outline"} size={24} color={isActive("/") ? "#b4d335" : "#fff"} />
        <Text style={isActive("/") ? styles.activeTabText : styles.tabText}>Início</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.tabItem} onPress={() => router.push("/recipes")}>
        <Ionicons
          name={isActive("/recipes") ? "restaurant" : "restaurant-outline"}
          size={24}
          color={isActive("/recipes") ? "#b4d335" : "#fff"}
        />
        <Text style={isActive("/recipes") ? styles.activeTabText : styles.tabText}>Receitas</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.tabItem} onPress={() => router.push("/favorites")}>
        <Ionicons
          name={isActive("/favorites") ? "heart" : "heart-outline"}
          size={24}
          color={isActive("/favorites") ? "#b4d335" : "#fff"}
        />
        <Text style={isActive("/favorites") ? styles.activeTabText : styles.tabText}>Favoritos</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.tabItem} onPress={() => router.push("/about")}>
        <Ionicons
          name={isActive("/about") ? "information-circle" : "information-circle-outline"}
          size={24}
          color={isActive("/about") ? "#b4d335" : "#fff"}
        />
        <Text style={isActive("/about") ? styles.activeTabText : styles.tabText}>Sobre</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#252530",
    borderTopWidth: 1,
    borderTopColor: "#333340",
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 8,
  },
  tabItem: {
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  tabText: {
    color: "white",
    fontSize: 12,
  },
  activeTabText: {
    color: "#b4d335",
    fontSize: 12,
  },
})
