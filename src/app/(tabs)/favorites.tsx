import { useState, useCallback } from "react"
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
} from "react-native"
import { useRouter, useFocusEffect } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { getFavorites, removeFavorite } from "../../services/favorites"
import type { Recipe } from "../../types"

export default function FavoritesScreen() {
  const router = useRouter()
  const [favorites, setFavorites] = useState<Recipe[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [refreshing, setRefreshing] = useState<boolean>(false)

  const loadFavorites = useCallback(async () => {
    try {
      setLoading(true)
      const favs = await getFavorites()
      setFavorites(favs)
      setLoading(false)
    } catch (err) {
      console.error("Erro ao carregar favoritos:", err)
      setLoading(false)
    }
  }, [])

  useFocusEffect(
    useCallback(() => {
      loadFavorites()
    }, [loadFavorites]),
  )

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await loadFavorites()
    setRefreshing(false)
  }, [loadFavorites])

  const handleRemoveFavorite = async (id: number) => {
    await removeFavorite(id)
    loadFavorites()
  }

  const renderFavoriteItem = ({ item }: { item: Recipe }) => (
    <View style={styles.favoriteCard}>
      <TouchableOpacity style={styles.favoriteContent} onPress={() => router.push(`/recipes/${item.id}`)}>
        <Image
          source={{ uri: item.image || "https://via.placeholder.com/300x200?text=Sem+Imagem" }}
          style={styles.favoriteImage}
          resizeMode="cover"
        />
        <View style={styles.favoriteDetails}>
          <Text style={styles.favoriteTitle} numberOfLines={2}>
            {item.name}
          </Text>
          <Text style={styles.favoriteIngredients} numberOfLines={2}>
            {item.ingredients.slice(0, 3).join(", ")}
            {item.ingredients.length > 3 ? "..." : ""}
          </Text>
          <View style={styles.favoriteMetaContainer}>
            <View style={styles.favoriteMeta}>
              <Ionicons name="flag-outline" size={14} color="#c6f25a" />
              <Text style={styles.favoriteMetaText}>{item.difficulty || "Easy"}</Text>
            </View>
            <View style={styles.favoriteMeta}>
              <Ionicons name="time-outline" size={14} color="#c6f25a" />
              <Text style={styles.favoriteMetaText}>{item.cookTimeMinutes}min</Text>
            </View>
          </View>
          <View style={styles.cuisineTag}>
            <Text style={styles.cuisineTagText}>{item.cuisine}</Text>
          </View>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.removeButton} onPress={() => handleRemoveFavorite(item.id)}>
        <Ionicons name="close" size={16} color="#fff" />
      </TouchableOpacity>
    </View>
  )

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#c6f25a" />
        <Text style={styles.loadingText}>Carregando favoritos...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="heart-outline" size={64} color="#737a8a" />
          <Text style={styles.emptyTitle}>Nenhum favorito ainda</Text>
          <Text style={styles.emptyText}>Adicione receitas aos seus favoritos para vê-las aqui</Text>
          <TouchableOpacity style={styles.exploreButton} onPress={() => router.push("/recipes")}>
            <Text style={styles.exploreButtonText}>Explorar Receitas</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={favorites}
          renderItem={renderFavoriteItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.favoritesList}
          ListHeaderComponent={<Text style={styles.pageTitle}>Favoritos</Text>}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#c6f25a" />}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f1013",
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#0f1013",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "white",
    marginTop: 12,
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  emptyTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    color: "#a1a7b5",
    textAlign: "center",
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  exploreButton: {
    backgroundColor: "#c6f25a",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  exploreButtonText: {
    color: "#0f1013",
    fontWeight: "bold",
    fontSize: 16,
  },
  favoritesList: {
    paddingTop: 56,
    paddingHorizontal: 16,
    paddingBottom: 120,
  },
  pageTitle: { color: "white", fontSize: 32, fontWeight: "800", letterSpacing: -0.8, marginBottom: 20 },
  favoriteCard: {
    marginBottom: 16,
    backgroundColor: "#181a20",
    borderRadius: 22,
    overflow: "hidden",
    position: "relative",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  favoriteContent: {
    flexDirection: "row",
  },
  favoriteImage: {
    width: 100,
    height: 100,
  },
  favoriteDetails: {
    flex: 1,
    padding: 12,
  },
  favoriteTitle: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 6,
    lineHeight: 20,
  },
  favoriteIngredients: {
    color: "#a1a7b5",
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 18,
  },
  favoriteMetaContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  favoriteMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  favoriteMetaText: {
    color: "#c6f25a",
    fontSize: 12,
    marginLeft: 4,
  },
  cuisineTag: {
    alignSelf: "flex-start",
    backgroundColor: "#262a33",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  cuisineTagText: {
    color: "#c6f25a",
    fontSize: 10,
    fontWeight: "500",
  },
  removeButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#ff4757",
    borderRadius: 50,
    padding: 6,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
})
