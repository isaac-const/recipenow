import AsyncStorage from "@react-native-async-storage/async-storage"
import type { Recipe } from "../types"

const FAVORITES_KEY = "@RecipeNow:favorites"

export const getFavorites = async (): Promise<Recipe[]> => {
  try {
    const favoritesJson = await AsyncStorage.getItem(FAVORITES_KEY)
    return favoritesJson ? JSON.parse(favoritesJson) : []
  } catch (error) {
    console.error("Erro ao obter favoritos:", error)
    return []
  }
}

export const isFavorite = async (recipeId: number): Promise<boolean> => {
  try {
    const favorites = await getFavorites()
    return favorites.some((fav) => fav.id === recipeId)
  } catch (error) {
    console.error("Erro ao verificar favorito:", error)
    return false
  }
}

export const toggleFavorite = async (recipe: Recipe): Promise<boolean> => {
  try {
    const favorites = await getFavorites()
    const isAlreadyFavorite = favorites.some((fav) => fav.id === recipe.id)

    let newFavorites: Recipe[]

    if (isAlreadyFavorite) {
      newFavorites = favorites.filter((fav) => fav.id !== recipe.id)
    } else {
      newFavorites = [...favorites, recipe]
    }

    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites))
    return !isAlreadyFavorite
  } catch (error) {
    console.error("Erro ao alternar favorito:", error)
    return false
  }
}
export const removeFavorite = async (recipeId: number): Promise<boolean> => {
  try {
    const favorites = await getFavorites()
    const newFavorites = favorites.filter((fav) => fav.id !== recipeId)
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites))
    return true
  } catch (error) {
    console.error("Erro ao remover favorito:", error)
    return false
  }
}
