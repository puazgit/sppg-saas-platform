import { InventoryStats, InventoryList } from '@/features/sppg/inventory'

export default function InventoryPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Inventory Management</h1>
          <p className="text-muted-foreground">
            Kelola stok bahan makanan dan kebutuhan operasional SPPG
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <InventoryStats />

      {/* Items List */}
      <InventoryList />
    </div>
  )
}