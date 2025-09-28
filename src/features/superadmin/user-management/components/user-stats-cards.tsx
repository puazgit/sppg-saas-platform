import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, UserCheck, UserX, UserPlus, Shield, Building2 } from 'lucide-react'
import type { UserStats } from '../types'

interface UserStatsCardsProps {
  stats: UserStats | null
}

const UserStatsCards = React.memo<UserStatsCardsProps>(function UserStatsCards({ stats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
      {/* Total Users Card */}
      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Total Users
          </CardTitle>
          <Users className="h-4 w-4 text-slate-500 dark:text-slate-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {stats?.total ?? 0}
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Registered users
          </p>
        </CardContent>
      </Card>

      {/* SuperAdmin Users Card */}
      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">
            SuperAdmin
          </CardTitle>
          <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {stats?.superAdmins ?? 0}
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Platform administrators
          </p>
        </CardContent>
      </Card>

      {/* SPPG Users Card */}
      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">
            SPPG Users
          </CardTitle>
          <Building2 className="h-4 w-4 text-purple-600 dark:text-purple-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {stats?.sppgUsers ?? 0}
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            SPPG organization members
          </p>
        </CardContent>
      </Card>

      {/* Active Users Card */}
      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Active Users
          </CardTitle>
          <UserCheck className="h-4 w-4 text-green-600 dark:text-green-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {stats?.activeUsers ?? 0}
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Currently active
          </p>
        </CardContent>
      </Card>

      {/* Inactive Users Card */}
      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Inactive Users
          </CardTitle>
          <UserX className="h-4 w-4 text-red-600 dark:text-red-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {stats?.inactiveUsers ?? 0}
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Need activation
          </p>
        </CardContent>
      </Card>

      {/* Recent Logins Card */}
      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Recent Logins
          </CardTitle>
          <UserPlus className="h-4 w-4 text-orange-600 dark:text-orange-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {stats?.recentLogins ?? 0}
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Last 7 days activity
          </p>
        </CardContent>
      </Card>
    </div>
  )
})

UserStatsCards.displayName = 'UserStatsCards'

export default UserStatsCards