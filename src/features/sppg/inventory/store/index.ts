import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { 
  InventoryItem, 
  InventoryTransaction, 
  InventoryStats, 
  StockAlert,
  InventoryFilters 
} from '../types'

interface InventoryState {
  // Data State
  items: InventoryItem[]
  transactions: InventoryTransaction[]
  stats: InventoryStats | null
  alerts: StockAlert[]
  
  // UI State
  isItemsLoading: boolean
  isTransactionsLoading: boolean
  isStatsLoading: boolean
  isAlertsLoading: boolean
  
  // Filter & View State
  filters: InventoryFilters
  selectedItemId: string | null
  viewMode: 'grid' | 'list'
  
  // Modal States
  isAddItemModalOpen: boolean
  isAddStockModalOpen: boolean
  isUseStockModalOpen: boolean
}

interface InventoryActions {
  // Items Actions
  setItems: (items: InventoryItem[]) => void
  setItemsLoading: (loading: boolean) => void
  updateItem: (item: InventoryItem) => void
  addItem: (item: InventoryItem) => void
  removeItem: (itemId: string) => void
  
  // Transactions Actions
  setTransactions: (transactions: InventoryTransaction[]) => void
  setTransactionsLoading: (loading: boolean) => void
  addTransaction: (transaction: InventoryTransaction) => void
  
  // Stats Actions
  setStats: (stats: InventoryStats) => void
  setStatsLoading: (loading: boolean) => void
  
  // Alerts Actions
  setAlerts: (alerts: StockAlert[]) => void
  setAlertsLoading: (loading: boolean) => void
  dismissAlert: (alertId: string) => void
  
  // Filter Actions
  setFilters: (filters: Partial<InventoryFilters>) => void
  resetFilters: () => void
  
  // UI Actions
  setSelectedItemId: (itemId: string | null) => void
  setViewMode: (mode: 'grid' | 'list') => void
  
  // Modal Actions
  setAddItemModalOpen: (open: boolean) => void
  setAddStockModalOpen: (open: boolean) => void
  setUseStockModalOpen: (open: boolean) => void
  
  // Reset Actions
  resetInventoryState: () => void
}

const initialState: InventoryState = {
  items: [],
  transactions: [],
  stats: null,
  alerts: [],
  isItemsLoading: false,
  isTransactionsLoading: false,
  isStatsLoading: false,
  isAlertsLoading: false,
  filters: {
    search: '',
    sortBy: 'name',
    sortOrder: 'asc'
  },
  selectedItemId: null,
  viewMode: 'grid',
  isAddItemModalOpen: false,
  isAddStockModalOpen: false,
  isUseStockModalOpen: false
}

export const useInventoryStore = create<InventoryState & InventoryActions>()(
  devtools(
    (set, get) => ({
      ...initialState,
      
      // Items Actions
      setItems: (items) => set({ items }, false, 'setItems'),
      setItemsLoading: (isItemsLoading) => set({ isItemsLoading }, false, 'setItemsLoading'),
      updateItem: (updatedItem) => set((state) => ({
        items: state.items.map(item => 
          item.id === updatedItem.id ? updatedItem : item
        )
      }), false, 'updateItem'),
      addItem: (newItem) => set((state) => ({
        items: [newItem, ...state.items]
      }), false, 'addItem'),
      removeItem: (itemId) => set((state) => ({
        items: state.items.filter(item => item.id !== itemId)
      }), false, 'removeItem'),
      
      // Transactions Actions
      setTransactions: (transactions) => set({ transactions }, false, 'setTransactions'),
      setTransactionsLoading: (isTransactionsLoading) => set({ isTransactionsLoading }, false, 'setTransactionsLoading'),
      addTransaction: (newTransaction) => set((state) => ({
        transactions: [newTransaction, ...state.transactions].slice(0, 50) // Keep only 50 recent
      }), false, 'addTransaction'),
      
      // Stats Actions
      setStats: (stats) => set({ stats }, false, 'setStats'),
      setStatsLoading: (isStatsLoading) => set({ isStatsLoading }, false, 'setStatsLoading'),
      
      // Alerts Actions
      setAlerts: (alerts) => set({ alerts }, false, 'setAlerts'),
      setAlertsLoading: (isAlertsLoading) => set({ isAlertsLoading }, false, 'setAlertsLoading'),
      dismissAlert: (alertId) => set((state) => ({
        alerts: state.alerts.filter(alert => alert.id !== alertId)
      }), false, 'dismissAlert'),
      
      // Filter Actions
      setFilters: (newFilters) => set((state) => ({
        filters: { ...state.filters, ...newFilters }
      }), false, 'setFilters'),
      resetFilters: () => set({
        filters: {
          search: '',
          sortBy: 'name',
          sortOrder: 'asc'
        }
      }, false, 'resetFilters'),
      
      // UI Actions
      setSelectedItemId: (selectedItemId) => set({ selectedItemId }, false, 'setSelectedItemId'),
      setViewMode: (viewMode) => set({ viewMode }, false, 'setViewMode'),
      
      // Modal Actions
      setAddItemModalOpen: (isAddItemModalOpen) => set({ isAddItemModalOpen }, false, 'setAddItemModalOpen'),
      setAddStockModalOpen: (isAddStockModalOpen) => set({ isAddStockModalOpen }, false, 'setAddStockModalOpen'),
      setUseStockModalOpen: (isUseStockModalOpen) => set({ isUseStockModalOpen }, false, 'setUseStockModalOpen'),
      
      // Reset Actions
      resetInventoryState: () => set(initialState, false, 'resetInventoryState')
    }),
    {
      name: 'inventory-store',
      enabled: process.env.NODE_ENV === 'development'
    }
  )
)