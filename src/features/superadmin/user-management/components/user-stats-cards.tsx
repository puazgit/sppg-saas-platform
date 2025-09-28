import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Users, UserX, UserPlus, Shield, Building2 } from 'lucide-react'
import type { UserStats } from '../types'

interface UserStatsCardsProps {
  stats: UserStats | null
}

const UserStatsCards = React.memo<UserStatsCardsProps>(function UserStatsCards({ stats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Users Card */}
      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Users</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {stats?.total ?? 0}
              </p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>

      {/* SuperAdmin Users Card */}
      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">SuperAdmin</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {stats?.superAdmins ?? 0}
              </p>
            </div>
            <Shield className="w-8 h-8 text-purple-600" />
          </div>
        </CardContent>
      </Card>

      {/* SPPG Users Card */}
      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">SPPG Users</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {stats?.sppgUsers ?? 0}
              </p>
            </div>
            <Building2 className="w-8 h-8 text-green-600" />
          </div>
        </CardContent>
      </Card>

      {/* Active Users Card */}
      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Active Users</p>
              <p className="text-2xl font-bold text-emerald-600">
                {stats?.activeUsers ?? 0}
              </p>
            </div>
            <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-emerald-600 rounded-full animate-pulse"></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inactive Users Card */}
      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Inactive Users</p>
              <p className="text-2xl font-bold text-red-600">
                {stats?.inactiveUsers ?? 0}
              </p>
            </div>
            <UserX className="w-8 h-8 text-red-600" />
          </div>
        </CardContent>
      </Card>

      {/* Recent Logins Card */}
      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Recent Logins</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {stats?.recentLogins ?? 0}
              </p>
            </div>
            <UserPlus className="w-8 h-8 text-orange-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
})

UserStatsCards.displayName = 'UserStatsCards'

export default UserStatsCards