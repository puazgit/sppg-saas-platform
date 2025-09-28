'use client'

import React, { useCallback } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

import { useUserData, useBulkUserAction } from '../hooks'
import { useUserManagementStore } from '../store'
import { UserStatsCards, UserFilters, UserTable, UserPagination } from './'

const UserManagement = React.memo(function UserManagement() {
  const {
    users,
    stats,
    sppgList,
    selectedUserIds,
    filters,
    pagination,
    error,
    setFilters,
    setPagination,
    toggleUserSelection,
    selectAllUsers,
    clearSelection
  } = useUserManagementStore()

  // Fetch users data with enterprise optimization
  const { refetch, isInitialLoading, isRefreshing } = useUserData()
  
  // Bulk actions mutation
  const bulkActionMutation = useBulkUserAction()

  const handleFilterChange = useCallback((key: keyof typeof filters, value: string | boolean | undefined) => {
    setFilters({ [key]: value })
  }, [setFilters])

  const handleBulkAction = useCallback(async (action: 'activate' | 'deactivate') => {
    if (selectedUserIds.length === 0) return

    try {
      await bulkActionMutation.mutateAsync({
        userIds: selectedUserIds,
        action
      })
      // Data will be automatically refetched due to query invalidation
    } catch (error) {
      console.error(`Failed to ${action} users:`, error)
    }
  }, [selectedUserIds, bulkActionMutation])

  const handlePageChange = useCallback((page: number) => {
    setPagination({ page })
  }, [setPagination])

  if (isInitialLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="space-y-8">
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mb-6"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-slate-200 dark:bg-slate-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>
          <Button 
            onClick={() => refetch()}
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white"
          >
            Coba Lagi
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Manajemen Users</h1>
          <p className="text-slate-600 dark:text-slate-300 mt-2">
            Kelola semua users di platform SPPG
          </p>
        </div>
        
        <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Tambah User
        </Button>
      </div>

      {/* Stats Cards */}
      <UserStatsCards stats={stats} />

      {/* Filters */}
      <UserFilters
        filters={filters}
        sppgList={sppgList}
        selectedUserIds={selectedUserIds}
        onFilterChange={handleFilterChange}
        onBulkAction={handleBulkAction}
        bulkActionLoading={bulkActionMutation.isPending}
        isLoading={isRefreshing}
      />

      {/* Users Table */}
      <div className="relative">
        {isRefreshing && (
          <div className="absolute inset-0 bg-white/70 dark:bg-slate-900/70 z-10 flex items-center justify-center backdrop-blur-sm">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 dark:border-blue-400"></div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Updating...</span>
            </div>
          </div>
        )}
        <UserTable
          users={users}
          selectedUserIds={selectedUserIds}
          onToggleSelection={toggleUserSelection}
          onSelectAll={selectAllUsers}
          onClearSelection={clearSelection}
        />
      </div>

      {/* Pagination */}
      <UserPagination
        currentUsersLength={users.length}
        totalCount={pagination.totalCount}
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        hasNextPage={pagination.hasNextPage}
        hasPrevPage={pagination.hasPrevPage}
        onPageChange={handlePageChange}
      />
    </div>
  )
})

// Set display name for debugging
UserManagement.displayName = 'UserManagement'

export default UserManagement