'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Plus, 
  Calendar, 
  ChefHat, 
  Truck, 
  Package, 
  FileText, 
  Users,
  ClipboardList
} from 'lucide-react'
import Link from 'next/link'

const quickActions = [
  {
    title: 'Buat Menu Baru',
    description: 'Tambah menu ke database',
    icon: ChefHat,
    href: '/sppg/menu-planning/create',
    color: 'bg-blue-500 hover:bg-blue-600'
  },
  {
    title: 'Planning Menu',
    description: 'Rencanakan menu mingguan',
    icon: Calendar,
    href: '/sppg/menu-planning',
    color: 'bg-green-500 hover:bg-green-600'
  },
  {
    title: 'Mulai Produksi',
    description: 'Catat produksi hari ini',
    icon: ClipboardList,
    href: '/sppg/production/today',
    color: 'bg-orange-500 hover:bg-orange-600'
  },
  {
    title: 'Distribusi',
    description: 'Kelola distribusi makanan',
    icon: Truck,
    href: '/sppg/distribution',
    color: 'bg-purple-500 hover:bg-purple-600'
  },
  {
    title: 'Cek Inventori',
    description: 'Periksa stok bahan baku',
    icon: Package,
    href: '/sppg/inventory',
    color: 'bg-yellow-500 hover:bg-yellow-600'
  },
  {
    title: 'Tambah Staff',
    description: 'Daftarkan staff baru',
    icon: Users,
    href: '/sppg/staff/create',
    color: 'bg-teal-500 hover:bg-teal-600'
  },
  {
    title: 'Laporan Harian',
    description: 'Generate laporan hari ini',
    icon: FileText,
    href: '/sppg/reports/daily',
    color: 'bg-red-500 hover:bg-red-600'
  }
]

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Aksi Cepat
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {quickActions.map((action) => (
          <Button
            key={action.href}
            asChild
            variant="ghost"
            className="w-full justify-start h-auto p-3 hover:bg-gray-50"
          >
            <Link href={action.href}>
              <div className="flex items-center gap-3 w-full">
                <div className={`p-2 rounded-lg text-white ${action.color}`}>
                  <action.icon className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-sm">{action.title}</p>
                  <p className="text-xs text-gray-500">{action.description}</p>
                </div>
              </div>
            </Link>
          </Button>
        ))}
      </CardContent>
    </Card>
  )
}