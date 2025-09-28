import { z } from 'zod'

// Inventory Item Schema
export const inventoryItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.enum([
    'STAPLE_FOOD',
    'PROTEIN', 
    'VEGETABLES',
    'FRUITS',
    'DAIRY',
    'SPICES',
    'COOKING_OIL',
    'PACKAGING',
    'CLEANING',
    'OTHERS'
  ]),
  unit: z.string(),
  currentStock: z.number(),
  minimumStock: z.number(),
  maximumStock: z.number(),
  unitPrice: z.number(),
  totalValue: z.number(),
  expiryDate: z.string().optional(),
  supplier: z.string().optional(),
  storageLocation: z.string().optional(),
  lastUpdated: z.string(),
  status: z.enum(['IN_STOCK', 'LOW_STOCK', 'OUT_OF_STOCK', 'EXPIRING_SOON', 'EXPIRED'])
})

// Inventory Transaction Schema
export const inventoryTransactionSchema = z.object({
  id: z.string(),
  inventoryItemId: z.string(),
  inventoryItemName: z.string(),
  type: z.enum(['IN', 'OUT', 'ADJUSTMENT', 'WASTE']),
  quantity: z.number(),
  unit: z.string(),
  unitPrice: z.number().optional(),
  totalCost: z.number().optional(),
  reason: z.string(),
  notes: z.string().optional(),
  staffName: z.string().optional(),
  createdAt: z.string(),
  batchNumber: z.string().optional(),
  expiryDate: z.string().optional()
})

// Inventory Stats Schema
export const inventoryStatsSchema = z.object({
  totalItems: z.number(),
  totalValue: z.number(),
  lowStockItems: z.number(),
  expiringSoonItems: z.number(),
  recentTransactions: z.number(),
  monthlyConsumption: z.number()
})

// Stock Alert Schema
export const stockAlertSchema = z.object({
  id: z.string(),
  itemId: z.string(),
  itemName: z.string(),
  type: z.enum(['LOW_STOCK', 'EXPIRING_SOON', 'EXPIRED', 'OUT_OF_STOCK']),
  message: z.string(),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  currentStock: z.number().optional(),
  minimumStock: z.number().optional(),
  expiryDate: z.string().optional(),
  daysUntilExpiry: z.number().optional(),
  createdAt: z.string()
})

// Inventory Filters Schema
export const inventoryFiltersSchema = z.object({
  search: z.string(),
  category: z.enum([
    'STAPLE_FOOD',
    'PROTEIN', 
    'VEGETABLES',
    'FRUITS',
    'DAIRY',
    'SPICES',
    'COOKING_OIL',
    'PACKAGING',
    'CLEANING',
    'OTHERS'
  ]).optional(),
  status: z.enum(['IN_STOCK', 'LOW_STOCK', 'OUT_OF_STOCK', 'EXPIRING_SOON', 'EXPIRED']).optional(),
  sortBy: z.enum(['name', 'category', 'currentStock', 'expiryDate', 'unitPrice', 'lastUpdated']),
  sortOrder: z.enum(['asc', 'desc'])
})

// Form Schemas for Actions
export const addInventoryItemSchema = z.object({
  name: z.string().min(1, 'Nama item harus diisi'),
  category: z.enum([
    'STAPLE_FOOD',
    'PROTEIN', 
    'VEGETABLES',
    'FRUITS',
    'DAIRY',
    'SPICES',
    'COOKING_OIL',
    'PACKAGING',
    'CLEANING',
    'OTHERS'
  ]),
  unit: z.string().min(1, 'Satuan harus diisi'),
  minimumStock: z.number().min(0, 'Stok minimum harus >= 0'),
  maximumStock: z.number().min(1, 'Stok maksimum harus >= 1'),
  unitPrice: z.number().min(0, 'Harga satuan harus >= 0'),
  supplier: z.string().optional(),
  storageLocation: z.string().optional()
})

export const addStockSchema = z.object({
  inventoryItemId: z.string(),
  quantity: z.number().min(0.1, 'Jumlah harus > 0'),
  unitPrice: z.number().min(0, 'Harga satuan harus >= 0'),
  reason: z.string().min(1, 'Alasan harus diisi'),
  notes: z.string().optional(),
  batchNumber: z.string().optional(),
  expiryDate: z.string().optional()
})

export const useStockSchema = z.object({
  inventoryItemId: z.string(),
  quantity: z.number().min(0.1, 'Jumlah harus > 0'),
  reason: z.string().min(1, 'Alasan harus diisi'),
  notes: z.string().optional()
})

// Exported Types
export type InventoryItem = z.infer<typeof inventoryItemSchema>
export type InventoryTransaction = z.infer<typeof inventoryTransactionSchema>
export type InventoryStats = z.infer<typeof inventoryStatsSchema>
export type StockAlert = z.infer<typeof stockAlertSchema>
export type InventoryFilters = z.infer<typeof inventoryFiltersSchema>

export type AddInventoryItemForm = z.infer<typeof addInventoryItemSchema>
export type AddStockForm = z.infer<typeof addStockSchema>
export type UseStockForm = z.infer<typeof useStockSchema>