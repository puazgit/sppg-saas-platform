import React from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useDebounce } from '@/hooks/use-debounce'
import { useUserManagementStore } from '../store'
import { 
  userFiltersSchema, 
  createUserSchema, 
  updateUserSchema, 
  bulkUserActionSchema,
  type UserFilters,
  type CreateUserInput,
  type UpdateUserInput,
  type BulkUserAction
} from '../schemas'
import { useAuth } from '@/features/auth'
import type { UsersApiResponse } from '../types'

// Query keys
export const userManagementKeys = {
  all: ['superadmin-user-management'] as const,
  lists: () => [...userManagementKeys.all, 'list'] as const,
  list: (filters: UserFilters) => [...userManagementKeys.lists(), filters] as const,
  details: () => [...userManagementKeys.all, 'detail'] as const,
  detail: (id: string) => [...userManagementKeys.details(), id] as const,
}

// Fetch users from real database via API
async function fetchUsers(filters: UserFilters): Promise<UsersApiResponse['data']> {
  const validatedFilters = userFiltersSchema.parse(filters)
  
  const params = new URLSearchParams()
  if (validatedFilters.search) params.append('search', validatedFilters.search)
  if (validatedFilters.userType) params.append('userType', validatedFilters.userType)
  if (validatedFilters.sppgId) params.append('sppgId', validatedFilters.sppgId)
  if (validatedFilters.isActive !== undefined) params.append('status', validatedFilters.isActive ? 'active' : 'inactive')
  params.append('page', validatedFilters.page.toString())
  params.append('limit', validatedFilters.limit.toString())

  const response = await fetch(`/api/superadmin/users?${params}`)
  
  if (!response.ok) {
    throw new Error(`Failed to fetch users: ${response.statusText}`)
  }
  
  const result: UsersApiResponse = await response.json()
  
  if (!result.success) {
    throw new Error('Failed to fetch users')
  }
  
  return result.data
}

// Create user in real database
async function createUser(userData: CreateUserInput) {
  const validatedData = createUserSchema.parse(userData)
  
  const response = await fetch('/api/superadmin/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(validatedData),
  })
  
  if (!response.ok) {
    throw new Error(`Failed to create user: ${response.statusText}`)
  }
  
  const result = await response.json()
  
  if (!result.success) {
    throw new Error(result.error || 'Failed to create user')
  }
  
  return result.data
}

