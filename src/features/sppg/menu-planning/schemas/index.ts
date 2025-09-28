import { z } from 'zod'

// Recipe Schemas
export const recipeIngredientSchema = z.object({
  id: z.string(),
  ingredientId: z.string(),
  ingredientName: z.string(),
  quantity: z.number().positive(),
  unit: z.enum([
    'GRAM', 'KILOGRAM', 'LITER', 'MILLILITER', 'CUP', 
    'TABLESPOON', 'TEASPOON', 'PIECE', 'PACKAGE'
  ]),
  notes: z.string().optional(),
  isOptional: z.boolean().default(false),
  substitutes: z.array(z.string()).optional()
})

export const nutritionInfoSchema = z.object({
  calories: z.number().min(0),
  protein: z.number().min(0),
  carbohydrates: z.number().min(0),
  fat: z.number().min(0),
  fiber: z.number().min(0),
  sugar: z.number().min(0),
  sodium: z.number().min(0),
  vitamins: z.array(z.object({
    type: z.enum([
      'VITAMIN_A', 'VITAMIN_B1', 'VITAMIN_B2', 'VITAMIN_B3', 
      'VITAMIN_B6', 'VITAMIN_B12', 'VITAMIN_C', 'VITAMIN_D', 
      'VITAMIN_E', 'VITAMIN_K', 'FOLATE'
    ]),
    amount: z.number().min(0),
    unit: z.string(),
    dailyValuePercent: z.number().min(0).max(1000)
  })).default([]),
  minerals: z.array(z.object({
    type: z.enum(['CALCIUM', 'IRON', 'MAGNESIUM', 'PHOSPHORUS', 'POTASSIUM', 'SODIUM', 'ZINC']),
    amount: z.number().min(0),
    unit: z.string(),
    dailyValuePercent: z.number().min(0).max(1000)
  })).default([])
})

export const recipeSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Nama resep harus diisi'),
  description: z.string().optional(),
  category: z.enum([
    'MAIN_DISH', 'SIDE_DISH', 'SOUP', 'SALAD', 
    'DESSERT', 'BEVERAGE', 'SNACK', 'BREAKFAST'
  ]),
  servingSize: z.number().positive('Porsi harus lebih dari 0'),
  preparationTime: z.number().min(0, 'Waktu persiapan tidak boleh negatif'),
  cookingTime: z.number().min(0, 'Waktu memasak tidak boleh negatif'),
  difficulty: z.enum(['VERY_EASY', 'EASY', 'MEDIUM', 'HARD', 'VERY_HARD']),
  ingredients: z.array(recipeIngredientSchema).min(1, 'Minimal satu bahan diperlukan'),
  instructions: z.array(z.string().min(1)).min(1, 'Minimal satu langkah instruksi diperlukan'),
  nutritionInfo: nutritionInfoSchema,
  allergens: z.array(z.enum([
    'NUTS', 'DAIRY', 'EGGS', 'FISH', 'SHELLFISH', 'SOY', 'WHEAT', 'GLUTEN'
  ])).default([]),
  isActive: z.boolean().default(true),
  createdBy: z.string(),
  createdAt: z.string(),
  updatedAt: z.string()
})

// Menu Plan Schemas
export const mealItemSchema = z.object({
  id: z.string(),
  recipeId: z.string(),
  recipeName: z.string(),
  servingSize: z.number().positive(),
  portionCount: z.number().positive(),
  mealType: z.enum(['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK']),
  estimatedCost: z.number().min(0),
  nutritionInfo: nutritionInfoSchema,
  specialInstructions: z.string().optional()
})

export const dailyMealSchema = z.object({
  id: z.string(),
  date: z.string(),
  breakfast: mealItemSchema.optional(),
  lunch: mealItemSchema.optional(),
  dinner: mealItemSchema.optional(),
  snack: mealItemSchema.optional(),
  totalCalories: z.number().min(0),
  totalCost: z.number().min(0)
})

