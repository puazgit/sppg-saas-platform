import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  ChefHat, 
  BookOpen, 
  DollarSign, 
  Target,
  Star,
  Calendar,
  TrendingUp
} from 'lucide-react'
import { useMenuPlanningStore } from '../store'

export function MenuPlanningStats() {
  const { stats, isStatsLoading } = useMenuPlanningStore()

  if (isStatsLoading || !stats) {
    return <MenuPlanningStatsSkeleton />
  }

  const statItems = [
    {
      title: 'Rencana Menu Aktif',
      value: stats.activeMenuPlans.toString(),
      description: 'Sedang berlangsung',
      icon: Calendar,
      trend: '+15%'
    },
    {
      title: 'Total Resep',
      value: stats.totalRecipes.toString(),
      description: 'Resep tersedia',
      icon: BookOpen,
      trend: '+8%'
    },
    {
      title: 'Biaya Rata-rata',
      value: `Rp ${stats.averageCostPerMeal.toLocaleString()}`,
      description: 'Per porsi makanan',
      icon: DollarSign,
      trend: '-3%'
    },
    {
      title: 'Kepatuhan Nutrisi',
      value: `${stats.nutritionComplianceRate.toFixed(1)}%`,
      description: 'Standar nutrisi',
      icon: Target,
      trend: '+5%'
    },
    {
      title: 'Kepuasan Penerima',
      value: `${stats.beneficiarySatisfaction.toFixed(1)}/5`,
      description: 'Rating rata-rata',
      icon: Star,
      trend: '+0.3'
    },
    {
      title: 'Menu Bulanan',
      value: stats.monthlyMenusCreated.toString(),
      description: 'Dibuat bulan ini',
      icon: ChefHat,
      trend: '+22%'
    }
  ]

  return (
    <div className="space-y-6">
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
      
      {/* Popular Recipes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ChefHat className="h-5 w-5" />
            Resep Populer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats.popularRecipes.map((recipe, index) => (
              <div key={recipe.recipeId} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-medium">{recipe.recipeName}</h4>
                    <p className="text-sm text-muted-foreground">
                      Digunakan {recipe.usageCount}x • Terakhir: {recipe.lastUsed}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium">{recipe.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function MenuPlanningStatsSkeleton() {
  return (
    <div className="space-y-6">
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
      
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-[150px]" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-6 h-6 rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-[120px]" />
                    <Skeleton className="h-3 w-[180px]" />
                  </div>
                </div>
                <Skeleton className="h-4 w-[40px]" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}