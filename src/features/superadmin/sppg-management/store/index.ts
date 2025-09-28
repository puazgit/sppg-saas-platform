import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type { SPPGManagementStore } from '../types'

const initialState = {
  sppgs: [],
  stats: null,
  filters: {
    search: '',
    status: undefined,
    organizationType: undefined,
    provinceId: undefined,
    isActive: undefined
  },
  pagination: {
    page: 1,
    limit: 10,
    totalCount: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false
  },
  selectedSppgIds: [],
  isLoading: false,
  error: null
}

export const useSPPGManagementStore = create<SPPGManagementStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // Actions
        setSppgs: (sppgs) => {
          set({ sppgs }, false, 'setSppgs')
        },

        setStats: (stats) => {
          set({ stats }, false, 'setStats')
        },

        setFilters: (newFilters) => {
          const currentFilters = get().filters
          set(
            { 
              filters: { ...currentFilters, ...newFilters },
              pagination: { ...get().pagination, page: 1 } // Reset to first page when filters change
            },
            false,
            'setFilters'
          )
        },

        setPagination: (newPagination) => {
          const currentPagination = get().pagination
          set(
            { pagination: { ...currentPagination, ...newPagination } },
            false,
            'setPagination'
          )
        },

        toggleSppgSelection: (sppgId) => {
          const currentSelected = get().selectedSppgIds
          const newSelected = currentSelected.includes(sppgId)
            ? currentSelected.filter(id => id !== sppgId)
            : [...currentSelected, sppgId]
          
          set({ selectedSppgIds: newSelected }, false, 'toggleSppgSelection')
        },

        selectAllSppgs: () => {
          const allSppgIds = get().sppgs.map(sppg => sppg.id)
          set({ selectedSppgIds: allSppgIds }, false, 'selectAllSppgs')
        },

        clearSelection: () => {
          set({ selectedSppgIds: [] }, false, 'clearSelection')
        },

        setLoading: (isLoading) => {
          set({ isLoading }, false, 'setLoading')
        },

        setError: (error) => {
          set({ error }, false, 'setError')
        }
      }),
      {
        name: 'sppg-management-store',
        partialize: (state) => ({
          filters: state.filters,
          pagination: {
            ...state.pagination,
            page: 1 // Reset page on store rehydration
          }
        })
      }
    ),
    {
      name: 'sppg-management'
    }
  )
)