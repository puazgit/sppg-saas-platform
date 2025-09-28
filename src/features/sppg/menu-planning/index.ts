// Menu Planning feature barrel exports
export { MenuPlanningStats as MenuPlanningStatsComponent, MenuPlanningOverview } from './components'
export * from './hooks'
export * from './store'

// Export types explicitly to avoid conflicts  
export type {
  Recipe,
  MenuPlan,
  MenuTemplate,
  MenuPlanningStats as MenuPlanningStatsType,
  DailyMeal,
  MealItem,
  NutritionInfo,
  RecipeIngredient,
  CreateRecipeData,
  UpdateRecipeData,
  CreateMenuPlanData,
  UpdateMenuPlanData,
  CreateMenuTemplateData,
  UpdateMenuTemplateData
} from './types'

export {
  recipeSchema,
  menuPlanSchema,
  menuTemplateSchema,
  createRecipeFormSchema,
  createMenuPlanFormSchema,
  createMenuTemplateFormSchema,
  addMealToMenuPlanFormSchema
} from './schemas'