import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  BookOpen, 
  Calendar,
  Plus,
  Search,
  Filter,
  Clock,
  Users,
  ChefHat,
  Target,
  Star
} from 'lucide-react'
import { useMenuPlanningStore } from '../store'

export function MenuPlanningOverview() {
  const { 
    recipes, 
    menuPlans, 
    menuTemplates,
    isRecipesLoading, 
    isMenuPlansLoading, 
    isTemplatesLoading,
    searchQuery,
    setSearchQuery,
    setCreateRecipeModalOpen,
    setCreateMenuPlanModalOpen,
    setCreateTemplateModalOpen
  } = useMenuPlanningStore()

  const activeMenuPlans = menuPlans.filter(plan => plan.status === 'ACTIVE')
  const draftMenuPlans = menuPlans.filter(plan => plan.status === 'DRAFT')
  const publicTemplates = menuTemplates.filter(template => template.isPublic)

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Ringkasan</TabsTrigger>
          <TabsTrigger value="recipes">Resep</TabsTrigger>
          <TabsTrigger value="menu-plans">Rencana Menu</TabsTrigger>
          <TabsTrigger value="templates">Template</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Total Resep
                </CardTitle>
                <CardDescription>
                  {recipes.filter(r => r.isActive).length} aktif dari {recipes.length} resep
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{recipes.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Menu Aktif
                </CardTitle>
                <CardDescription>
                  {activeMenuPlans.length} aktif, {draftMenuPlans.length} draft
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeMenuPlans.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ChefHat className="h-5 w-5" />
                  Template Publik
                </CardTitle>
                <CardDescription>
                  {publicTemplates.length} template tersedia
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{publicTemplates.length}</div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Aksi Cepat</CardTitle>
              <CardDescription>
                Buat resep, rencana menu, atau template baru
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Button onClick={() => setCreateRecipeModalOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Buat Resep
                </Button>
                <Button onClick={() => setCreateMenuPlanModalOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Buat Rencana Menu
                </Button>
                <Button variant="outline" onClick={() => setCreateTemplateModalOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Buat Template
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Menu Plans */}
          <Card>
            <CardHeader>
              <CardTitle>Rencana Menu Terbaru</CardTitle>
              <CardDescription>
                Menu yang sedang aktif atau baru dibuat
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isMenuPlansLoading ? (
                <div className="text-center py-4">Memuat rencana menu...</div>
              ) : menuPlans.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  Belum ada rencana menu
                </div>
              ) : (
                <div className="space-y-3">
                  {menuPlans.slice(0, 3).map((plan) => (
                    <div key={plan.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{plan.name}</h4>
                          <Badge variant={
                            plan.status === 'ACTIVE' ? 'default' :
                            plan.status === 'DRAFT' ? 'secondary' :
                            plan.status === 'APPROVED' ? 'outline' : 'destructive'
                          }>
                            {plan.status === 'ACTIVE' ? 'Aktif' :
                             plan.status === 'DRAFT' ? 'Draft' :
                             plan.status === 'APPROVED' ? 'Disetujui' :
                             plan.status === 'COMPLETED' ? 'Selesai' : plan.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {plan.startDate} - {plan.endDate} • {plan.targetBeneficiaries} penerima
                        </p>
                        <div className="flex items-center gap-4 text-xs">
                          <span>Menu: {plan.dailyMeals.length} hari</span>
                          <span>Biaya: Rp {plan.totalCost.toLocaleString()}</span>
                          <span>Nutrisi: {plan.nutritionSummary.varietyScore}/10</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recipes" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Bank Resep</h3>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Cari resep..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 w-[250px]"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-1" />
                Filter
              </Button>
              <Button size="sm" onClick={() => setCreateRecipeModalOpen(true)}>
                <Plus className="h-4 w-4 mr-1" />
                Tambah Resep
              </Button>
            </div>
          </div>

          {isRecipesLoading ? (
            <div className="text-center py-8">Memuat resep...</div>
          ) : recipes.length === 0 ? (
            <Card>
              <CardContent className="py-8">
                <div className="text-center">
                  <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Belum ada resep</h3>
                  <p className="text-muted-foreground mb-4">
                    Mulai dengan menambahkan resep pertama
                  </p>
                  <Button onClick={() => setCreateRecipeModalOpen(true)}>
                    <Plus className="h-4 w-4 mr-1" />
                    Tambah Resep Pertama
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {recipes
                .filter(recipe => 
                  !searchQuery || 
                  recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  recipe.description?.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((recipe) => (
                <Card key={recipe.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">
                          {recipe.category === 'MAIN_DISH' ? 'Makanan Utama' :
                           recipe.category === 'SIDE_DISH' ? 'Lauk Pauk' :
                           recipe.category === 'SOUP' ? 'Sup' :
                           recipe.category === 'BREAKFAST' ? 'Sarapan' : recipe.category}
                        </Badge>
                        <Badge variant={
                          recipe.difficulty === 'VERY_EASY' || recipe.difficulty === 'EASY' ? 'default' :
                          recipe.difficulty === 'MEDIUM' ? 'secondary' : 'destructive'
                        }>
                          {recipe.difficulty === 'VERY_EASY' ? 'Sangat Mudah' :
                           recipe.difficulty === 'EASY' ? 'Mudah' :
                           recipe.difficulty === 'MEDIUM' ? 'Sedang' :
                           recipe.difficulty === 'HARD' ? 'Sulit' : 'Sangat Sulit'}
                        </Badge>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-1">{recipe.name}</h4>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {recipe.description}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{recipe.preparationTime + recipe.cookingTime} menit</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          <span>{recipe.servingSize} porsi</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Target className="h-3 w-3" />
                          <span>{recipe.nutritionInfo.calories} kal</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="menu-plans" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Rencana Menu</h3>
            <Button size="sm" onClick={() => setCreateMenuPlanModalOpen(true)}>
              <Plus className="h-4 w-4 mr-1" />
              Buat Rencana Menu
            </Button>
          </div>

          {isMenuPlansLoading ? (
            <div className="text-center py-8">Memuat rencana menu...</div>
          ) : menuPlans.length === 0 ? (
            <Card>
              <CardContent className="py-8">
                <div className="text-center">
                  <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Belum ada rencana menu</h3>
                  <p className="text-muted-foreground mb-4">
                    Buat rencana menu untuk mengatur makanan harian
                  </p>
                  <Button onClick={() => setCreateMenuPlanModalOpen(true)}>
                    <Plus className="h-4 w-4 mr-1" />
                    Buat Rencana Menu
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {menuPlans.map((plan) => (
                <Card key={plan.id}>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{plan.name}</h4>
                          <Badge variant={
                            plan.status === 'ACTIVE' ? 'default' :
                            plan.status === 'DRAFT' ? 'secondary' :
                            plan.status === 'APPROVED' ? 'outline' : 'destructive'
                          }>
                            {plan.status === 'ACTIVE' ? 'Aktif' :
                             plan.status === 'DRAFT' ? 'Draft' :
                             plan.status === 'APPROVED' ? 'Disetujui' :
                             plan.status === 'COMPLETED' ? 'Selesai' : plan.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm font-medium">{plan.nutritionSummary.varietyScore}/10</span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground">{plan.description}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Periode:</span>
                          <p className="font-medium">{plan.startDate} - {plan.endDate}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Target Penerima:</span>
                          <p className="font-medium">{plan.targetBeneficiaries} orang</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Total Biaya:</span>
                          <p className="font-medium">Rp {plan.totalCost.toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Rata-rata Kalori:</span>
                          <p className="font-medium">{plan.nutritionSummary.averageCaloriesPerDay} kal/hari</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Menu: {plan.dailyMeals.length} hari</span>
                        <span>Protein: {plan.nutritionSummary.nutritionBalance.proteinPercent}%</span>
                        <span>Karbohidrat: {plan.nutritionSummary.nutritionBalance.carbohydratePercent}%</span>
                        <span>Lemak: {plan.nutritionSummary.nutritionBalance.fatPercent}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Template Menu</h3>
            <Button size="sm" onClick={() => setCreateTemplateModalOpen(true)}>
              <Plus className="h-4 w-4 mr-1" />
              Buat Template
            </Button>
          </div>

          {isTemplatesLoading ? (
            <div className="text-center py-8">Memuat template...</div>
          ) : menuTemplates.length === 0 ? (
            <Card>
              <CardContent className="py-8">
                <div className="text-center">
                  <ChefHat className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Belum ada template</h3>
                  <p className="text-muted-foreground mb-4">
                    Buat template untuk mempermudah pembuatan rencana menu
                  </p>
                  <Button onClick={() => setCreateTemplateModalOpen(true)}>
                    <Plus className="h-4 w-4 mr-1" />
                    Buat Template
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {menuTemplates.map((template) => (
                <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">
                          {template.category === 'BALANCED' ? 'Seimbang' :
                           template.category === 'VEGETARIAN' ? 'Vegetarian' :
                           template.category === 'LOW_SODIUM' ? 'Rendah Garam' :
                           template.category === 'BUDGET_FRIENDLY' ? 'Hemat' : template.category}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium">{template.rating}</span>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-1">{template.name}</h4>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {template.description}
                        </p>
                      </div>
                      
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Durasi:</span>
                          <span className="font-medium">{template.duration} hari</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Biaya/hari:</span>
                          <span className="font-medium">Rp {template.estimatedCostPerDay.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Digunakan:</span>
                          <span className="font-medium">{template.usageCount}x</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {template.targetAudience.slice(0, 2).map((audience) => (
                          <Badge key={audience} variant="secondary" className="text-xs">
                            {audience === 'STUDENT' ? 'Siswa' :
                             audience === 'ELDERLY' ? 'Lansia' :
                             audience === 'PREGNANT_MOTHER' ? 'Ibu Hamil' : audience}
                          </Badge>
                        ))}
                        {template.targetAudience.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{template.targetAudience.length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}