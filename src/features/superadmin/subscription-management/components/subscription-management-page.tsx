'use client'

import { useState } from 'react'
import { Plus, Search, Filter, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SubscriptionOverview } from './subscription-overview'
import { SubscriptionList } from './subscription-list'
import { SubscriptionFilters } from './subscription-filters'
import { CreateSubscriptionDialog } from './create-subscription-dialog'
import { 
  useSubscriptionManagementStore,
  getSubscriptionFilterOptions
} from '@/features/superadmin/subscription-management'

export function SubscriptionManagementPage() {
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  
  const { 
    filters, 
    setFilters, 
    resetFilters,
    isLoading 
  } = useSubscriptionManagementStore()

  const filterOptions = getSubscriptionFilterOptions()

  const handleSearchChange = (value: string) => {
    setFilters({ search: value, page: 1 })
  }

  const handleStatusChange = (value: string) => {
    setFilters({ 
      status: value === 'all' ? undefined : value as 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'CANCELLED' | 'EXPIRED',
      page: 1 
    })
  }

  const handleTierChange = (value: string) => {
    setFilters({ 
      tier: value === 'all' ? undefined : value as 'BASIC' | 'STANDARD' | 'PRO' | 'ENTERPRISE',
      page: 1 
    })
  }

  const handleExport = async () => {
    try {
      const response = await fetch('/api/superadmin/subscriptions/export')
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        a.download = `subscriptions-export-${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Export failed:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Analytics Overview */}
      <SubscriptionOverview />

      {/* Actions Bar */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 items-center gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cari SPPG atau email..."
              value={filters.search || ''}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex items-center gap-2">
            <Select
              value={filters.status || 'all'}
              onValueChange={handleStatusChange}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                {filterOptions.status.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.tier || 'all'}
              onValueChange={handleTierChange}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Tier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Tier</SelectItem>
                {filterOptions.tier.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className={showFilters ? 'bg-muted' : ''}
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            disabled={isLoading}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          
          <Button
            onClick={() => setShowCreateDialog(true)}
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Tambah Subscription
          </Button>
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <SubscriptionFilters
          onClose={() => setShowFilters(false)}
          onReset={resetFilters}
        />
      )}

      {/* Subscription List */}
      <SubscriptionList />

      {/* Create Subscription Dialog */}
      <CreateSubscriptionDialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
      />
    </div>
  )
}