import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  MapPin, 
  Users, 
  Package, 
  Clock, 
  TrendingUp,
  Star 
} from 'lucide-react'
import { useDistributionStore } from '../store/use-distribution-store'

export function DistributionStats() {
  const { stats, isStatsLoading } = useDistributionStore()

  if (isStatsLoading || !stats) {
    return <DistributionStatsSkeleton />
  }

  const statItems = [
    {
      title: 'Distribusi Hari Ini',
      value: stats.todayDistributions.toString(),
      description: 'Titik distribusi aktif',
      icon: MapPin,
      trend: '+12%'
    },
    {
      title: 'Distribusi Selesai',
      value: stats.completedDistributions.toString(),
      description: 'Dari total hari ini',
      icon: Package,
      trend: '+8%'
    },
    {
      title: 'Total Penerima',
      value: stats.totalRecipients.toString(),
      description: 'Sudah terdaftar',
      icon: Users,
      trend: '+15%'
    },
    {
      title: 'Porsi Terdistribusi',
      value: stats.totalPortionsDistributed.toString(),
      description: 'Total bulan ini',
      icon: Package,
      trend: '+22%'
    },
    {
      title: 'Waktu Rata-rata',
      value: `${stats.averageDeliveryTime} menit`,
      description: 'Per titik distribusi',
      icon: Clock,
      trend: '-5%'
    },
    {
      title: 'Kepuasan Penerima',
      value: `${stats.beneficiarySatisfaction.toFixed(1)}/5`,
      description: 'Rating rata-rata',
      icon: Star,
      trend: '+0.2'
    }
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {statItems.map((item) => (
        <Card key={item.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
            <item.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{item.value}</div>
            <p className="text-xs text-muted-foreground">
              {item.description}
            </p>
            <div className="flex items-center space-x-1 text-xs mt-2">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-green-500">{item.trend}</span>
              <span className="text-muted-foreground">dari bulan lalu</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function DistributionStatsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-[60px] mb-2" />
            <Skeleton className="h-3 w-[120px] mb-2" />
            <div className="flex items-center space-x-1">
              <Skeleton className="h-3 w-3" />
              <Skeleton className="h-3 w-[80px]" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}