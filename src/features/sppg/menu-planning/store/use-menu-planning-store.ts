import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { 
  Recipe, 
  MenuPlan, 
  MenuTemplate, 
  MenuPlanningStats,
  DailyMeal,
  MealItem 
} from '../types/menu-planning.types'

interface MenuPlanningState {
  // Data State
  recipes: Recipe[]
  menuPlans: MenuPlan[]
  menuTemplates: MenuTemplate[]
  stats: MenuPlanningStats | null
  
  // UI State
  isRecipesLoading: boolean
  isMenuPlansLoading: boolean
  isTemplatesLoading: boolean
  isStatsLoading: boolean
  
  // Filter & View State
  selectedRecipeId: string | null
  selectedMenuPlanId: string | null
  selectedTemplateId: string | null
  recipeFilter: string // category filter
  menuPlanFilter: string // status filter
  templateFilter: string // category filter
  searchQuery: string
  
  // Calendar & Planning State
  selectedDate: string // YYYY-MM-DD
  calendarView: 'week' | 'month'
  
  // Modal States
  isCreateRecipeModalOpen: boolean
  isCreateMenuPlanModalOpen: boolean
  isCreateTemplateModalOpen: boolean
  isAddMealModalOpen: boolean
  isRecipeDetailModalOpen: boolean
  isNutritionAnalysisModalOpen: boolean
}

interface MenuPlanningActions {
  // Recipe Actions
  setRecipes: (recipes: Recipe[]) => void
  setRecipesLoading: (loading: boolean) => void
  addRecipe: (recipe: Recipe) => void
  updateRecipe: (recipe: Recipe) => void
  removeRecipe: (recipeId: string) => void
  
  // Menu Plan Actions
  setMenuPlans: (menuPlans: MenuPlan[]) => void
  setMenuPlansLoading: (loading: boolean) => void
  addMenuPlan: (menuPlan: MenuPlan) => void
  updateMenuPlan: (menuPlan: MenuPlan) => void
  removeMenuPlan: (menuPlanId: string) => void
  
  // Daily Meal Actions
  addMealToMenuPlan: (menuPlanId: string, dailyMealId: string, mealItem: MealItem) => void
  removeMealFromMenuPlan: (menuPlanId: string, dailyMealId: string, mealType: string) => void
  updateMealInMenuPlan: (menuPlanId: string, dailyMealId: string, mealItem: MealItem) => void
  
  // Menu Template Actions
  setMenuTemplates: (templates: MenuTemplate[]) => void
  setTemplatesLoading: (loading: boolean) => void
  addMenuTemplate: (template: MenuTemplate) => void
  updateMenuTemplate: (template: MenuTemplate) => void
  removeMenuTemplate: (templateId: string) => void
  
  // Stats Actions
  setStats: (stats: MenuPlanningStats) => void
  setStatsLoading: (loading: boolean) => void
  
  // Selection Actions
  setSelectedRecipeId: (recipeId: string | null) => void
  setSelectedMenuPlanId: (menuPlanId: string | null) => void
  setSelectedTemplateId: (templateId: string | null) => void
  
  // Filter Actions
  setRecipeFilter: (filter: string) => void
  setMenuPlanFilter: (filter: string) => void
  setTemplateFilter: (filter: string) => void
  setSearchQuery: (query: string) => void
  
  // Calendar Actions
  setSelectedDate: (date: string) => void
  setCalendarView: (view: 'week' | 'month') => void
  
  // Modal Actions
  setCreateRecipeModalOpen: (open: boolean) => void
  setCreateMenuPlanModalOpen: (open: boolean) => void
  setCreateTemplateModalOpen: (open: boolean) => void
  setAddMealModalOpen: (open: boolean) => void
  setRecipeDetailModalOpen: (open: boolean) => void
  setNutritionAnalysisModalOpen: (open: boolean) => void
  
  // Utility Actions
  getRecipeById: (recipeId: string) => Recipe | undefined
  getMenuPlanById: (menuPlanId: string) => MenuPlan | undefined
  getTemplateById: (templateId: string) => MenuTemplate | undefined
  getActiveMenuPlans: () => MenuPlan[]
  getRecipesByCategory: (category: string) => Recipe[]
  
  // Reset Actions
  resetMenuPlanningState: () => void
}

const initialState: MenuPlanningState = {
  recipes: [],
  menuPlans: [],
  menuTemplates: [],
  stats: null,
  isRecipesLoading: false,
  isMenuPlansLoading: false,
  isTemplatesLoading: false,
  isStatsLoading: false,
  selectedRecipeId: null,
  selectedMenuPlanId: null,
  selectedTemplateId: null,
  recipeFilter: 'all',
  menuPlanFilter: 'all',
  templateFilter: 'all',
  searchQuery: '',
  selectedDate: new Date().toISOString().split('T')[0],
  calendarView: 'week',
  isCreateRecipeModalOpen: false,
  isCreateMenuPlanModalOpen: false,
  isCreateTemplateModalOpen: false,
  isAddMealModalOpen: false,
  isRecipeDetailModalOpen: false,
  isNutritionAnalysisModalOpen: false
}

