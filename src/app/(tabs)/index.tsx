import { useState, useEffect, useCallback } from "react"
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
  Keyboard,
} from "react-native"
import { useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { fetchRecipes, searchRecipes } from "../../services/api"
import type { Recipe } from "../../types"

const ITEMS_PER_PAGE = 10

export default function RecipesScreen() {
  const router = useRouter()
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [displayedRecipes, setDisplayedRecipes] = useState<Recipe[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [searchInput, setSearchInput] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(true)
  const [searching, setSearching] = useState<boolean>(false)
  const [loadingMore, setLoadingMore] = useState<boolean>(false)
  const [refreshing, setRefreshing] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [hasMoreData, setHasMoreData] = useState<boolean>(true)

  useEffect(() => {
    loadInitialData()
  }, [])

  const loadInitialData = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await fetchRecipes()
      setRecipes(data.recipes)

      const firstPage = data.recipes.slice(0, ITEMS_PER_PAGE)
      setDisplayedRecipes(firstPage)
      setCurrentPage(1)
      setHasMoreData(data.recipes.length > ITEMS_PER_PAGE)

      const uniqueCategories = [...new Set(data.recipes.map((recipe) => recipe.cuisine))].slice(0, 8)
      setCategories(uniqueCategories)

      setLoading(false)
    } catch (err) {
      setError("Falha ao carregar receitas. Tente novamente.")
      setLoading(false)
      console.error(err)
    }
  }

  const loadMoreRecipes = useCallback(() => {
    if (loadingMore || !hasMoreData || searchQuery) return

    setLoadingMore(true)
    const nextPage = currentPage + 1
    const startIndex = (nextPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE

    const recipesToShow = selectedCategory ? recipes.filter((recipe) => recipe.cuisine === selectedCategory) : recipes

    const newRecipes = recipesToShow.slice(startIndex, endIndex)

    if (newRecipes.length > 0) {
      setDisplayedRecipes((prev) => [...prev, ...newRecipes])
      setCurrentPage(nextPage)
      setHasMoreData(endIndex < recipesToShow.length)
    } else {
      setHasMoreData(false)
    }

    setLoadingMore(false)
  }, [currentPage, loadingMore, hasMoreData, searchQuery, selectedCategory, recipes])

  const handleSearch = async () => {
    if (searchInput.trim() === "") {
      setSearchQuery("")
      resetToInitialState()
      return
    }

    try {
      setSearching(true)
      setSearchQuery(searchInput.trim())
      Keyboard.dismiss()

      const results = await searchRecipes(searchInput.trim())
      setDisplayedRecipes(results.recipes)
      setSelectedCategory(null) 
      setHasMoreData(false) 
      setSearching(false)
    } catch (err) {
      console.error("Erro na busca:", err)
      setSearching(false)
    }
  }

  const clearSearch = () => {
    setSearchInput("")
    setSearchQuery("")
    resetToInitialState()
  }

  const resetToInitialState = () => {
    const recipesToShow = selectedCategory ? recipes.filter((recipe) => recipe.cuisine === selectedCategory) : recipes
    setDisplayedRecipes(recipesToShow.slice(0, ITEMS_PER_PAGE))
    setCurrentPage(1)
    setHasMoreData(recipesToShow.length > ITEMS_PER_PAGE)
  }

  const filterByCategory = (category: string) => {
    setSearchInput("")
    setSearchQuery("")

    if (category === selectedCategory) {
      setSelectedCategory(null)
      setDisplayedRecipes(recipes.slice(0, ITEMS_PER_PAGE))
      setCurrentPage(1)
      setHasMoreData(recipes.length > ITEMS_PER_PAGE)
    } else {
      setSelectedCategory(category)
      const filtered = recipes.filter((recipe) => recipe.cuisine === category)
      setDisplayedRecipes(filtered.slice(0, ITEMS_PER_PAGE))
      setCurrentPage(1)
      setHasMoreData(filtered.length > ITEMS_PER_PAGE)
    }
  }

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    setSearchInput("")
    setSearchQuery("")
    setSelectedCategory(null)
    await loadInitialData()
    setRefreshing(false)
  }, [])

  const renderRecipeItem = ({ item }: { item: Recipe }) => (
    <TouchableOpacity style={styles.recipeCard} onPress={() => router.push(`/recipes/${item.id}`)}>
      <Image
        source={{ uri: item.image || "https://via.placeholder.com/300x200?text=Sem+Imagem" }}
        style={styles.recipeImage}
        resizeMode="cover"
      />
      <View style={styles.recipeContent}>
        <Text style={styles.recipeTitle} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={styles.recipeIngredients} numberOfLines={2}>
          {item.ingredients.slice(0, 3).join(", ")}
          {item.ingredients.length > 3 ? "..." : ""}
        </Text>
        <View style={styles.recipeMetaContainer}>
          <View style={styles.recipeMeta}>
            <Ionicons name="flag-outline" size={14} color="#b4d335" />
            <Text style={styles.recipeMetaText}>{item.difficulty || "Easy"}</Text>
          </View>
          <View style={styles.recipeMeta}>
            <Ionicons name="time-outline" size={14} color="#b4d335" />
            <Text style={styles.recipeMetaText}>{item.cookTimeMinutes}min</Text>
          </View>
        </View>
        <View style={styles.cuisineTag}>
          <Text style={styles.cuisineTagText}>{item.cuisine}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )

  const renderCategoryItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={[styles.categoryButton, selectedCategory === item && styles.selectedCategoryButton]}
      onPress={() => filterByCategory(item)}
    >
      <Text style={[styles.categoryButtonText, selectedCategory === item && styles.selectedCategoryButtonText]}>
        {item}
      </Text>
    </TouchableOpacity>
  )

  const renderFooter = () => {
    if (!loadingMore) return null
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#b4d335" />
        <Text style={styles.footerLoaderText}>Carregando mais receitas...</Text>
      </View>
    )
  }

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#b4d335" />
        <Text style={styles.loadingText}>Carregando receitas...</Text>
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={48} color="#b4d335" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadInitialData}>
          <Text style={styles.retryButtonText}>Tentar Novamente</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar Receitas..."
            placeholderTextColor="#6b7280"
            value={searchInput}
            onChangeText={setSearchInput}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {searchInput.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <Ionicons name="close-circle" size={20} color="#6b7280" />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={handleSearch} style={styles.searchButton} disabled={searching}>
            {searching ? (
              <ActivityIndicator size="small" color="#1e1e24" />
            ) : (
              <Ionicons name="search" size={20} color="#1e1e24" />
            )}
          </TouchableOpacity>
        </View>
        {!searchQuery && (
          <FlatList
            data={categories}
            renderItem={renderCategoryItem}
            keyExtractor={(item) => item}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesList}
          />
        )}
      </View>

      <FlatList
        data={displayedRecipes}
        renderItem={renderRecipeItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.recipesList}
        numColumns={2}
        columnWrapperStyle={styles.row}
        onEndReached={loadMoreRecipes}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#b4d335" />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={48} color="#6b7280" />
            <Text style={styles.emptyText}>
              {searchQuery ? `Nenhuma receita encontrada para "${searchQuery}"` : "Nenhuma receita disponível"}
            </Text>
          </View>
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1e1e24",
  },
  searchContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333340",
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#252530",
    borderRadius: 8,

    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    color: "white",
    fontSize: 16,
  },
  clearButton: {
    padding: 4,
    marginRight: 8,
  },
  searchButton: {
    backgroundColor: "#b4d335",
    borderRadius: 6,
    padding: 8,
    minWidth: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  searchStatus: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#333340",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginBottom: 12,
  },
  searchStatusText: {
    color: "white",
    fontSize: 14,
  },
  clearSearchText: {
    color: "#b4d335",
    fontSize: 14,
    fontWeight: "500",
  },
  categoriesList: {
    marginTop: 4,
  },
  categoryButton: {
    marginRight: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#252530",
    borderWidth: 1,
    borderColor: "#333340",
  },
  selectedCategoryButton: {
    backgroundColor: "#b4d335",
    borderColor: "#b4d335",
  },
  categoryButtonText: {
    color: "white",
    fontWeight: "500",
    fontSize: 14,
  },
  selectedCategoryButtonText: {
    color: "#1e1e24",
  },
  recipesList: {
    padding: 16,
    paddingBottom: 100,
  },
  row: {
    justifyContent: "space-between",
  },
  recipeCard: {
    width: "48%",
    marginBottom: 16,
    backgroundColor: "#252530",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  recipeImage: {
    width: "100%",
    height: 120,
  },
  recipeContent: {
    padding: 12,
  },
  recipeTitle: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 6,
    lineHeight: 20,
  },
  recipeIngredients: {
    color: "#9ca3af",
    fontSize: 12,
    marginBottom: 8,
    lineHeight: 16,
  },
  recipeMetaContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  recipeMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  recipeMetaText: {
    color: "#b4d335",
    marginLeft: 4,
    fontSize: 12,
  },
  cuisineTag: {
    alignSelf: "flex-start",
    backgroundColor: "#333340",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  cuisineTagText: {
    color: "#b4d335",
    fontSize: 10,
    fontWeight: "500",
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
  retryButton: {
    marginTop: 16,
    backgroundColor: "#b4d335",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#1e1e24",
    fontWeight: "bold",
    fontSize: 16,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyText: {
    color: "white",
    textAlign: "center",
    marginTop: 16,
    fontSize: 16,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: "center",
  },
  footerLoaderText: {
    color: "#9ca3af",
    marginTop: 8,
    fontSize: 14,
  },
})
