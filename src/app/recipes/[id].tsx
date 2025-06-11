
import { useState, useEffect } from "react"
import { View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native"
import { useLocalSearchParams } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { fetchRecipeById } from "../../services/api"
import { toggleFavorite, isFavorite } from "../../services/favorites"
import type { Recipe } from "../../types"

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [favorite, setFavorite] = useState<boolean>(false)

  useEffect(() => {
    const loadRecipe = async () => {
      try {
        setLoading(true)
        const data = await fetchRecipeById(id)
        setRecipe(data)

        const isFav = await isFavorite(data.id)
        setFavorite(isFav)

        setLoading(false)
      } catch (err) {
        setError("Falha ao carregar detalhes da receita.")
        setLoading(false)
        console.error(err)
      }
    }

    if (id) {
      loadRecipe()
    }
  }, [id])

  const handleToggleFavorite = async () => {
    if (recipe) {
      const newStatus = await toggleFavorite(recipe)
      setFavorite(newStatus)
    }
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#b4d335" />
        <Text style={styles.loadingText}>Carregando receita...</Text>
      </View>
    )
  }

  if (error || !recipe) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={48} color="#b4d335" />
        <Text style={styles.errorText}>{error || "Receita não encontrada"}</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: recipe.image || "https://via.placeholder.com/400x300?text=Sem+Imagem" }}
            style={styles.recipeImage}
            resizeMode="cover"
          />
          <TouchableOpacity style={styles.favoriteButton} onPress={handleToggleFavorite}>
            <Ionicons name={favorite ? "heart" : "heart-outline"} size={24} color={favorite ? "#ff4757" : "#000"} />
          </TouchableOpacity>
        </View>

        <View style={styles.contentContainer}>
          <Text style={styles.recipeTitle}>{recipe.name}</Text>

          <View style={styles.infoCard}>
            <Text style={styles.sectionTitle}>Informações Gerais</Text>
            <View style={styles.infoGrid}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Dificuldade</Text>
                <Text style={styles.infoValue}>{recipe.difficulty || "Easy"}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Preparo</Text>
                <Text style={styles.infoValue}>{recipe.prepTimeMinutes}min</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Origem</Text>
                <Text style={styles.infoValue}>{recipe.cuisine}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Cozimento</Text>
                <Text style={styles.infoValue}>{recipe.cookTimeMinutes}min</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ingredientes</Text>
            <View style={styles.card}>
              {recipe.ingredients.map((ingredient, index) => (
                <View key={index} style={styles.ingredientItem}>
                  <View style={styles.bulletPoint} />
                  <Text style={styles.ingredientText}>{ingredient}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Instruções</Text>
            <View style={styles.card}>
              {recipe.instructions.map((instruction, index) => (
                <View key={index} style={styles.instructionItem}>
                  <View style={styles.instructionNumber}>
                    <Text style={styles.instructionNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.instructionText}>{instruction}</Text>
                </View>
              ))}
            </View>
          </View>

          {recipe.tags && recipe.tags.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Tags</Text>
              <View style={styles.tagsContainer}>
                {recipe.tags.map((tag, index) => (
                  <View key={index} style={styles.tagItem}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
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
  loadingContainer: {
    flex: 1,
    backgroundColor: "#1e1e24",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "white",
    marginTop: 12,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: "#1e1e24",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  errorText: {
    color: "white",
    textAlign: "center",
    marginTop: 16,
    fontSize: 16,
  },
  imageContainer: {
    position: "relative",
  },
  recipeImage: {
    width: "100%",
    height: 280,
  },
  favoriteButton: {
    position: "absolute",
    bottom: 16,
    right: 16,
    backgroundColor: "white",
    borderRadius: 50,
    padding: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  contentContainer: {
    padding: 20,
  },
  recipeTitle: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 16,
    lineHeight: 34,
  },
  infoCard: {
    backgroundColor: "#252530",
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  infoItem: {
    width: "48%",
    marginBottom: 16,
  },
  infoLabel: {
    color: "#9ca3af",
    fontSize: 14,
    marginBottom: 4,
  },
  infoValue: {
    color: "#b4d335",
    fontWeight: "600",
    fontSize: 16,
  },
  section: {
    marginBottom: 24,
  },
  card: {
    backgroundColor: "#252530",
    borderRadius: 12,
    padding: 20,
  },
  ingredientItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  bulletPoint: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#b4d335",
    marginRight: 12,
  },
  ingredientText: {
    color: "white",
    fontSize: 16,
    flex: 1,
  },
  instructionItem: {
    flexDirection: "row",
    marginBottom: 20,
  },
  instructionNumber: {
    backgroundColor: "#b4d335",
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    marginTop: 2,
  },
  instructionNumberText: {
    color: "#1e1e24",
    fontWeight: "bold",
    fontSize: 14,
  },
  instructionText: {
    color: "white",
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  tagItem: {
    backgroundColor: "#252530",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: "#b4d335",
    fontSize: 14,
  },
})