export const useMenuPlanningStore = create<MenuPlanningState & MenuPlanningActions>()(
  devtools(
    (set, get) => ({
      ...initialState,
      
      // Recipe Actions
      setRecipes: (recipes) => set({ recipes }, false, 'setRecipes'),
      setRecipesLoading: (isRecipesLoading) => set({ isRecipesLoading }, false, 'setRecipesLoading'),
      addRecipe: (newRecipe) => set((state) => ({
        recipes: [newRecipe, ...state.recipes]
      }), false, 'addRecipe'),
      updateRecipe: (updatedRecipe) => set((state) => ({
        recipes: state.recipes.map(recipe => 
          recipe.id === updatedRecipe.id ? updatedRecipe : recipe
        )
      }), false, 'updateRecipe'),
      removeRecipe: (recipeId) => set((state) => ({
        recipes: state.recipes.filter(recipe => recipe.id !== recipeId)
      }), false, 'removeRecipe'),
      
      // Menu Plan Actions
      setMenuPlans: (menuPlans) => set({ menuPlans }, false, 'setMenuPlans'),
      setMenuPlansLoading: (isMenuPlansLoading) => set({ isMenuPlansLoading }, false, 'setMenuPlansLoading'),
      addMenuPlan: (newMenuPlan) => set((state) => ({
        menuPlans: [newMenuPlan, ...state.menuPlans]
      }), false, 'addMenuPlan'),
      updateMenuPlan: (updatedMenuPlan) => set((state) => ({
        menuPlans: state.menuPlans.map(plan => 
          plan.id === updatedMenuPlan.id ? updatedMenuPlan : plan
        )
      }), false, 'updateMenuPlan'),
      removeMenuPlan: (menuPlanId) => set((state) => ({
        menuPlans: state.menuPlans.filter(plan => plan.id !== menuPlanId)
      }), false, 'removeMenuPlan'),
      
      // Daily Meal Actions
      addMealToMenuPlan: (menuPlanId, dailyMealId, mealItem) => set((state) => ({
        menuPlans: state.menuPlans.map(plan => {
          if (plan.id !== menuPlanId) return plan
          
          return {
            ...plan,
            dailyMeals: plan.dailyMeals.map(dailyMeal => {
              if (dailyMeal.id !== dailyMealId) return dailyMeal
              
              const updatedMeal = {
                ...dailyMeal,
                [mealItem.mealType.toLowerCase()]: mealItem,
                totalCalories: dailyMeal.totalCalories + mealItem.nutritionInfo.calories,
                totalCost: dailyMeal.totalCost + mealItem.estimatedCost
              }
              
              return updatedMeal
            })
          }
        })
      }), false, 'addMealToMenuPlan'),
      
      removeMealFromMenuPlan: (menuPlanId, dailyMealId, mealType) => set((state) => ({
        menuPlans: state.menuPlans.map(plan => {
          if (plan.id !== menuPlanId) return plan
          
          return {
            ...plan,
            dailyMeals: plan.dailyMeals.map(dailyMeal => {
              if (dailyMeal.id !== dailyMealId) return dailyMeal
              
              const mealKey = mealType.toLowerCase() as keyof Pick<DailyMeal, 'breakfast' | 'lunch' | 'dinner' | 'snack'>
              const currentMeal = dailyMeal[mealKey]
              
              return {
                ...dailyMeal,
                [mealKey]: undefined,
                totalCalories: currentMeal ? dailyMeal.totalCalories - currentMeal.nutritionInfo.calories : dailyMeal.totalCalories,
                totalCost: currentMeal ? dailyMeal.totalCost - currentMeal.estimatedCost : dailyMeal.totalCost
              }
            })
          }
        })
      }), false, 'removeMealFromMenuPlan'),
      
      updateMealInMenuPlan: (menuPlanId, dailyMealId, mealItem) => set((state) => ({
        menuPlans: state.menuPlans.map(plan => {
          if (plan.id !== menuPlanId) return plan
          
          return {
            ...plan,
            dailyMeals: plan.dailyMeals.map(dailyMeal => {
              if (dailyMeal.id !== dailyMealId) return dailyMeal
              
              const mealKey = mealItem.mealType.toLowerCase() as keyof Pick<DailyMeal, 'breakfast' | 'lunch' | 'dinner' | 'snack'>
              const currentMeal = dailyMeal[mealKey]
              
              const calorieDiff = currentMeal ? 
                mealItem.nutritionInfo.calories - currentMeal.nutritionInfo.calories : 
                mealItem.nutritionInfo.calories
                
              const costDiff = currentMeal ? 
                mealItem.estimatedCost - currentMeal.estimatedCost : 
                mealItem.estimatedCost
              
              return {
                ...dailyMeal,
                [mealKey]: mealItem,
                totalCalories: dailyMeal.totalCalories + calorieDiff,
                totalCost: dailyMeal.totalCost + costDiff
              }
            })
          }
        })
      }), false, 'updateMealInMenuPlan'),
      
      // Menu Template Actions
      setMenuTemplates: (menuTemplates) => set({ menuTemplates }, false, 'setMenuTemplates'),
      setTemplatesLoading: (isTemplatesLoading) => set({ isTemplatesLoading }, false, 'setTemplatesLoading'),
      addMenuTemplate: (newTemplate) => set((state) => ({
        menuTemplates: [newTemplate, ...state.menuTemplates]
      }), false, 'addMenuTemplate'),
      updateMenuTemplate: (updatedTemplate) => set((state) => ({
        menuTemplates: state.menuTemplates.map(template => 
          template.id === updatedTemplate.id ? updatedTemplate : template
        )
      }), false, 'updateMenuTemplate'),
      removeMenuTemplate: (templateId) => set((state) => ({
        menuTemplates: state.menuTemplates.filter(template => template.id !== templateId)
      }), false, 'removeMenuTemplate'),
      
      // Stats Actions
      setStats: (stats) => set({ stats }, false, 'setStats'),
      setStatsLoading: (isStatsLoading) => set({ isStatsLoading }, false, 'setStatsLoading'),
      
      // Selection Actions
      setSelectedRecipeId: (selectedRecipeId) => set({ selectedRecipeId }, false, 'setSelectedRecipeId'),
      setSelectedMenuPlanId: (selectedMenuPlanId) => set({ selectedMenuPlanId }, false, 'setSelectedMenuPlanId'),
      setSelectedTemplateId: (selectedTemplateId) => set({ selectedTemplateId }, false, 'setSelectedTemplateId'),
      
      // Filter Actions
      setRecipeFilter: (recipeFilter) => set({ recipeFilter }, false, 'setRecipeFilter'),
      setMenuPlanFilter: (menuPlanFilter) => set({ menuPlanFilter }, false, 'setMenuPlanFilter'),
      setTemplateFilter: (templateFilter) => set({ templateFilter }, false, 'setTemplateFilter'),
      setSearchQuery: (searchQuery) => set({ searchQuery }, false, 'setSearchQuery'),
      
      // Calendar Actions
      setSelectedDate: (selectedDate) => set({ selectedDate }, false, 'setSelectedDate'),
      setCalendarView: (calendarView) => set({ calendarView }, false, 'setCalendarView'),
      
      // Modal Actions
      setCreateRecipeModalOpen: (isCreateRecipeModalOpen) => set({ isCreateRecipeModalOpen }, false, 'setCreateRecipeModalOpen'),
      setCreateMenuPlanModalOpen: (isCreateMenuPlanModalOpen) => set({ isCreateMenuPlanModalOpen }, false, 'setCreateMenuPlanModalOpen'),
      setCreateTemplateModalOpen: (isCreateTemplateModalOpen) => set({ isCreateTemplateModalOpen }, false, 'setCreateTemplateModalOpen'),
      setAddMealModalOpen: (isAddMealModalOpen) => set({ isAddMealModalOpen }, false, 'setAddMealModalOpen'),
      setRecipeDetailModalOpen: (isRecipeDetailModalOpen) => set({ isRecipeDetailModalOpen }, false, 'setRecipeDetailModalOpen'),
      setNutritionAnalysisModalOpen: (isNutritionAnalysisModalOpen) => set({ isNutritionAnalysisModalOpen }, false, 'setNutritionAnalysisModalOpen'),
      
      // Utility Actions
      getRecipeById: (recipeId) => {
        const { recipes } = get()
        return recipes.find(recipe => recipe.id === recipeId)
      },
      
      getMenuPlanById: (menuPlanId) => {
        const { menuPlans } = get()
        return menuPlans.find(plan => plan.id === menuPlanId)
      },
      
      getTemplateById: (templateId) => {
        const { menuTemplates } = get()
        return menuTemplates.find(template => template.id === templateId)
      },
      
      getActiveMenuPlans: () => {
        const { menuPlans } = get()
        return menuPlans.filter(plan => plan.status === 'ACTIVE')
      },
      
      getRecipesByCategory: (category) => {
        const { recipes } = get()
        if (category === 'all') return recipes
        return recipes.filter(recipe => recipe.category === category)
      },
      
      // Reset Actions
      resetMenuPlanningState: () => set(initialState, false, 'resetMenuPlanningState')
    }),
    {
      name: 'menu-planning-store',
      enabled: process.env.NODE_ENV === 'development'
    }
  )
)