// SPPG Inventory Module Types
// Domain: Inventory management, stock tracking, procurement

export interface InventoryItem {
  id: string
  name: string
  category: InventoryCategory
  unit: string
  currentStock: number
  minimumStock: number
  maximumStock: number
  unitPrice: number
  totalValue: number
  expiryDate?: string
  supplier?: string
  storageLocation?: string
  lastUpdated: string
  status: InventoryStatus
}

export interface InventoryTransaction {
  id: string
  inventoryItemId: string
  inventoryItemName: string
  type: TransactionType
  quantity: number
  unit: string
  unitPrice?: number
  totalCost?: number
  reason: string
  notes?: string
  staffName?: string
  createdAt: string
  batchNumber?: string
  expiryDate?: string
}

export interface InventoryStats {
  totalItems: number
  totalValue: number
  lowStockItems: number
  expiringSoonItems: number
  recentTransactions: number
  monthlyConsumption: number
}

export interface StockAlert {
  id: string
  itemId: string
  itemName: string
  type: AlertType
  message: string
  severity: AlertSeverity
  currentStock?: number
  minimumStock?: number
  expiryDate?: string
  daysUntilExpiry?: number
  createdAt: string
}

export interface InventoryFilters {
  search: string
  category?: InventoryCategory
  status?: InventoryStatus
  sortBy: InventorySortBy
  sortOrder: 'asc' | 'desc'
}

// Enums
export type InventoryCategory = 
  | 'STAPLE_FOOD'      // Bahan pokok
  | 'PROTEIN'          // Protein
  | 'VEGETABLES'       // Sayuran  
  | 'FRUITS'           // Buah-buahan
  | 'DAIRY'            // Susu & produk turunan
  | 'SPICES'           // Bumbu & rempah
  | 'COOKING_OIL'      // Minyak goreng
  | 'PACKAGING'        // Kemasan
  | 'CLEANING'         // Pembersih
  | 'OTHERS'           // Lain-lain

export type InventoryStatus = 
  | 'IN_STOCK'         // Tersedia
  | 'LOW_STOCK'        // Stok menipis
  | 'OUT_OF_STOCK'     // Habis
  | 'EXPIRING_SOON'    // Akan kedaluwarsa
  | 'EXPIRED'          // Kedaluwarsa

export type TransactionType = 
  | 'IN'               // Masuk (pembelian/donasi)
  | 'OUT'              // Keluar (untuk produksi)
  | 'ADJUSTMENT'       // Penyesuaian stok
  | 'WASTE'            // Pembuangan

export type AlertType = 
  | 'LOW_STOCK'
  | 'EXPIRING_SOON'
  | 'EXPIRED'
  | 'OUT_OF_STOCK'

export type AlertSeverity = 
  | 'LOW'
  | 'MEDIUM'  
  | 'HIGH'
  | 'CRITICAL'

export type InventorySortBy = 
  | 'name'
  | 'category'
  | 'currentStock'
  | 'expiryDate'
  | 'unitPrice'
  | 'lastUpdated'