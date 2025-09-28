import { ProductionStats, BatchList, RecipeList } from '@/features/sppg/production'

export default function ProductionPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Production Management</h1>
          <p className="text-muted-foreground">
            Kelola produksi makanan, resep, dan kualitas SPPG
          </p>
        </div>
      </div>

      {/* Stats */}
      <ProductionStats />

      {/* Batch & Recipe Lists */}
      <div className="grid gap-8 lg:grid-cols-2">
        <BatchList />
        <RecipeList />
      </div>
    </div>
  )
}