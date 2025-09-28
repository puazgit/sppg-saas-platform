// SPPG Production Module Types
// Domain: Food production, recipes, batches, quality control

export interface ProductionBatch {
  id: string
  recipeName: string
  recipeId: string
  plannedQuantity: number
  producedQuantity: number
  unit: string
  status: ProductionStatus
  priority: ProductionPriority
  startTime?: string
  endTime?: string
  estimatedDuration: number // minutes
  actualDuration?: number // minutes
  staffAssigned: StaffMember[]
  qualityScore?: number
  notes?: string
  createdAt: string
}

export interface Recipe {
  id: string
  name: string
  description: string
  category: RecipeCategory
  servingSize: number
  preparationTime: number // minutes
  cookingTime: number // minutes
  difficulty: RecipeDifficulty
  isActive: boolean
  ingredients: RecipeIngredient[]
  instructions: RecipeInstruction[]
  nutritionInfo: NutritionInfo
  createdAt: string
}

export interface RecipeIngredient {
  id: string
  ingredientName: string
  inventoryItemId: string
  quantity: number
  unit: string
  isOptional: boolean
  notes?: string
}

export interface RecipeInstruction {
  id: string
  stepNumber: number
  instruction: string
  estimatedTime?: number // minutes
  temperature?: number // celsius
  equipment?: string
}

export interface NutritionInfo {
  calories: number
  protein: number // grams
  carbs: number // grams  
  fat: number // grams
  fiber: number // grams
  sodium?: number // mg
  sugar?: number // grams
}

export interface StaffMember {
  id: string
  name: string
  role: StaffRole
  isAvailable: boolean
}

export interface ProductionStats {
  todayBatches: number
  completedBatches: number
  inProgressBatches: number
  plannedBatches: number
  totalServings: number
  averageQualityScore: number
  onTimeDeliveryRate: number
}

export interface QualityCheck {
  id: string
  batchId: string
  checkType: QualityCheckType
  score: number // 1-10
  notes?: string
  checkedBy: string
  checkedAt: string
}

// Enums
export type ProductionStatus = 
  | 'PLANNED'          // Direncanakan
  | 'PREPARING'        // Persiapan bahan
  | 'IN_PROGRESS'      // Sedang produksi
  | 'QUALITY_CHECK'    // Kontrol kualitas
  | 'COMPLETED'        // Selesai
  | 'DELAYED'          // Tertunda
  | 'CANCELLED'        // Dibatalkan

export type ProductionPriority = 
  | 'LOW'      // Rendah
  | 'MEDIUM'   // Normal
  | 'HIGH'     // Tinggi
  | 'URGENT'   // Mendesak

export type RecipeCategory = 
  | 'MAIN_COURSE'      // Makanan utama
  | 'SIDE_DISH'        // Lauk pauk
  | 'SOUP'             // Sup
  | 'VEGETABLE'        // Sayuran
  | 'DESSERT'          // Penutup
  | 'BEVERAGE'         // Minuman
  | 'SNACK'            // Camilan

export type RecipeDifficulty = 
  | 'EASY'     // Mudah
  | 'MEDIUM'   // Sedang
  | 'HARD'     // Sulit

export type StaffRole = 
  | 'HEAD_CHEF'        // Kepala koki
  | 'CHEF'             // Koki
  | 'ASSISTANT'        // Asisten
  | 'PREP_COOK'        // Persiapan

export type QualityCheckType = 
  | 'TASTE'            // Rasa
  | 'APPEARANCE'       // Tampilan
  | 'TEMPERATURE'      // Suhu
  | 'TEXTURE'          // Tekstur
  | 'PORTION'          // Porsi