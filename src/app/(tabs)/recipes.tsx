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
import { LinearGradient } from "expo-linear-gradient"
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
    <TouchableOpacity style={styles.recipeCard} activeOpacity={0.9} onPress={() => router.push(`/recipes/${item.id}`)}>
      <Image
        source={{ uri: item.image || "https://via.placeholder.com/300x200?text=Sem+Imagem" }}
        style={styles.recipeImage}
        resizeMode="cover"
      />
      <LinearGradient colors={["rgba(10,11,14,0)", "rgba(10,11,14,0.55)", "rgba(10,11,14,0.94)"]} style={styles.cardShade} />
      <View style={styles.cuisineTag}>
        <Text style={styles.cuisineTagText}>{FLAGS[item.cuisine] || "🍽️"} {item.cuisine}</Text>
      </View>
      <View style={styles.recipeContent}>
        <Text style={styles.recipeTitle} numberOfLines={2}>
          {item.name}
        </Text>
        <View style={styles.recipeMetaContainer}>
          <View style={styles.recipeMeta}>
            <Ionicons name="time-outline" size={14} color="#c6f25a" />
            <Text style={styles.recipeMetaText}>{item.cookTimeMinutes} min</Text>
          </View>
          <View style={styles.dot} />
          <Text style={styles.recipeMetaText}>{item.difficulty || "Easy"}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )

  const renderCategoryItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={[styles.categoryButton, selectedCategory === item && styles.selectedCategoryButton]}
      onPress={() => filterByCategory(item)}
    >
      <Text style={styles.categoryEmoji}>{FLAGS[item] || "🍽️"}</Text>
      <Text style={[styles.categoryButtonText, selectedCategory === item && styles.selectedCategoryButtonText]}>
        {item}
      </Text>
    </TouchableOpacity>
  )

  const renderFooter = () => {
    if (!loadingMore) return null
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#c6f25a" />
        <Text style={styles.footerLoaderText}>Carregando mais receitas...</Text>
      </View>
    )
  }

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#c6f25a" />
        <Text style={styles.loadingText}>Carregando receitas...</Text>
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={48} color="#c6f25a" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadInitialData}>
          <Text style={styles.retryButtonText}>Tentar Novamente</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const header = (
    <View style={styles.header}>
      <Text style={styles.eyebrow}>RecipeNow</Text>
      <Text style={styles.heading}>O que vamos{"\n"}cozinhar hoje?</Text>
      <View style={styles.searchInputContainer}>
        <Ionicons name="search" size={20} color="#737a8a" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar receitas"
          placeholderTextColor="#737a8a"
          value={searchInput}
          onChangeText={setSearchInput}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        {searchInput.length > 0 && (
          <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
            <Ionicons name="close-circle" size={20} color="#737a8a" />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={handleSearch} style={styles.searchButton} disabled={searching}>
          {searching ? <ActivityIndicator size="small" color="#10130a" /> : <Ionicons name="arrow-forward" size={20} color="#10130a" />}
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
          contentContainerStyle={{ gap: 8, paddingRight: 8 }}
        />
      )}
    </View>
  )

  return (
    <View style={styles.container}>
      <FlatList
        data={displayedRecipes}
        renderItem={renderRecipeItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.recipesList}
        numColumns={2}
        columnWrapperStyle={styles.row}
        ListHeaderComponent={header}
        onEndReached={loadMoreRecipes}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#c6f25a" />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={48} color="#737a8a" />
            <Text style={styles.emptyText}>
              {searchQuery ? `Nenhuma receita encontrada para "${searchQuery}"` : "Nenhuma receita disponível"}
            </Text>
          </View>
        }
      />
    </View>
  )
}

