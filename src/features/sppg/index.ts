// SPPG Features Exports
// Following DEVELOPMENT_AGREEMENT.md - Modular Architecture per User Type

// Layout Module
export * from './layout'

// Dashboard Module
export * from './dashboard'

// Inventory Module
export * from './inventory'

// Production Module
export * from './production'

// Distribution Module
export * from './distribution'

// Menu Planning Module (with aliases to avoid conflicts)
export {
  MenuPlanningStatsComponent as MenuPlanningStats,
  MenuPlanningOverview,
  useMenuPlanningStore,
  useMenuPlanning,
  useMenuPlanningStats,
  useRecipes,
  useMenuPlans,
  useMenuTemplates,
  recipeSchema as MenuRecipeSchema,
  menuPlanSchema,
  menuTemplateSchema,
  createRecipeFormSchema as CreateMenuRecipeFormSchema,
  createMenuPlanFormSchema,
  createMenuTemplateFormSchema,
  addMealToMenuPlanFormSchema
} from './menu-planning'

export type {
  Recipe as MenuRecipe,
  MenuPlan,
  MenuTemplate,
  MenuPlanningStats as MenuPlanningStatsType,
  DailyMeal,
  MealItem,
  NutritionInfo as MenuNutritionInfo,
  RecipeIngredient as MenuRecipeIngredient,
  CreateRecipeData as CreateMenuRecipeData,
  UpdateRecipeData as UpdateMenuRecipeData,
  CreateMenuPlanData,
  UpdateMenuPlanData,
  CreateMenuTemplateData,
  UpdateMenuTemplateData
} from './menu-planning'