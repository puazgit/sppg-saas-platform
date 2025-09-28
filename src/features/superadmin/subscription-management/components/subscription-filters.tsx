'use client'

import { X, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  useSubscriptionManagementStore,
  getSubscriptionFilterOptions
} from '@/features/superadmin/subscription-management'

interface SubscriptionFiltersProps {
  onClose: () => void
  onReset: () => void
}

export function SubscriptionFilters({ onClose, onReset }: SubscriptionFiltersProps) {
  const { filters, setFilters } = useSubscriptionManagementStore()
  const filterOptions = getSubscriptionFilterOptions()

  const handleExpiringWithinChange = (value: string) => {
    setFilters({
      expiringWithin: value === 'all' ? undefined : parseInt(value),
      page: 1
    })
  }

  const handleSortByChange = (value: string) => {
    setFilters({
      sortBy: value as 'createdAt' | 'endDate' | 'sppgName' | 'tier',
      page: 1
    })
  }

  const handleSortOrderChange = (value: string) => {
    setFilters({
      sortOrder: value as 'asc' | 'desc',
      page: 1
    })
  }

  const handleLimitChange = (value: string) => {
    setFilters({
      limit: parseInt(value),
      page: 1
    })
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Advanced Filters</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onReset}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Expiring Within Filter */}
          <div className="space-y-2">
            <Label htmlFor="expiring-within">Berakhir Dalam</Label>
            <Select
              value={filters.expiringWithin?.toString() || 'all'}
              onValueChange={handleExpiringWithinChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih periode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua</SelectItem>
                {filterOptions.expiringWithin.map((option) => (
                  <SelectItem key={option.value} value={option.value.toString()}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sort By */}
          <div className="space-y-2">
            <Label htmlFor="sort-by">Urutkan Berdasarkan</Label>
            <Select
              value={filters.sortBy}
              onValueChange={handleSortByChange}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt">Tanggal Dibuat</SelectItem>
                <SelectItem value="endDate">Tanggal Berakhir</SelectItem>
                <SelectItem value="sppgName">Nama SPPG</SelectItem>
                <SelectItem value="tier">Tier</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort Order */}
          <div className="space-y-2">
            <Label htmlFor="sort-order">Urutan</Label>
            <Select
              value={filters.sortOrder}
              onValueChange={handleSortOrderChange}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">Terbaru</SelectItem>
                <SelectItem value="asc">Terlama</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Items Per Page */}
          <div className="space-y-2">
            <Label htmlFor="limit">Items Per Halaman</Label>
            <Select
              value={filters.limit.toString()}
              onValueChange={handleLimitChange}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Applied Filters Summary */}
        <div className="mt-6 pt-4 border-t">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Filter aktif: {[
                filters.status && `Status: ${filters.status}`,
                filters.tier && `Tier: ${filters.tier}`,
                filters.search && `Search: "${filters.search}"`,
                filters.expiringWithin && `Berakhir dalam ${filters.expiringWithin} hari`
              ].filter(Boolean).join(', ') || 'Tidak ada'}
            </div>
            
            <div className="text-sm text-muted-foreground">
              Menampilkan {filters.limit} per halaman, halaman {filters.page}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}