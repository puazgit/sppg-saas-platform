import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { 
  InventoryItem, 
  InventoryTransaction, 
  InventoryStats, 
  StockAlert 
} from '../schemas/inventory.schema'

interface InventoryState {
  // Data State
  items: InventoryItem[]
  transactions: InventoryTransaction[]
  stats: InventoryStats | null
  alerts: StockAlert[]
  
  // UI State
  selectedItem: InventoryItem | null
  isLoading: boolean
  isAddingItem: boolean
  isAddingStock: boolean
  
  // Filters
  categoryFilter: string | null
  searchQuery: string
  
  // Actions
  setItems: (items: InventoryItem[]) => void
  setTransactions: (transactions: InventoryTransaction[]) => void
  setStats: (stats: InventoryStats) => void
  setAlerts: (alerts: StockAlert[]) => void
  setSelectedItem: (item: InventoryItem | null) => void
  setLoading: (loading: boolean) => void
  setAddingItem: (adding: boolean) => void
  setAddingStock: (adding: boolean) => void
  setCategoryFilter: (category: string | null) => void
  setSearchQuery: (query: string) => void
  
  // Computed
  filteredItems: () => InventoryItem[]
  lowStockItems: () => InventoryItem[]
}

export const useInventoryStore = create<InventoryState>()(
  devtools(
    (set, get) => ({
      // Initial State
      items: [],
      transactions: [],
      stats: null,
      alerts: [],
      selectedItem: null,
      isLoading: false,
      isAddingItem: false,
      isAddingStock: false,
      categoryFilter: null,
      searchQuery: '',
      
      // Actions
      setItems: (items) => set({ items }, false, 'setItems'),
      setTransactions: (transactions) => set({ transactions }, false, 'setTransactions'),
      setStats: (stats) => set({ stats }, false, 'setStats'),
      setAlerts: (alerts) => set({ alerts }, false, 'setAlerts'),
      setSelectedItem: (item) => set({ selectedItem: item }, false, 'setSelectedItem'),
      setLoading: (loading) => set({ isLoading: loading }, false, 'setLoading'),
      setAddingItem: (adding) => set({ isAddingItem: adding }, false, 'setAddingItem'),
      setAddingStock: (adding) => set({ isAddingStock: adding }, false, 'setAddingStock'),
      setCategoryFilter: (category) => set({ categoryFilter: category }, false, 'setCategoryFilter'),
      setSearchQuery: (query) => set({ searchQuery: query }, false, 'setSearchQuery'),
      
      // Computed
      filteredItems: () => {
        const { items, categoryFilter, searchQuery } = get()
        return items.filter(item => {
          const matchesCategory = !categoryFilter || item.category === categoryFilter
          const matchesSearch = !searchQuery || 
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.code.toLowerCase().includes(searchQuery.toLowerCase())
          return matchesCategory && matchesSearch
        })
      },
      
      lowStockItems: () => {
        const { items } = get()
        return items.filter(item => item.currentStock <= item.minStock)
      }
    }),
    {
      name: 'sppg-inventory-store',
      partialize: (state: InventoryState) => ({ 
        categoryFilter: state.categoryFilter,
        searchQuery: state.searchQuery
      })
    }
  )
)