const FLAGS: Record<string, string> = {
  Italian: "🍝", Asian: "🥢", American: "🍔", Mexican: "🌮", Mediterranean: "🫒", Pakistani: "🍛", Japanese: "🍣",
  Moroccan: "🍲", Greek: "🥙", Indian: "🍛", Thai: "🍜", French: "🥐", Turkish: "🥙", Lebanese: "🧆", Brazilian: "🍖",
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f1013" },
  header: { paddingTop: 56, paddingHorizontal: 4, paddingBottom: 18 },
  eyebrow: { color: "#c6f25a", fontSize: 13, fontWeight: "700", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 },
  heading: { color: "white", fontSize: 32, fontWeight: "800", lineHeight: 36, letterSpacing: -0.8, marginBottom: 20 },
  searchInputContainer: {
    flexDirection: "row", alignItems: "center", backgroundColor: "#181a20", borderRadius: 20, borderWidth: 1, borderColor: "#262a33",
    paddingLeft: 14, paddingRight: 6, paddingVertical: 6, marginBottom: 16,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, paddingVertical: 10, color: "white", fontSize: 16, outlineStyle: "none" as any },
  clearButton: { padding: 4, marginRight: 6 },
  searchButton: { backgroundColor: "#c6f25a", borderRadius: 14, width: 42, height: 42, alignItems: "center", justifyContent: "center" },
  categoriesList: { flexGrow: 0 },
  categoryButton: {
    flexDirection: "row", alignItems: "center", gap: 6, paddingVertical: 9, paddingHorizontal: 14, borderRadius: 999,
    backgroundColor: "#181a20", borderWidth: 1, borderColor: "#262a33",
  },
  selectedCategoryButton: { backgroundColor: "#c6f25a", borderColor: "#c6f25a" },
  categoryEmoji: { fontSize: 15 },
  categoryButtonText: { color: "#d7dbe4", fontSize: 14, fontWeight: "600" },
  selectedCategoryButtonText: { color: "#10130a" },
  recipesList: { paddingHorizontal: 16, paddingBottom: 120 },
  row: { justifyContent: "space-between", gap: 12 },
  recipeCard: { flex: 1, height: 250, borderRadius: 24, overflow: "hidden", marginBottom: 12, backgroundColor: "#181a20" },
  recipeImage: { ...StyleSheet.absoluteFillObject, width: "100%", height: "100%" },
  cardShade: { position: "absolute", left: 0, right: 0, bottom: 0, height: "72%" },
  cuisineTag: { position: "absolute", top: 12, left: 12, backgroundColor: "rgba(15,16,19,0.7)", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999 },
  cuisineTagText: { color: "white", fontSize: 11, fontWeight: "700" },
  recipeContent: { position: "absolute", left: 14, right: 14, bottom: 14 },
  recipeTitle: { color: "white", fontSize: 17, fontWeight: "800", lineHeight: 21, letterSpacing: -0.2, marginBottom: 8 },
  recipeMetaContainer: { flexDirection: "row", alignItems: "center", gap: 8 },
  recipeMeta: { flexDirection: "row", alignItems: "center", gap: 4 },
  recipeMetaText: { color: "#d7dbe4", fontSize: 12, fontWeight: "600" },
  dot: { width: 3, height: 3, borderRadius: 2, backgroundColor: "#737a8a" },
  loadingContainer: { flex: 1, backgroundColor: "#0f1013", justifyContent: "center", alignItems: "center" },
  loadingText: { color: "white", marginTop: 12, fontSize: 16 },
  errorContainer: { flex: 1, backgroundColor: "#0f1013", justifyContent: "center", alignItems: "center", padding: 16 },
  errorText: { color: "white", textAlign: "center", marginTop: 16, fontSize: 16 },
  retryButton: { marginTop: 16, backgroundColor: "#c6f25a", paddingHorizontal: 24, paddingVertical: 12, borderRadius: 999 },
  retryButtonText: { color: "#10130a", fontWeight: "700" },
  footerLoader: { flexDirection: "row", justifyContent: "center", alignItems: "center", padding: 16, gap: 8 },
  footerLoaderText: { color: "#a1a7b5" },
  emptyContainer: { alignItems: "center", paddingVertical: 60, gap: 12 },
  emptyText: { color: "#a1a7b5", textAlign: "center", fontSize: 16 },
})
