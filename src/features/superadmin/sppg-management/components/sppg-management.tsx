'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Building2, Users, Calendar, Loader2 } from 'lucide-react'
import { useSppgList } from '../hooks'

export default function SPPGManagement() {
  const { data: sppgListData, isLoading, error } = useSppgList()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600 dark:text-gray-300">Memuat data SPPG...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-600 dark:text-red-400">Error loading SPPG data</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Muat Ulang
        </Button>
      </div>
    )
  }

  const stats = sppgListData?.stats

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Kelola SPPG</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Kelola organisasi SPPG yang terdaftar dalam platform
          </p>
        </div>
        <Button>
          <Building2 className="w-4 h-4 mr-2" />
          Tambah SPPG Baru
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total SPPG</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.total || 0}</p>
              </div>
              <Building2 className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">SPPG Aktif</p>
                <p className="text-2xl font-bold text-green-600">{stats?.active || 0}</p>
              </div>
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-green-600 rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Penerima Manfaat</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats?.totalBeneficiaries?.toLocaleString('id-ID') || '0'}
                </p>
              </div>
              <Users className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Anggaran Bulanan</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  Rp {stats?.totalMonthlyBudget ? 
                    (stats.totalMonthlyBudget / 1000000).toFixed(1) + 'M' : '0'}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="dark:text-white">Daftar SPPG</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Building2 className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <p>Belum ada data SPPG</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
