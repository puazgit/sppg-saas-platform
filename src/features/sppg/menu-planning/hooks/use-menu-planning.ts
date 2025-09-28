import React from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useMenuPlanningStore } from '../store'
import type { 
  MenuPlanningStats,
  Recipe,
  MenuPlan,
  MenuTemplate
} from '../types/menu-planning.types'

// Mock API functions - replace with real API calls
const menuPlanningAPI = {
  getStats: async (): Promise<MenuPlanningStats> => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    return {
      activeMenuPlans: 8,
      totalRecipes: 145,
      averageCostPerMeal: 12500,
      nutritionComplianceRate: 89.5,
      beneficiarySatisfaction: 4.3,
      weeklyMenusCreated: 12,
      monthlyMenusCreated: 48,
      popularRecipes: [
        {
          recipeId: '1',
          recipeName: 'Nasi Gudeg Yogya',
          usageCount: 45,
          rating: 4.8,
          lastUsed: '2024-03-25'
        },
        {
          recipeId: '2', 
          recipeName: 'Soto Ayam Lamongan',
          usageCount: 38,
          rating: 4.6,
          lastUsed: '2024-03-24'
        },
        {
          recipeId: '3',
          recipeName: 'Gado-gado Jakarta',
          usageCount: 32,
          rating: 4.5,
          lastUsed: '2024-03-23'
        }
      ]
    }
  },

  getRecipes: async (): Promise<Recipe[]> => {
    await new Promise(resolve => setTimeout(resolve, 800))
    return [
      {
        id: '1',
        name: 'Nasi Gudeg Yogya',
        description: 'Gudeg tradisional Yogyakarta dengan nangka muda',
        category: 'MAIN_DISH',
        servingSize: 1,
        preparationTime: 30,
        cookingTime: 120,
        difficulty: 'MEDIUM',
        ingredients: [
          {
            id: '1',
            ingredientId: 'ing1',
            ingredientName: 'Nangka muda',
            quantity: 500,
            unit: 'GRAM',
            isOptional: false
          },
          {
            id: '2',
            ingredientId: 'ing2', 
            ingredientName: 'Santan kelapa',
            quantity: 400,
            unit: 'MILLILITER',
            isOptional: false
          },
          {
            id: '3',
            ingredientId: 'ing3',
            ingredientName: 'Gula merah',
            quantity: 100,
            unit: 'GRAM',
            isOptional: false
          }
        ],
        instructions: [
          'Potong nangka muda sesuai selera',
          'Rebus nangka hingga empuk',
          'Masukkan santan dan gula merah',
          'Masak dengan api kecil hingga meresap'
        ],
        nutritionInfo: {
          calories: 285,
          protein: 8.5,
          carbohydrates: 42.0,
          fat: 12.0,
          fiber: 6.5,
          sugar: 18.0,
          sodium: 350,
          vitamins: [
            {
              type: 'VITAMIN_C',
              amount: 15,
              unit: 'mg',
              dailyValuePercent: 25
            }
          ],
          minerals: [
            {
              type: 'POTASSIUM',
              amount: 280,
              unit: 'mg',
              dailyValuePercent: 8
            }
          ]
        },
        allergens: [],
        isActive: true,
        createdBy: 'user1',
        createdAt: '2024-01-15T00:00:00.000Z',
        updatedAt: '2024-03-20T00:00:00.000Z'
      },
      {
        id: '2',
        name: 'Soto Ayam Lamongan',
        description: 'Soto ayam khas Lamongan dengan kuah bening',
        category: 'SOUP',
        servingSize: 1,
        preparationTime: 20,
        cookingTime: 60,
        difficulty: 'EASY',
        ingredients: [
          {
            id: '4',
            ingredientId: 'ing4',
            ingredientName: 'Daging ayam',
            quantity: 250,
            unit: 'GRAM',
            isOptional: false
          },
          {
            id: '5',
            ingredientId: 'ing5',
            ingredientName: 'Mie telur',
            quantity: 100,
            unit: 'GRAM', 
            isOptional: false
          },
          {
            id: '6',
            ingredientId: 'ing6',
            ingredientName: 'Taoge',
            quantity: 50,
            unit: 'GRAM',
            isOptional: true
          }
        ],
        instructions: [
          'Rebus ayam hingga empuk',
          'Suwir-suwir daging ayam',
          'Siapkan mie dan taoge',
          'Sajikan dengan kuah kaldu ayam panas'
        ],
        nutritionInfo: {
          calories: 320,
          protein: 28.0,
          carbohydrates: 25.0,
          fat: 12.5,
          fiber: 3.2,
          sugar: 4.0,
          sodium: 890,
          vitamins: [
            {
              type: 'VITAMIN_B6',
              amount: 0.8,
              unit: 'mg', 
              dailyValuePercent: 40
            }
          ],
          minerals: [
            {
              type: 'IRON',
              amount: 2.4,
              unit: 'mg',
              dailyValuePercent: 13
            }
          ]
        },
        allergens: ['WHEAT', 'EGGS'],
        isActive: true,
        createdBy: 'user1',
        createdAt: '2024-01-20T00:00:00.000Z',
        updatedAt: '2024-03-18T00:00:00.000Z'
      }
    ]
  },

  getMenuPlans: async (): Promise<MenuPlan[]> => {
    await new Promise(resolve => setTimeout(resolve, 600))
    return [
      {
        id: '1',
        name: 'Menu Minggu Pertama Maret',
        description: 'Menu seimbang untuk minggu pertama bulan Maret',
        startDate: '2024-03-01',
        endDate: '2024-03-07',
        status: 'ACTIVE',
        targetBeneficiaries: 150,
        dailyMeals: [
          {
            id: 'day1',
            date: '2024-03-01',
            breakfast: {
              id: 'b1',
              recipeId: '1',
              recipeName: 'Bubur Ayam',
              servingSize: 1,
              portionCount: 150,
              mealType: 'BREAKFAST',
              estimatedCost: 8000,
              nutritionInfo: {
                calories: 250,
                protein: 12,
                carbohydrates: 35,
                fat: 8,
                fiber: 2,
                sugar: 5,
                sodium: 600,
                vitamins: [],
                minerals: []
              }
            },
            lunch: {
              id: 'l1',
              recipeId: '1', 
              recipeName: 'Nasi Gudeg Yogya',
              servingSize: 1,
              portionCount: 150,
              mealType: 'LUNCH',
              estimatedCost: 12000,
              nutritionInfo: {
                calories: 285,
                protein: 8.5,
                carbohydrates: 42,
                fat: 12,
                fiber: 6.5,
                sugar: 18,
                sodium: 350,
                vitamins: [],
                minerals: []
              }
            },
            totalCalories: 535,
            totalCost: 20000
          }
        ],
        totalCost: 140000,
        nutritionSummary: {
          averageCaloriesPerDay: 1850,
          averageProteinPerDay: 68,
          averageCarbohydratesPerDay: 240,
          averageFatPerDay: 62,
          nutritionBalance: {
            proteinPercent: 15,
            carbohydratePercent: 52,
            fatPercent: 30,
            isBalanced: true,
            recommendations: []
          },
          varietyScore: 8,
          costEfficiency: 0.076
        },
        createdBy: 'user1',
        approvedBy: 'supervisor1',
        approvedAt: '2024-02-28T10:00:00.000Z',
        createdAt: '2024-02-25T00:00:00.000Z',
        updatedAt: '2024-02-28T10:00:00.000Z'
      }
    ]
  },

  getMenuTemplates: async (): Promise<MenuTemplate[]> => {
    await new Promise(resolve => setTimeout(resolve, 700))
    return [
      {
        id: '1',
        name: 'Template Seimbang Standar',
        description: 'Template menu seimbang untuk konsumsi harian',
        category: 'BALANCED',
        duration: 7,
        targetAudience: ['STUDENT', 'POOR_FAMILY'],
        recipes: ['1', '2'],
        nutritionGoals: {
          minCaloriesPerDay: 1800,
          maxCaloriesPerDay: 2200,
          minProteinPercent: 12,
          maxProteinPercent: 18,
          minCarbohydratePercent: 45,
          maxCarbohydratePercent: 65,
          minFatPercent: 20,
          maxFatPercent: 35,
          specialRequirements: [
            {
              type: 'HALAL',
              description: 'Semua makanan harus halal',
              isRequired: true
            }
          ]
        },
        estimatedCostPerDay: 25000,
        isPublic: true,
        usageCount: 23,
        rating: 4.5,
        createdBy: 'user1',
        createdAt: '2024-01-10T00:00:00.000Z'
      }
    ]
  }
}

