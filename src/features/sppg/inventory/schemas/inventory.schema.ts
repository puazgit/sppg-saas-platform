import { z } from 'zod'

// Inventory Item Schema
export const inventoryItemSchema = z.object({
  id: z.string(),
  code: z.string(),
  name: z.string(),
  category: z.string(),
  currentStock: z.number(),
  minStock: z.number(),
  maxStock: z.number(),
  unit: z.string(),
  price: z.number().optional(),
  supplier: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string()
})

// Inventory Transaction Schema
export const inventoryTransactionSchema = z.object({
  id: z.string(),
  itemId: z.string(),
  type: z.enum(['IN', 'OUT', 'ADJUSTMENT']),
  quantity: z.number(),
  unit: z.string(),
  reason: z.string().optional(),
  reference: z.string().optional(),
  createdAt: z.string()
})

// Inventory Stats Schema
export const inventoryStatsSchema = z.object({
  totalItems: z.number(),
  lowStockItems: z.number(),
  totalValue: z.number(),
  lastUpdated: z.string()
})

// Stock Alert Schema
export const stockAlertSchema = z.object({
  id: z.string(),
  itemId: z.string(),
  itemName: z.string(),
  currentStock: z.number(),
  minStock: z.number(),
  severity: z.enum(['LOW', 'CRITICAL']),
  createdAt: z.string()
})

// Form Schemas
export const addInventoryItemFormSchema = z.object({
  code: z.string().min(1, 'Kode item wajib diisi'),
  name: z.string().min(1, 'Nama item wajib diisi'),
  category: z.string().min(1, 'Kategori wajib dipilih'),
  minStock: z.number().min(1, 'Stock minimum harus lebih dari 0'),
  maxStock: z.number().min(1, 'Stock maksimum harus lebih dari 0'),
  unit: z.string().min(1, 'Unit wajib dipilih'),
  price: z.number().optional(),
  supplier: z.string().optional()
})

export const addStockFormSchema = z.object({
  itemId: z.string().min(1, 'Item wajib dipilih'),
  quantity: z.number().min(1, 'Jumlah harus lebih dari 0'),
  type: z.enum(['IN', 'OUT']),
  reason: z.string().optional(),
  reference: z.string().optional()
})

export const useStockFormSchema = z.object({
  itemId: z.string().min(1, 'Item wajib dipilih'),
  quantity: z.number().min(1, 'Jumlah harus lebih dari 0'),
  reason: z.string().min(1, 'Alasan penggunaan wajib diisi'),
  reference: z.string().optional()
})

// Types
export type InventoryItem = z.infer<typeof inventoryItemSchema>
export type InventoryTransaction = z.infer<typeof inventoryTransactionSchema>
export type InventoryStats = z.infer<typeof inventoryStatsSchema>
export type StockAlert = z.infer<typeof stockAlertSchema>
export type AddInventoryItemForm = z.infer<typeof addInventoryItemFormSchema>
export type AddStockForm = z.infer<typeof addStockFormSchema>
export type UseStockForm = z.infer<typeof useStockFormSchema>