import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  MapPin, 
  Users, 
  Calendar,
  Plus,
  Map,
  List,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { useDistributionStore } from '../store/use-distribution-store'

export function DistributionOverview() {
  const { 
    distributionPoints, 
    distributionLogs, 
    beneficiaries,
    isPointsLoading, 
    isLogsLoading, 
    isBeneficiariesLoading,
    viewMode,
    setViewMode,
    setCreatePointModalOpen,
    setCreateBeneficiaryModalOpen 
  } = useDistributionStore()

  const activeDistributions = distributionLogs.filter(log => log.status === 'DISTRIBUTING').length
  const todayLogs = distributionLogs.filter(log => {
    const today = new Date().toISOString().split('T')[0]
    return log.date === today
  })

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Ringkasan</TabsTrigger>
          <TabsTrigger value="points">Titik Distribusi</TabsTrigger>
          <TabsTrigger value="logs">Riwayat</TabsTrigger>
          <TabsTrigger value="beneficiaries">Penerima</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Titik Distribusi Aktif
                </CardTitle>
                <CardDescription>
                  {distributionPoints.filter(p => p.isActive).length} dari {distributionPoints.length} titik
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {distributionPoints.filter(p => p.isActive).length}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Distribusi Hari Ini
                </CardTitle>
                <CardDescription>
                  {activeDistributions} sedang berlangsung
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{todayLogs.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Total Penerima
                </CardTitle>
                <CardDescription>
                  {beneficiaries.filter(b => b.isActive).length} aktif
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{beneficiaries.length}</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Distribusi Terkini</CardTitle>
              <CardDescription>
                Aktivitas distribusi hari ini
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLogsLoading ? (
                <div className="text-center py-4">Memuat data...</div>
              ) : todayLogs.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  Belum ada distribusi hari ini
                </div>
              ) : (
                <div className="space-y-3">
                  {todayLogs.slice(0, 3).map((log) => (
                    <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          {log.status === 'COMPLETED' ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : log.status === 'DISTRIBUTING' ? (
                            <Clock className="h-4 w-4 text-blue-500" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-orange-500" />
                          )}
                          <span className="font-medium">{log.distributionPointName}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={
                          log.status === 'COMPLETED' ? 'default' :
                          log.status === 'DISTRIBUTING' ? 'secondary' : 'outline'
                        }>
                          {log.status === 'COMPLETED' ? 'Selesai' :
                           log.status === 'DISTRIBUTING' ? 'Berlangsung' : 'Terjadwal'}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {log.actualRecipients || 0}/{log.plannedRecipients}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="points" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Titik Distribusi</h3>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode(viewMode === 'map' ? 'list' : 'map')}
              >
                {viewMode === 'map' ? <List className="h-4 w-4" /> : <Map className="h-4 w-4" />}
                {viewMode === 'map' ? 'List' : 'Peta'}
              </Button>
              <Button size="sm" onClick={() => setCreatePointModalOpen(true)}>
                <Plus className="h-4 w-4 mr-1" />
                Tambah Titik
              </Button>
            </div>
          </div>

          {isPointsLoading ? (
            <div className="text-center py-8">Memuat titik distribusi...</div>
          ) : distributionPoints.length === 0 ? (
            <Card>
              <CardContent className="py-8">
                <div className="text-center">
                  <MapPin className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Belum ada titik distribusi</h3>
                  <p className="text-muted-foreground mb-4">
                    Mulai dengan menambahkan titik distribusi pertama
                  </p>
                  <Button onClick={() => setCreatePointModalOpen(true)}>
                    <Plus className="h-4 w-4 mr-1" />
                    Tambah Titik Distribusi
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {distributionPoints.map((point) => (
                <Card key={point.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <h4 className="font-medium">{point.name}</h4>
                          <p className="text-sm text-muted-foreground">{point.address}</p>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-xs text-muted-foreground">
                              Kapasitas: {point.capacity}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              Kontak: {point.contactPerson}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={point.isActive ? 'default' : 'secondary'}>
                          {point.isActive ? 'Aktif' : 'Nonaktif'}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Riwayat Distribusi</h3>
            <Button size="sm">
              <Calendar className="h-4 w-4 mr-1" />
              Filter Tanggal
            </Button>
          </div>

          {isLogsLoading ? (
            <div className="text-center py-8">Memuat riwayat distribusi...</div>
          ) : distributionLogs.length === 0 ? (
            <Card>
              <CardContent className="py-8">
                <div className="text-center">
                  <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Belum ada riwayat distribusi</h3>
                  <p className="text-muted-foreground">
                    Riwayat distribusi akan muncul setelah ada aktivitas distribusi
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {distributionLogs.map((log) => (
                <Card key={log.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{log.distributionPointName}</h4>
                          <Badge variant={
                            log.status === 'COMPLETED' ? 'default' :
                            log.status === 'DISTRIBUTING' ? 'secondary' : 'outline'
                          }>
                            {log.status === 'COMPLETED' ? 'Selesai' :
                             log.status === 'DISTRIBUTING' ? 'Berlangsung' :
                             log.status === 'SCHEDULED' ? 'Terjadwal' : log.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {log.date} • {log.scheduledTime}
                        </p>
                        <div className="flex items-center gap-4 text-sm">
                          <span>Target: {log.plannedRecipients}</span>
                          <span>Terealisasi: {log.actualRecipients}</span>
                          <span>Menu: {log.menusDistributed.length}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="beneficiaries" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Penerima Manfaat</h3>
            <Button size="sm" onClick={() => setCreateBeneficiaryModalOpen(true)}>
              <Plus className="h-4 w-4 mr-1" />
              Tambah Penerima
            </Button>
          </div>

          {isBeneficiariesLoading ? (
            <div className="text-center py-8">Memuat data penerima...</div>
          ) : beneficiaries.length === 0 ? (
            <Card>
              <CardContent className="py-8">
                <div className="text-center">
                  <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Belum ada penerima manfaat</h3>
                  <p className="text-muted-foreground mb-4">
                    Mulai dengan menambahkan penerima manfaat pertama
                  </p>
                  <Button onClick={() => setCreateBeneficiaryModalOpen(true)}>
                    <Plus className="h-4 w-4 mr-1" />
                    Tambah Penerima
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {beneficiaries.map((beneficiary) => (
                <Card key={beneficiary.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{beneficiary.name}</h4>
                          <Badge variant={
                            beneficiary.category === 'ELDERLY' ? 'default' :
                            beneficiary.category === 'PREGNANT_MOTHER' ? 'secondary' :
                            beneficiary.category === 'STUDENT' ? 'outline' : 'default'
                          }>
                            {beneficiary.category === 'ELDERLY' ? 'Lansia' :
                             beneficiary.category === 'PREGNANT_MOTHER' ? 'Ibu Hamil' :
                             beneficiary.category === 'STUDENT' ? 'Siswa' :
                             beneficiary.category === 'TODDLER' ? 'Balita' :
                             beneficiary.category === 'DISABLED' ? 'Disabilitas' : beneficiary.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {beneficiary.address}
                        </p>
                        <div className="flex items-center gap-4 text-sm">
                          <span>ID: {beneficiary.idNumber}</span>
                          {beneficiary.phone && <span>Tel: {beneficiary.phone}</span>}
                          <span>Terakhir: {beneficiary.lastDistribution || 'Belum pernah'}</span>
                        </div>
                      </div>
                      <Badge variant={beneficiary.isActive ? 'default' : 'secondary'}>
                        {beneficiary.isActive ? 'Aktif' : 'Nonaktif'}
                      </Badge>
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