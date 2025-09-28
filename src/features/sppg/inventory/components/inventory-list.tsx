'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  Grid3X3, 
  List, 
  Search, 
  Filter,
  Package,
  AlertTriangle,
  Calendar
} from 'lucide-react'
import { useInventoryItems, useStockAlerts } from '../hooks/use-inventory'
import { useInventoryStore } from '../store'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDistanceToNow } from 'date-fns'
import { id } from 'date-fns/locale'

const categoryLabels = {
  STAPLE_FOOD: 'Bahan Pokok',
  PROTEIN: 'Protein',
  VEGETABLES: 'Sayuran',
  FRUITS: 'Buah-buahan',
  DAIRY: 'Susu & Turunan',
  SPICES: 'Bumbu & Rempah',
  COOKING_OIL: 'Minyak Goreng',
  PACKAGING: 'Kemasan',
  CLEANING: 'Pembersih',
  OTHERS: 'Lain-lain'
}

const statusColors = {
  IN_STOCK: 'bg-green-100 text-green-800',
  LOW_STOCK: 'bg-orange-100 text-orange-800',
  OUT_OF_STOCK: 'bg-red-100 text-red-800',
  EXPIRING_SOON: 'bg-yellow-100 text-yellow-800',
  EXPIRED: 'bg-red-100 text-red-800'
}

export function InventoryList() {
  const { data: items, isLoading } = useInventoryItems()
  const { data: alerts } = useStockAlerts()
  const { 
    filters, 
    viewMode, 
    setFilters, 
    setViewMode,
    setSelectedItemId,
    setAddStockModalOpen,
    setUseStockModalOpen
  } = useInventoryStore()

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-64" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-20" />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    )
  }

  const filteredItems = items?.filter(item => {
    const matchesSearch = !filters.search || 
      item.name.toLowerCase().includes(filters.search.toLowerCase())
    const matchesCategory = !filters.category || item.category === filters.category
    const matchesStatus = !filters.status || item.status === filters.status
    return matchesSearch && matchesCategory && matchesStatus
  }) || []

  const sortedItems = [...filteredItems].sort((a, b) => {
    const order = filters.sortOrder === 'asc' ? 1 : -1
    switch (filters.sortBy) {
      case 'name':
        return a.name.localeCompare(b.name) * order
      case 'category':
        return a.category.localeCompare(b.category) * order
      case 'currentStock':
        return (a.currentStock - b.currentStock) * order
      case 'expiryDate':
        if (!a.expiryDate && !b.expiryDate) return 0
        if (!a.expiryDate) return 1 * order
        if (!b.expiryDate) return -1 * order
        return (new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime()) * order
      case 'unitPrice':
        return (a.unitPrice - b.unitPrice) * order
      default:
        return 0
    }
  })

  const getItemAlerts = (itemId: string) => {
    return alerts?.filter(alert => alert.itemId === itemId) || []
  }

  return (
    <div className="space-y-6">
      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-1 gap-2 max-w-lg">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Cari item inventory..."
              value={filters.search}
              onChange={(e) => setFilters({ search: e.target.value })}
              className="pl-10"
            />
          </div>
          
          <Select
            value={filters.category || 'all'}
            onValueChange={(value) => setFilters({ 
              category: value === 'all' ? undefined : value as any 
            })}
          >
            <SelectTrigger className="w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kategori</SelectItem>
              {Object.entries(categoryLabels).map(([key, label]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* View Mode Toggle */}
        <div className="flex gap-1 bg-muted rounded-lg p-1">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Items Grid/List */}
      <div className={
        viewMode === 'grid' 
          ? "grid gap-4 md:grid-cols-2 lg:grid-cols-3"
          : "space-y-3"
      }>
        {sortedItems.map((item) => {
          const itemAlerts = getItemAlerts(item.id)
          
          return (
            <Card key={item.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-medium text-sm">{item.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {categoryLabels[item.category]}
                  </p>
                </div>
                
                <div className="flex flex-col items-end gap-1">
                  <Badge className={`text-xs ${statusColors[item.status]}`}>
                    {item.status.replace('_', ' ')}
                  </Badge>
                  {itemAlerts.length > 0 && (
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  )}
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Stok:</span>
                  <span className="font-medium">
                    {item.currentStock} {item.unit}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Min Stock:</span>
                  <span>{item.minimumStock} {item.unit}</span>
                </div>

                {item.expiryDate && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Kedaluwarsa:</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDistanceToNow(new Date(item.expiryDate), { 
                        addSuffix: true,
                        locale: id 
                      })}
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nilai:</span>
                  <span className="font-medium">
                    Rp {item.totalValue.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    setSelectedItemId(item.id)
                    setAddStockModalOpen(true)
                  }}
                >
                  <Package className="h-3 w-3 mr-1" />
                  Tambah Stok
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    setSelectedItemId(item.id)
                    setUseStockModalOpen(true)
                  }}
                >
                  Pakai Stok
                </Button>
              </div>
            </Card>
          )
        })}
      </div>

      {sortedItems.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground mb-2">
            Tidak ada item inventory
          </h3>
          <p className="text-sm text-muted-foreground">
            {filters.search || filters.category || filters.status 
              ? 'Coba ubah filter pencarian'
              : 'Mulai tambahkan item inventory pertama'
            }
          </p>
        </div>
      )}
    </div>
  )
}