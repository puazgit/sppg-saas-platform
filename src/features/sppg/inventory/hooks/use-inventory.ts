import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/features/auth'
import { useInventoryStore } from '../store/inventory.store'
import { 
  inventoryItemSchema, 
  inventoryTransactionSchema, 
  inventoryStatsSchema,
  stockAlertSchema,
  type InventoryItem,
  type InventoryTransaction,
  type InventoryStats,
  type StockAlert,
  type AddInventoryItemForm,
  type AddStockForm,
  type UseStockForm
} from '../schemas/inventory.schema'

// Inventory Items Hook
export function useInventoryItems() {
  const { user } = useAuth()
  const { setItems, setItemsLoading, filters } = useInventoryStore()

  return useQuery({
    queryKey: ['sppg', 'inventory', 'items', user?.sppgId, filters],
    queryFn: async (): Promise<InventoryItem[]> => {
      const searchParams = new URLSearchParams()
      if (filters.search) searchParams.set('search', filters.search)
      if (filters.category) searchParams.set('category', filters.category)
      if (filters.status) searchParams.set('status', filters.status)
      searchParams.set('sortBy', filters.sortBy)
      searchParams.set('sortOrder', filters.sortOrder)
      
      const response = await fetch(`/api/sppg/inventory/items?${searchParams}`)
      if (!response.ok) throw new Error('Failed to fetch inventory items')
      
      const data = await response.json()
      const validatedData = data.map((item: unknown) => inventoryItemSchema.parse(item))
      
      setItems(validatedData)
      return validatedData
    },
    enabled: !!user?.sppgId && user?.userType === 'SPPG',
    refetchInterval: 300000, // 5 minutes
    refetchOnWindowFocus: false
  })
}

// Inventory Stats Hook
export function useInventoryStats() {
  const { user } = useAuth()
  const { setStats, setStatsLoading } = useInventoryStore()

  return useQuery({
    queryKey: ['sppg', 'inventory', 'stats', user?.sppgId],
    queryFn: async (): Promise<InventoryStats> => {
      const response = await fetch('/api/sppg/inventory/stats')
      if (!response.ok) throw new Error('Failed to fetch inventory stats')
      
      const data = await response.json()
      const validatedData = inventoryStatsSchema.parse(data)
      
      setStats(validatedData)
      return validatedData
    },
    enabled: !!user?.sppgId && user?.userType === 'SPPG',
    refetchInterval: 300000, // 5 minutes
    refetchOnWindowFocus: false
  })
}

// Recent Transactions Hook
export function useRecentTransactions() {
  const { user } = useAuth()
  const { setTransactions, setTransactionsLoading } = useInventoryStore()

  return useQuery({
    queryKey: ['sppg', 'inventory', 'transactions', user?.sppgId],
    queryFn: async (): Promise<InventoryTransaction[]> => {
      const response = await fetch('/api/sppg/inventory/transactions?limit=50')
      if (!response.ok) throw new Error('Failed to fetch transactions')
      
      const data = await response.json()
      const validatedData = data.map((transaction: unknown) => 
        inventoryTransactionSchema.parse(transaction)
      )
      
      setTransactions(validatedData)
      return validatedData
    },
    enabled: !!user?.sppgId && user?.userType === 'SPPG',
    refetchInterval: 60000, // 1 minute for transactions
    refetchOnWindowFocus: false
  })
}

// Stock Alerts Hook
export function useStockAlerts() {
  const { user } = useAuth()
  const { setAlerts, setAlertsLoading } = useInventoryStore()

  return useQuery({
    queryKey: ['sppg', 'inventory', 'alerts', user?.sppgId],
    queryFn: async (): Promise<StockAlert[]> => {
      const response = await fetch('/api/sppg/inventory/alerts')
      if (!response.ok) throw new Error('Failed to fetch stock alerts')
      
      const data = await response.json()
      const validatedData = data.map((alert: unknown) => stockAlertSchema.parse(alert))
      
      setAlerts(validatedData)
      return validatedData
    },
    enabled: !!user?.sppgId && user?.userType === 'SPPG',
    refetchInterval: 60000, // 1 minute for alerts
    refetchOnWindowFocus: false
  })
}

// Add New Item Mutation
export function useAddInventoryItem() {
  const queryClient = useQueryClient()
  const { addItem } = useInventoryStore()
  const { user } = useAuth()

  return useMutation({
    mutationFn: async (formData: AddInventoryItemForm): Promise<InventoryItem> => {
      const response = await fetch('/api/sppg/inventory/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (!response.ok) throw new Error('Failed to add inventory item')
      
      const data = await response.json()
      return inventoryItemSchema.parse(data)
    },
    onSuccess: (newItem) => {
      addItem(newItem)
      queryClient.invalidateQueries({ 
        queryKey: ['sppg', 'inventory', 'items', user?.sppgId] 
      })
      queryClient.invalidateQueries({ 
        queryKey: ['sppg', 'inventory', 'stats', user?.sppgId] 
      })
    }
  })
}

// Add Stock Mutation
export function useAddStock() {
  const queryClient = useQueryClient()
  const { addTransaction, updateItem } = useInventoryStore()
  const { user } = useAuth()

  return useMutation({
    mutationFn: async (formData: AddStockForm): Promise<{ 
      transaction: InventoryTransaction
      updatedItem: InventoryItem 
    }> => {
      const response = await fetch('/api/sppg/inventory/add-stock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (!response.ok) throw new Error('Failed to add stock')
      
      const data = await response.json()
      return {
        transaction: inventoryTransactionSchema.parse(data.transaction),
        updatedItem: inventoryItemSchema.parse(data.updatedItem)
      }
    },
    onSuccess: ({ transaction, updatedItem }) => {
      addTransaction(transaction)
      updateItem(updatedItem)
      queryClient.invalidateQueries({ 
        queryKey: ['sppg', 'inventory'] 
      })
    }
  })
}

// Use Stock Mutation
export function useUseStock() {
  const queryClient = useQueryClient()
  const { addTransaction, updateItem } = useInventoryStore()
  const { user } = useAuth()

  return useMutation({
    mutationFn: async (formData: UseStockForm): Promise<{ 
      transaction: InventoryTransaction
      updatedItem: InventoryItem 
    }> => {
      const response = await fetch('/api/sppg/inventory/use-stock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (!response.ok) throw new Error('Failed to use stock')
      
      const data = await response.json()
      return {
        transaction: inventoryTransactionSchema.parse(data.transaction),
        updatedItem: inventoryItemSchema.parse(data.updatedItem)
      }
    },
    onSuccess: ({ transaction, updatedItem }) => {
      addTransaction(transaction)
      updateItem(updatedItem)
      queryClient.invalidateQueries({ 
        queryKey: ['sppg', 'inventory'] 
      })
    }
  })
}