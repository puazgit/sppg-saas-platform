'use client'

export function ProductionStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <div className="bg-card rounded-lg p-4">
        <h3 className="text-sm font-medium text-muted-foreground">Produksi Hari Ini</h3>
        <p className="text-2xl font-bold">12 Batch</p>
      </div>
      <div className="bg-card rounded-lg p-4">
        <h3 className="text-sm font-medium text-muted-foreground">Total Porsi</h3>
        <p className="text-2xl font-bold">850 Porsi</p>
      </div>
      <div className="bg-card rounded-lg p-4">
        <h3 className="text-sm font-medium text-muted-foreground">Selesai</h3>
        <p className="text-2xl font-bold">8 Batch</p>
      </div>
      <div className="bg-card rounded-lg p-4">
        <h3 className="text-sm font-medium text-muted-foreground">Kualitas Rata-rata</h3>
        <p className="text-2xl font-bold">9.2/10</p>
      </div>
    </div>
  )
}