export const menuPlanSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Nama rencana menu harus diisi'),
  description: z.string().optional(),
  startDate: z.string(),
  endDate: z.string(),
  status: z.enum(['DRAFT', 'PENDING_REVIEW', 'APPROVED', 'ACTIVE', 'COMPLETED', 'CANCELLED']),
  targetBeneficiaries: z.number().positive('Target penerima harus lebih dari 0'),
  dailyMeals: z.array(dailyMealSchema),
  totalCost: z.number().min(0),
  nutritionSummary: z.object({
    averageCaloriesPerDay: z.number().min(0),
    averageProteinPerDay: z.number().min(0),
    averageCarbohydratesPerDay: z.number().min(0),
    averageFatPerDay: z.number().min(0),
    nutritionBalance: z.object({
      proteinPercent: z.number().min(0).max(100),
      carbohydratePercent: z.number().min(0).max(100),
      fatPercent: z.number().min(0).max(100),
      isBalanced: z.boolean(),
      recommendations: z.array(z.string()).default([])
    }),
    varietyScore: z.number().min(1).max(10),
    costEfficiency: z.number().min(0)
  }),
  createdBy: z.string(),
  approvedBy: z.string().optional(),
  approvedAt: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string()
})

// Menu Template Schemas
export const nutritionGoalsSchema = z.object({
  minCaloriesPerDay: z.number().min(0),
  maxCaloriesPerDay: z.number().min(0),
  minProteinPercent: z.number().min(0).max(100),
  maxProteinPercent: z.number().min(0).max(100),
  minCarbohydratePercent: z.number().min(0).max(100),
  maxCarbohydratePercent: z.number().min(0).max(100),
  minFatPercent: z.number().min(0).max(100),
  maxFatPercent: z.number().min(0).max(100),
  specialRequirements: z.array(z.object({
    type: z.enum([
      'CALORIE_MINIMUM', 'PROTEIN_MINIMUM', 'NO_ALLERGEN', 
      'HALAL', 'LOW_SODIUM', 'HIGH_FIBER', 'DIABETIC_FRIENDLY'
    ]),
    description: z.string(),
    isRequired: z.boolean().default(false)
  })).default([])
})

export const menuTemplateSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Nama template harus diisi'),
  description: z.string().optional(),
  category: z.enum([
    'STANDARD', 'VEGETARIAN', 'LOW_SODIUM', 'LOW_SUGAR', 
    'HIGH_PROTEIN', 'BALANCED', 'BUDGET_FRIENDLY'
  ]),
  duration: z.number().positive('Durasi harus lebih dari 0'),
  targetAudience: z.array(z.enum([
    'STUDENT', 'ELDERLY', 'PREGNANT_MOTHER', 'TODDLER', 
    'DISABLED', 'POOR_FAMILY', 'OTHERS'
  ])),
  recipes: z.array(z.string()).min(1, 'Minimal satu resep diperlukan'),
  nutritionGoals: nutritionGoalsSchema,
  estimatedCostPerDay: z.number().min(0),
  isPublic: z.boolean().default(false),
  usageCount: z.number().min(0).default(0),
  rating: z.number().min(1).max(5).default(5),
  createdBy: z.string(),
  createdAt: z.string()
})