// Menu Planning Stats Hook
export function useMenuPlanningStats(sppgId: string) {
  const query = useQuery({
    queryKey: ['menu-planning-stats', sppgId],
    queryFn: () => menuPlanningAPI.getStats(),
    enabled: !!sppgId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 30000, // 30 seconds
  })

  const { setStats, setStatsLoading } = useMenuPlanningStore()
  
  React.useEffect(() => {
    if (query.data) {
      setStats(query.data)
    }
    setStatsLoading(query.isLoading)
  }, [query.data, query.isLoading, setStats, setStatsLoading])

  return query
}

// Recipes Hook
export function useRecipes(sppgId: string) {
  const query = useQuery({
    queryKey: ['recipes', sppgId],
    queryFn: () => menuPlanningAPI.getRecipes(),
    enabled: !!sppgId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
  
  const { setRecipes, setRecipesLoading } = useMenuPlanningStore()
  
  React.useEffect(() => {
    if (query.data) {
      setRecipes(query.data)
    }
    setRecipesLoading(query.isLoading)
  }, [query.data, query.isLoading, setRecipes, setRecipesLoading])
  
  return query
}

// Menu Plans Hook
export function useMenuPlans(sppgId: string) {
  const query = useQuery({
    queryKey: ['menu-plans', sppgId],
    queryFn: () => menuPlanningAPI.getMenuPlans(),
    enabled: !!sppgId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
  
  const { setMenuPlans, setMenuPlansLoading } = useMenuPlanningStore()
  
  React.useEffect(() => {
    if (query.data) {
      setMenuPlans(query.data)
    }
    setMenuPlansLoading(query.isLoading)
  }, [query.data, query.isLoading, setMenuPlans, setMenuPlansLoading])
  
  return query
}

// Menu Templates Hook
export function useMenuTemplates(sppgId: string) {
  const query = useQuery({
    queryKey: ['menu-templates', sppgId],
    queryFn: () => menuPlanningAPI.getMenuTemplates(),
    enabled: !!sppgId,
    staleTime: 15 * 60 * 1000, // 15 minutes
  })
  
  const { setMenuTemplates, setTemplatesLoading } = useMenuPlanningStore()
  
  React.useEffect(() => {
    if (query.data) {
      setMenuTemplates(query.data)
    }
    setTemplatesLoading(query.isLoading)
  }, [query.data, query.isLoading, setMenuTemplates, setTemplatesLoading])
  
  return query
}

// Mutation hooks for future implementation
export function useCreateRecipe() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async () => {
      throw new Error('Not implemented yet')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] })
      queryClient.invalidateQueries({ queryKey: ['menu-planning-stats'] })
    }
  })
}

export function useCreateMenuPlan() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async () => {
      throw new Error('Not implemented yet')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu-plans'] })
      queryClient.invalidateQueries({ queryKey: ['menu-planning-stats'] })
    }
  })
}

export function useCreateMenuTemplate() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async () => {
      throw new Error('Not implemented yet')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu-templates'] })
    }
  })
}