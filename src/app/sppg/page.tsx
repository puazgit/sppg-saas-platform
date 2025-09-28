'use client'

import { 
  DashboardStats, 
  OperationalOverview, 
  QuickActions, 
  RecentActivities 
} from '@/features/sppg/dashboard'

// SPPG Main Dashboard Page - Route Component Only
// Business logic ada di @/features/sppg sesuai DEVELOPMENT_AGREEMENT.md
export default function SppgPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Operasional</h1>
        <p className="text-sm text-gray-600">
          Overview harian operasional SPPG dan metrics utama
        </p>
      </div>

      {/* Dashboard Stats from Feature */}
      <DashboardStats />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Operational Overview */}
        <div className="lg:col-span-2">
          <OperationalOverview />
        </div>
        
        {/* Right Column - Quick Actions & Recent Activities */}
        <div className="space-y-6">
          <QuickActions />
          <RecentActivities />
        </div>
      </div>
    </div>
  )
}