// Update user in real database
async function updateUser(userData: UpdateUserInput) {
  const validatedData = updateUserSchema.parse(userData)
  
  const response = await fetch(`/api/superadmin/users/${validatedData.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(validatedData),
  })
  
  if (!response.ok) {
    throw new Error(`Failed to update user: ${response.statusText}`)
  }
  
  const result = await response.json()
  
  if (!result.success) {
    throw new Error(result.error || 'Failed to update user')
  }
  
  return result.data
}

// Bulk actions on real database
async function bulkUserAction(actionData: BulkUserAction) {
  const validatedData = bulkUserActionSchema.parse(actionData)
  
  const response = await fetch('/api/superadmin/users', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: `bulk_${validatedData.action}`,
      userIds: validatedData.userIds,
    }),
  })
  
  if (!response.ok) {
    throw new Error(`Failed to ${validatedData.action} users: ${response.statusText}`)
  }
  
  const result = await response.json()
  
  if (!result.success) {
    throw new Error(result.error || `Failed to ${validatedData.action} users`)
  }
  
  return result
}

// Hook: Fetch users with SuperAdmin access control - Enterprise Level
export function useUsers() {
  const { user } = useAuth()
  const { filters } = useUserManagementStore()
  
  // Separate debounce for search to prevent excessive queries
  const debouncedSearch = useDebounce(filters.search ?? '', 300)
  
  // Stable filter object - prevents unnecessary re-renders
  const queryFilters = React.useMemo(() => {
    const baseFilters = {
      page: filters.page ?? 1,
      limit: filters.limit ?? 20,
      search: debouncedSearch.trim(),
      userType: filters.userType,
      sppgId: filters.sppgId,
      isActive: filters.isActive,
    }
    
    // Remove undefined values to create stable query key
    return Object.fromEntries(
      Object.entries(baseFilters).filter(([, value]) => 
        value !== undefined && value !== null && value !== ''
      )
    ) as UserFilters
  }, [
    filters.page,
    filters.limit, 
    debouncedSearch,
    filters.userType,
    filters.sppgId,
    filters.isActive
  ])
  
  // Enterprise-level query with advanced optimizations
  return useQuery({
    queryKey: userManagementKeys.list(queryFilters),
    queryFn: () => fetchUsers(queryFilters),
    enabled: !!user && user.userType === 'SUPERADMIN',
    
    // Advanced caching strategy
    staleTime: 1000 * 60 * 3, // 3 minutes - aggressive for real-time feel
    gcTime: 1000 * 60 * 15,   // 15 minutes - keep in memory longer
    
    // Network optimizations
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: 'always',
    
    // Retry strategy for enterprise reliability
    retry: (failureCount, error) => {
      if (failureCount >= 3) return false
      if (error?.message?.includes('401') || error?.message?.includes('403')) return false
      return true
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    
    // Background updates for enterprise UX
    refetchInterval: 1000 * 60 * 5, // Auto-refresh every 5 minutes
    refetchIntervalInBackground: false,
    
    // Optimistic updates
    placeholderData: (previousData) => previousData,
    
    // Meta for debugging
    meta: {
      feature: 'user-management',
      component: 'SuperAdmin'
    }
  })
}

// Enterprise Hook: Data Management with Advanced State Sync
export function useUserData() {
  const query = useUsers()
  const { 
    setUsers, 
    setStats, 
    setSppgList, 
    setPagination, 
    setLoading, 
    setError 
  } = useUserManagementStore()
  
  // Optimized data sync with batched updates
  React.useEffect(() => {
    // Batch all updates to prevent multiple re-renders
    if (query.isSuccess && query.data) {
      React.startTransition(() => {
        setUsers(query.data.users)
        setStats(query.data.stats)
        setSppgList(query.data.sppgList)
        setPagination(query.data.pagination)
        setError(null)
      })
    }
    
    if (query.isError && query.error) {
      setError(query.error.message)
    }
    
    setLoading(query.isLoading)
    
  }, [
    query.isSuccess,
    query.data,
    query.isError, 
    query.error,
    query.isLoading,
    setUsers,
    setStats,
    setSppgList,
    setPagination,
    setError,
    setLoading
  ])
  
  return {
    ...query,
    // Enterprise-level status indicators
    isInitialLoading: query.isLoading && !query.data,
    isRefreshing: query.isFetching && !!query.data,
    hasData: !!query.data,
    isEmpty: query.data?.users.length === 0,
  }
}

// Hook: Create user mutation with optimistic updates
export function useCreateUser() {
  const queryClient = useQueryClient()
  const { clearSelection } = useUserManagementStore()
  
  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      // Invalidate and refetch users list from real database
      queryClient.invalidateQueries({ queryKey: userManagementKeys.lists() })
      clearSelection()
    },
    onError: (error: Error) => {
      console.error('Failed to create user:', error)
    },
  })
}

// Hook: Update user mutation
export function useUpdateUser() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: updateUser,
    onSuccess: (data, variables) => {
      // Invalidate and refetch real data
      queryClient.invalidateQueries({ queryKey: userManagementKeys.lists() })
      queryClient.invalidateQueries({ queryKey: userManagementKeys.detail(variables.id) })
    },
    onError: (error: Error) => {
      console.error('Failed to update user:', error)
    },
  })
}

// Hook: Bulk actions mutation with real database updates
export function useBulkUserAction() {
  const queryClient = useQueryClient()
  const { clearSelection } = useUserManagementStore()
  
  return useMutation({
    mutationFn: bulkUserAction,
    onSuccess: () => {
      // Invalidate and refetch users list from real database
      queryClient.invalidateQueries({ queryKey: userManagementKeys.lists() })
      clearSelection()
    },
    onError: (error: Error) => {
      console.error('Failed to perform bulk action:', error)
    },
  })
}

// Hook: Get single user detail
export function useUser(id: string) {
  const { user } = useAuth()
  
  return useQuery({
    queryKey: userManagementKeys.detail(id),
    queryFn: async () => {
      const response = await fetch(`/api/superadmin/users/${id}`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch user: ${response.statusText}`)
      }
      
      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch user')
      }
      
      return result.data
    },
    enabled: !!user && !!id && user.userType === 'SUPERADMIN',
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}