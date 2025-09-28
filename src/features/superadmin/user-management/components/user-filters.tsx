import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { Search, UserCheck, UserX } from 'lucide-react'

interface UserFilters {
  search?: string
  userType?: string
  sppgId?: string
  isActive?: boolean
}

interface SPPG {
  id: string
  name: string
  _count: {
    users: number
  }
}

interface UserFiltersProps {
  filters: UserFilters
  sppgList: SPPG[]
  selectedUserIds: string[]
  onFilterChange: (key: keyof UserFilters, value: string | boolean | undefined) => void
  onBulkAction: (action: 'activate' | 'deactivate') => void
  bulkActionLoading: boolean
  isLoading?: boolean
}

const UserFilters = React.memo<UserFiltersProps>(function UserFilters({ 
  filters, 
  sppgList, 
  selectedUserIds, 
  onFilterChange, 
  onBulkAction,
  bulkActionLoading,
  isLoading = false 
}) {
  const handleFormSubmit = React.useCallback((e: React.FormEvent) => {
    e.preventDefault()
    // Prevent form submission for enterprise UX
  }, [])

  return (
    <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
      <CardContent className="pt-6">
        <form onSubmit={handleFormSubmit}>
          <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari users..."
                value={filters.search || ''}
                onChange={(e) => onFilterChange('search', e.target.value)}
                className="pl-8 bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400"
              />
            </div>
          </div>

          <Select 
            value={filters.userType || 'all'} 
            onValueChange={(value) => onFilterChange('userType', value === 'all' ? undefined : value)}
            disabled={isLoading}
          >
            <SelectTrigger className="w-40 bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100">
              <SelectValue placeholder="User Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Tipe</SelectItem>
              <SelectItem value="SUPERADMIN">SuperAdmin</SelectItem>
              <SelectItem value="SPPG_USER">SPPG User</SelectItem>
            </SelectContent>
          </Select>

          <Select 
            value={filters.sppgId || 'all'} 
            onValueChange={(value) => onFilterChange('sppgId', value === 'all' ? undefined : value)}
            disabled={isLoading}
          >
            <SelectTrigger className="w-48 bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100">
              <SelectValue placeholder="SPPG" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua SPPG</SelectItem>
              {sppgList.map((sppg) => (
                <SelectItem key={sppg.id} value={sppg.id}>
                  {sppg.name} ({sppg._count.users})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select 
            value={filters.isActive === undefined ? 'all' : filters.isActive ? 'active' : 'inactive'} 
            onValueChange={(value) => onFilterChange('isActive', value === 'all' ? undefined : value === 'active')}
            disabled={isLoading}
          >
            <SelectTrigger className="w-32 bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

          {/* Bulk Actions */}
          {selectedUserIds.length > 0 && (
            <div className="flex items-center gap-2 mt-4 p-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg">
              <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                {selectedUserIds.length} user dipilih
              </span>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => onBulkAction('activate')}
                disabled={bulkActionLoading}
              >
                <UserCheck className="w-4 h-4 mr-2" />
                Aktifkan
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => onBulkAction('deactivate')}
                disabled={bulkActionLoading}
              >
                <UserX className="w-4 h-4 mr-2" />
                Nonaktifkan
              </Button>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
})

// Set display name for debugging
UserFilters.displayName = 'UserFilters'

export default UserFilters