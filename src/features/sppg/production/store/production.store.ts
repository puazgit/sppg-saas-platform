import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface ProductionState {
  // Production state placeholder
  isLoading: boolean
  setLoading: (loading: boolean) => void
}

export const useProductionStore = create<ProductionState>()(
  devtools(
    (set) => ({
      isLoading: false,
      setLoading: (loading) => set({ isLoading: loading })
    }),
    { name: 'sppg-production-store' }
  )
)