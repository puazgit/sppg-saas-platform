// Menu Planning Domain Types

export interface Recipe {
  id: string
  name: string
  description?: string
  category: RecipeCategory
  servingSize: number
  preparationTime: number // minutes
  cookingTime: number // minutes
  difficulty: DifficultyLevel
  ingredients: RecipeIngredient[]
  instructions: string[]
  nutritionInfo: NutritionInfo
  allergens: Allergen[]
  isActive: boolean
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface RecipeIngredient {
  id: string
  ingredientId: string
  ingredientName: string
  quantity: number
  unit: MeasurementUnit
  notes?: string
  isOptional: boolean
  substitutes?: string[]
}

export interface MenuPlan {
  id: string
  name: string
  description?: string
  startDate: string
  endDate: string
  status: MenuPlanStatus
  targetBeneficiaries: number
  dailyMeals: DailyMeal[]
  totalCost: number
  nutritionSummary: NutritionSummary
  createdBy: string
  approvedBy?: string
  approvedAt?: string
  createdAt: string
  updatedAt: string
}

export interface DailyMeal {
  id: string
  date: string
  breakfast?: MealItem
  lunch?: MealItem
  dinner?: MealItem
  snack?: MealItem
  totalCalories: number
  totalCost: number
}

export interface MealItem {
  id: string
  recipeId: string
  recipeName: string
  servingSize: number
  portionCount: number
  mealType: MealType
  estimatedCost: number
  nutritionInfo: NutritionInfo
  specialInstructions?: string
}

export interface NutritionInfo {
  calories: number // per serving
  protein: number // grams
  carbohydrates: number // grams
  fat: number // grams
  fiber: number // grams
  sugar: number // grams
  sodium: number // milligrams
  vitamins: VitaminInfo[]
  minerals: MineralInfo[]
}

export interface VitaminInfo {
  type: VitaminType
  amount: number
  unit: string
  dailyValuePercent: number
}

export interface MineralInfo {
  type: MineralType
  amount: number
  unit: string
  dailyValuePercent: number
}

export interface NutritionSummary {
  averageCaloriesPerDay: number
  averageProteinPerDay: number
  averageCarbohydratesPerDay: number
  averageFatPerDay: number
  nutritionBalance: NutritionBalance
  varietyScore: number // 1-10
  costEfficiency: number // cost per calorie
}

export interface NutritionBalance {
  proteinPercent: number
  carbohydratePercent: number
  fatPercent: number
  isBalanced: boolean
  recommendations: string[]
}

export interface MenuTemplate {
  id: string
  name: string
  description?: string
  category: TemplateCategory
  duration: number // days
  targetAudience: BeneficiaryCategory[]
  recipes: string[] // recipe IDs
  nutritionGoals: NutritionGoals
  estimatedCostPerDay: number
  isPublic: boolean
  usageCount: number
  rating: number
  createdBy: string
  createdAt: string
}

export interface NutritionGoals {
  minCaloriesPerDay: number
  maxCaloriesPerDay: number
  minProteinPercent: number
  maxProteinPercent: number
  minCarbohydratePercent: number
  maxCarbohydratePercent: number
  minFatPercent: number
  maxFatPercent: number
  specialRequirements: SpecialRequirement[]
}

export interface SpecialRequirement {
  type: RequirementType
  description: string
  isRequired: boolean
}

export interface MenuPlanningStats {
  activeMenuPlans: number
  totalRecipes: number
  averageCostPerMeal: number
  nutritionComplianceRate: number // percentage
  beneficiarySatisfaction: number // 1-5 stars
  weeklyMenusCreated: number
  monthlyMenusCreated: number
  popularRecipes: PopularRecipe[]
}

export interface PopularRecipe {
  recipeId: string
  recipeName: string
  usageCount: number
  rating: number
  lastUsed: string
}

// Enums and Types

export type RecipeCategory = 
  | 'MAIN_DISH'      // Makanan utama
  | 'SIDE_DISH'      // Lauk pauk
  | 'SOUP'           // Sup
  | 'SALAD'          // Salad
  | 'DESSERT'        // Pencuci mulut
  | 'BEVERAGE'       // Minuman
  | 'SNACK'          // Camilan
  | 'BREAKFAST'      // Sarapan

export type DifficultyLevel = 
  | 'VERY_EASY'      // Sangat mudah
  | 'EASY'           // Mudah
  | 'MEDIUM'         // Sedang
  | 'HARD'           // Sulit
  | 'VERY_HARD'      // Sangat sulit

export type MeasurementUnit = 
  | 'GRAM'           // gram
  | 'KILOGRAM'       // kilogram
  | 'LITER'          // liter
  | 'MILLILITER'     // mililiter
  | 'CUP'            // cangkir
  | 'TABLESPOON'     // sendok makan
  | 'TEASPOON'       // sendok teh
  | 'PIECE'          // buah/potong
  | 'PACKAGE'        // kemasan

export type MenuPlanStatus = 
  | 'DRAFT'          // Draft
  | 'PENDING_REVIEW' // Menunggu review
  | 'APPROVED'       // Disetujui
  | 'ACTIVE'         // Aktif
  | 'COMPLETED'      // Selesai
  | 'CANCELLED'      // Dibatalkan

export type MealType = 
  | 'BREAKFAST'      // Sarapan
  | 'LUNCH'          // Makan siang
  | 'DINNER'         // Makan malam
  | 'SNACK'          // Camilan

export type Allergen = 
  | 'NUTS'           // Kacang-kacangan
  | 'DAIRY'          // Susu dan olahannya
  | 'EGGS'           // Telur
  | 'FISH'           // Ikan
  | 'SHELLFISH'      // Kerang-kerangan
  | 'SOY'            // Kedelai
  | 'WHEAT'          // Gandum
  | 'GLUTEN'         // Gluten

export type VitaminType = 
  | 'VITAMIN_A'      // Vitamin A
  | 'VITAMIN_B1'     // Vitamin B1
  | 'VITAMIN_B2'     // Vitamin B2
  | 'VITAMIN_B3'     // Vitamin B3
  | 'VITAMIN_B6'     // Vitamin B6
  | 'VITAMIN_B12'    // Vitamin B12
  | 'VITAMIN_C'      // Vitamin C
  | 'VITAMIN_D'      // Vitamin D
  | 'VITAMIN_E'      // Vitamin E
  | 'VITAMIN_K'      // Vitamin K
  | 'FOLATE'         // Asam folat

export type MineralType = 
  | 'CALCIUM'        // Kalsium
  | 'IRON'           // Zat besi
  | 'MAGNESIUM'      // Magnesium
  | 'PHOSPHORUS'     // Fosfor
  | 'POTASSIUM'      // Kalium
  | 'SODIUM'         // Natrium
  | 'ZINC'           // Seng

export type TemplateCategory = 
  | 'STANDARD'       // Standar
  | 'VEGETARIAN'     // Vegetarian
  | 'LOW_SODIUM'     // Rendah garam
  | 'LOW_SUGAR'      // Rendah gula
  | 'HIGH_PROTEIN'   // Tinggi protein
  | 'BALANCED'       // Seimbang
  | 'BUDGET_FRIENDLY'// Hemat

export type BeneficiaryCategory = 
  | 'STUDENT'          // Siswa
  | 'ELDERLY'          // Lansia
  | 'PREGNANT_MOTHER'  // Ibu hamil
  | 'TODDLER'          // Balita
  | 'DISABLED'         // Disabilitas
  | 'POOR_FAMILY'      // Keluarga kurang mampu
  | 'OTHERS'           // Lainnya

export type RequirementType = 
  | 'CALORIE_MINIMUM'    // Minimum kalori
  | 'PROTEIN_MINIMUM'    // Minimum protein
  | 'NO_ALLERGEN'        // Bebas alergen
  | 'HALAL'              // Halal
  | 'LOW_SODIUM'         // Rendah natrium
  | 'HIGH_FIBER'         // Tinggi serat
  | 'DIABETIC_FRIENDLY'  // Ramah diabetes

// Form Data Types
export type CreateRecipeData = Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>
export type UpdateRecipeData = Partial<Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>>
export type CreateMenuPlanData = Omit<MenuPlan, 'id' | 'createdAt' | 'updatedAt' | 'totalCost' | 'nutritionSummary'>
export type UpdateMenuPlanData = Partial<Omit<MenuPlan, 'id' | 'createdAt' | 'updatedAt'>>
export type CreateMenuTemplateData = Omit<MenuTemplate, 'id' | 'createdAt' | 'usageCount' | 'rating'>
export type UpdateMenuTemplateData = Partial<Omit<MenuTemplate, 'id' | 'createdAt'>>