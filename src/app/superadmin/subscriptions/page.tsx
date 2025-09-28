import { Metadata } from 'next'
import { Suspense } from 'react'
import { SubscriptionManagementPage } from '@/features/superadmin/subscription-management'
import { Skeleton } from '@/components/ui/skeleton'

export const metadata: Metadata = {
  title: 'Subscription Management - SuperAdmin',
  description: 'Kelola subscription dan paket berlangganan SPPG'
}

function SubscriptionManagementSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-64 bg-slate-200 dark:bg-slate-700" />
        <Skeleton className="h-10 w-40 bg-slate-200 dark:bg-slate-700" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-32 bg-slate-200 dark:bg-slate-700" />
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-64 bg-slate-200 dark:bg-slate-700" />
        <Skeleton className="h-64 bg-slate-200 dark:bg-slate-700" />
      </div>
      
      <Skeleton className="h-96 bg-slate-200 dark:bg-slate-700" />
    </div>
  )
}

export default function SuperAdminSubscriptionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Subscription Management</h1>
          <p className="text-slate-600 dark:text-slate-400">Kelola subscription dan paket berlangganan SPPG</p>
        </div>
      </div>

      <Suspense fallback={<SubscriptionManagementSkeleton />}>
        <SubscriptionManagementPage />
      </Suspense>
    </div>
  )
}