// Form Schemas
export const createRecipeFormSchema = z.object({
  name: z.string().min(1, 'Nama resep harus diisi'),
  description: z.string().optional(),
  category: z.enum([
    'MAIN_DISH', 'SIDE_DISH', 'SOUP', 'SALAD', 
    'DESSERT', 'BEVERAGE', 'SNACK', 'BREAKFAST'
  ]),
  servingSize: z.number().positive('Porsi harus lebih dari 0'),
  preparationTime: z.number().min(0, 'Waktu persiapan tidak boleh negatif'),
  cookingTime: z.number().min(0, 'Waktu memasak tidak boleh negatif'),
  difficulty: z.enum(['VERY_EASY', 'EASY', 'MEDIUM', 'HARD', 'VERY_HARD']),
  ingredients: z.array(z.object({
    ingredientName: z.string().min(1, 'Nama bahan harus diisi'),
    quantity: z.number().positive('Jumlah harus lebih dari 0'),
    unit: z.enum([
      'GRAM', 'KILOGRAM', 'LITER', 'MILLILITER', 'CUP', 
      'TABLESPOON', 'TEASPOON', 'PIECE', 'PACKAGE'
    ]),
    notes: z.string().optional(),
    isOptional: z.boolean().default(false)
  })).min(1, 'Minimal satu bahan diperlukan'),
  instructions: z.array(z.string().min(1, 'Instruksi tidak boleh kosong')).min(1, 'Minimal satu langkah instruksi diperlukan'),
  nutritionInfo: z.object({
    calories: z.number().min(0, 'Kalori tidak boleh negatif'),
    protein: z.number().min(0, 'Protein tidak boleh negatif'),
    carbohydrates: z.number().min(0, 'Karbohidrat tidak boleh negatif'),
    fat: z.number().min(0, 'Lemak tidak boleh negatif'),
    fiber: z.number().min(0, 'Serat tidak boleh negatif'),
    sugar: z.number().min(0, 'Gula tidak boleh negatif'),
    sodium: z.number().min(0, 'Natrium tidak boleh negatif')
  }),
  allergens: z.array(z.enum([
    'NUTS', 'DAIRY', 'EGGS', 'FISH', 'SHELLFISH', 'SOY', 'WHEAT', 'GLUTEN'
  ])).default([])
})

export const createMenuPlanFormSchema = z.object({
  name: z.string().min(1, 'Nama rencana menu harus diisi'),
  description: z.string().optional(),
  startDate: z.string().min(1, 'Tanggal mulai harus diisi'),
  endDate: z.string().min(1, 'Tanggal selesai harus diisi'),
  targetBeneficiaries: z.number().positive('Target penerima harus lebih dari 0'),
  templateId: z.string().optional()
}).refine(
  (data) => new Date(data.endDate) > new Date(data.startDate),
  {
    message: "Tanggal selesai harus setelah tanggal mulai",
    path: ["endDate"]
  }
)

export const createMenuTemplateFormSchema = z.object({
  name: z.string().min(1, 'Nama template harus diisi'),
  description: z.string().optional(),
  category: z.enum([
    'STANDARD', 'VEGETARIAN', 'LOW_SODIUM', 'LOW_SUGAR', 
    'HIGH_PROTEIN', 'BALANCED', 'BUDGET_FRIENDLY'
  ]),
  duration: z.number().positive('Durasi harus lebih dari 0'),
  targetAudience: z.array(z.enum([
    'STUDENT', 'ELDERLY', 'PREGNANT_MOTHER', 'TODDLER', 
    'DISABLED', 'POOR_FAMILY', 'OTHERS'
  ])).min(1, 'Minimal satu target audiens harus dipilih'),
  recipes: z.array(z.string()).min(1, 'Minimal satu resep harus dipilih'),
  nutritionGoals: z.object({
    minCaloriesPerDay: z.number().min(0, 'Minimum kalori tidak boleh negatif'),
    maxCaloriesPerDay: z.number().min(0, 'Maksimum kalori tidak boleh negatif'),
    minProteinPercent: z.number().min(0).max(100, 'Persentase protein harus antara 0-100'),
    maxProteinPercent: z.number().min(0).max(100, 'Persentase protein harus antara 0-100')
  }).refine(
    (data) => data.maxCaloriesPerDay >= data.minCaloriesPerDay,
    {
      message: "Maksimum kalori harus lebih besar atau sama dengan minimum kalori",
      path: ["maxCaloriesPerDay"]
    }
  ).refine(
    (data) => data.maxProteinPercent >= data.minProteinPercent,
    {
      message: "Maksimum protein harus lebih besar atau sama dengan minimum protein",
      path: ["maxProteinPercent"]
    }
  ),
  isPublic: z.boolean().default(false)
})

export const addMealToMenuPlanFormSchema = z.object({
  menuPlanId: z.string().min(1, 'ID rencana menu harus diisi'),
  date: z.string().min(1, 'Tanggal harus diisi'),
  mealType: z.enum(['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK']),
  recipeId: z.string().min(1, 'Resep harus dipilih'),
  portionCount: z.number().positive('Jumlah porsi harus lebih dari 0'),
  specialInstructions: z.string().optional()
})