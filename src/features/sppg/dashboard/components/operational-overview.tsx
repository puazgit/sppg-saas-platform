'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Calendar, 
  Clock, 
  Users, 
  AlertCircle, 
  CheckCircle,
  Timer,
  Thermometer
} from 'lucide-react'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import { useDashboardOperations } from '../hooks/use-dashboard-operations'
import { useDashboardStore } from '../store'

export function OperationalOverview() {
  // Menggunakan feature hook sesuai kesepakatan
  const { todayOperation: todayOp, isOperationLoading: isLoading } = useDashboardOperations()
  const { isOperationLoading } = useDashboardStore()

  if (isLoading || isOperationLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Operasional Hari Ini
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const getOperationStatusBadge = (status: string) => {
    const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string; icon: React.ReactNode }> = {
      PLANNED: { variant: 'secondary', label: 'Direncanakan', icon: <Calendar className="h-3 w-3" /> },
      IN_PROGRESS: { variant: 'default', label: 'Berlangsung', icon: <Timer className="h-3 w-3" /> },
      COMPLETED: { variant: 'default', label: 'Selesai', icon: <CheckCircle className="h-3 w-3" /> },
      DELAYED: { variant: 'destructive', label: 'Terlambat', icon: <AlertCircle className="h-3 w-3" /> }
    }
    const config = variants[status] || variants.PLANNED
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        {config.icon}
        {config.label}
      </Badge>
    )
  }

  const getProductionStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-500'
      case 'IN_PROGRESS': return 'bg-blue-500'
      case 'QUALITY_CHECK': return 'bg-yellow-500'
      default: return 'bg-gray-300'
    }
  }

  const productionProgress = todayOp ? 
    (todayOp.producedPortions / todayOp.plannedPortions) * 100 : 0

  const distributionProgress = todayOp ? 
    (todayOp.distributedPortions / todayOp.producedPortions) * 100 : 0

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Operasional Hari Ini
          </CardTitle>
          {todayOp && getOperationStatusBadge(todayOp.status)}
        </div>
        <div className="text-sm text-gray-500">
          {format(new Date(), 'EEEE, dd MMMM yyyy', { locale: id })}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {!todayOp ? (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Belum ada operasional hari ini</p>
          </div>
        ) : (
          <>
            {/* Production Progress */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Progress Produksi
                </h4>
                <span className="text-sm text-gray-600">
                  {todayOp.producedPortions} / {todayOp.plannedPortions} porsi
                </span>
              </div>
              <Progress value={productionProgress} className="h-2" />
              <div className="text-xs text-gray-500">
                {productionProgress.toFixed(1)}% selesai
              </div>
            </div>

            {/* Distribution Progress */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Progress Distribusi
                </h4>
                <span className="text-sm text-gray-600">
                  {todayOp.distributedPortions} / {todayOp.producedPortions} porsi
                </span>
              </div>
              <Progress value={distributionProgress} className="h-2" />
              <div className="text-xs text-gray-500">
                {distributionProgress.toFixed(1)}% terdistribusi
              </div>
            </div>

            {/* Production Details */}
            {todayOp.productions.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium">Produksi Menu</h4>
                <div className="space-y-2">
                  {todayOp.productions.map((prod) => (
                    <div key={prod.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${getProductionStatusColor(prod.status)}`} />
                        <div>
                          <p className="font-medium text-sm">{prod.menuName}</p>
                          <p className="text-xs text-gray-500">
                            {prod.batchCount} batch • {prod.totalServings} porsi
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        {prod.startTime && (
                          <p className="text-xs text-gray-500">
                            Mulai: {format(new Date(prod.startTime), 'HH:mm')}
                          </p>
                        )}
                        {prod.endTime && (
                          <p className="text-xs text-gray-500">
                            Selesai: {format(new Date(prod.endTime), 'HH:mm')}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Weather & Notes */}
            {(todayOp.weather || todayOp.notes) && (
              <div className="space-y-2 p-3 bg-blue-50 rounded-lg">
                {todayOp.weather && (
                  <div className="flex items-center gap-2 text-sm">
                    <Thermometer className="h-4 w-4 text-blue-600" />
                    <span className="text-gray-700">Cuaca: {todayOp.weather}</span>
                  </div>
                )}
                {todayOp.notes && (
                  <p className="text-sm text-gray-700">{todayOp.notes}</p>
                )}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}