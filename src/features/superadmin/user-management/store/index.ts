import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { 
  UserManagementState, 
  UserManagementActions,
  UserFilters,
  UserWithRelations,
  UserStats
} from '../types'

type UserManagementStore = UserManagementState & UserManagementActions

const initialState: UserManagementState = {
  users: [],
  stats: null,
  sppgList: [],
  selectedUserIds: [],
  filters: {
    page: 1,
    limit: 20,
  },
  pagination: {
    page: 1,
    limit: 20,
    totalCount: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  },
  isLoading: false,
  error: null,
}

export const useUserManagementStore = create<UserManagementStore>()(
  devtools(
    (set) => ({
      ...initialState,
      
      setUsers: (users: UserWithRelations[]) =>
        set({ users }, false, 'setUsers'),
        
      setStats: (stats: UserStats) =>
        set({ stats }, false, 'setStats'),
        
      setSppgList: (sppgList) =>
        set({ sppgList }, false, 'setSppgList'),
        
      setSelectedUserIds: (selectedUserIds: string[]) =>
        set({ selectedUserIds }, false, 'setSelectedUserIds'),
        
      toggleUserSelection: (id: string) =>
        set((state) => ({
          selectedUserIds: state.selectedUserIds.includes(id)
            ? state.selectedUserIds.filter(userId => userId !== id)
            : [...state.selectedUserIds, id]
        }), false, 'toggleUserSelection'),
        
      selectAllUsers: () =>
        set((state) => ({
          selectedUserIds: state.users.map(user => user.id)
        }), false, 'selectAllUsers'),
        
      clearSelection: () =>
        set({ selectedUserIds: [] }, false, 'clearSelection'),
        
      setFilters: (newFilters: Partial<UserFilters>) =>
        set((state) => {
          const updatedFilters = { ...state.filters, ...newFilters }
          
          // Only reset page if non-pagination filters changed
          const shouldResetPage = Object.keys(newFilters).some(key => 
            key !== 'page' && key !== 'limit'
          )
          
          return {
            filters: updatedFilters,
            // Smart pagination reset - enterprise behavior
            pagination: shouldResetPage 
              ? { ...state.pagination, page: 1 }
              : state.pagination,
            // Clear selection when filters change significantly
            selectedUserIds: shouldResetPage ? [] : state.selectedUserIds
          }
        }, false, 'setFilters'),
        
      setPagination: (newPagination) =>
        set((state) => ({
          pagination: { ...state.pagination, ...newPagination }
        }), false, 'setPagination'),
        
      setLoading: (isLoading: boolean) =>
        set({ isLoading }, false, 'setLoading'),
        
      setError: (error: string | null) =>
        set({ error }, false, 'setError'),
        
      reset: () =>
        set(initialState, false, 'reset'),
    }),
    {
      name: 'superadmin-user-management-store',
    }
  )
)