import axios from "axios"
import type { Recipe, RecipesResponse, SearchResponse } from "../types"

const API_BASE_URL = "https://dummyjson.com"

// Função para buscar todas as receitas
export const fetchRecipes = async (): Promise<RecipesResponse> => {
  try {
    const response = await axios.get<RecipesResponse>(`${API_BASE_URL}/recipes`)
    return response.data
  } catch (error) {
    console.error("Erro ao buscar receitas:", error)
    throw error
  }
}

// Função para buscar uma receita específica por ID
export const fetchRecipeById = async (id: string | number): Promise<Recipe> => {
  try {
    const response = await axios.get<Recipe>(`${API_BASE_URL}/recipes/${id}`)
    return response.data
  } catch (error) {
    console.error(`Erro ao buscar receita com ID ${id}:`, error)
    throw error
  }
}

// Função para buscar receitas por termo de pesquisa
export const searchRecipes = async (query: string): Promise<SearchResponse> => {
  try {
    const response = await axios.get<SearchResponse>(`${API_BASE_URL}/recipes/search?q=${query}`)
    return response.data
  } catch (error) {
    console.error(`Erro ao buscar receitas com termo "${query}":`, error)
    throw error
  }
}

// Função para buscar receitas por categoria
export const fetchRecipesByCategory = async (category: string): Promise<RecipesResponse> => {
  try {
    // A API DummyJSON não tem endpoint específico para categorias,
    // então vamos buscar todas e filtrar
    const response = await axios.get<RecipesResponse>(`${API_BASE_URL}/recipes`)
    const filteredRecipes = response.data.recipes.filter(
      (recipe) => recipe.cuisine.toLowerCase() === category.toLowerCase(),
    )

    return {
      ...response.data,
      recipes: filteredRecipes,
    }
  } catch (error) {
    console.error(`Erro ao buscar receitas da categoria ${category}:`, error)
    throw error
  }
}
