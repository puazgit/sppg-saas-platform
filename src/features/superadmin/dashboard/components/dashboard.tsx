"use client"

import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  DashboardOverview, 
  RegionalDistribution, 
  SubscriptionAnalytics, 
  RecentActivities 
} from './'

export default function SuperAdminDashboard() {
  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">SuperAdmin Dashboard</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Monitor platform performance, users, dan revenue dalam satu tempat
          </p>
        </div>
      </div>

      <Suspense fallback={<DashboardOverviewSkeleton />}>
        <DashboardOverview />
      </Suspense>

      <div className="grid gap-6 md:grid-cols-2">
        <Suspense fallback={<RegionalDistributionSkeleton />}>
          <RegionalDistribution />
        </Suspense>
        
        <Suspense fallback={<SubscriptionAnalyticsSkeleton />}>
          <SubscriptionAnalytics />
        </Suspense>
      </div>

      <Suspense fallback={<RecentActivitiesSkeleton />}>
        <RecentActivities />
      </Suspense>
    </div>
  )
}

function DashboardOverviewSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-6 border border-slate-200 dark:border-slate-700 rounded-lg space-y-4 bg-white dark:bg-slate-900">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-3 w-20" />
          </div>
        ))}
      </div>
      <div className="p-6 border rounded-lg space-y-4">
        <Skeleton className="h-6 w-32" />
        <div className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-8 w-12" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function RegionalDistributionSkeleton() {
  return (
    <div className="p-6 border rounded-lg space-y-4">
      <div className="flex justify-between items-center">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-5 w-16" />
      </div>
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-12" />
            </div>
            <Skeleton className="h-2 w-full" />
          </div>
        ))}
      </div>
    </div>
  )
}

function SubscriptionAnalyticsSkeleton() {
  return (
    <div className="p-6 border rounded-lg space-y-4">
      <div className="flex justify-between items-center">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-5 w-16" />
      </div>
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Skeleton className="w-3 h-3 rounded-full" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-4 w-12" />
            </div>
            <Skeleton className="h-2 w-full" />
          </div>
        ))}
      </div>
    </div>
  )
}

function RecentActivitiesSkeleton() {
  return (
    <div className="p-6 border rounded-lg space-y-4">
      <div className="flex justify-between items-center">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-5 w-16" />
      </div>
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex gap-3 p-3 border rounded-lg">
            <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-12" />
              </div>
              <Skeleton className="h-3 w-full" />
              <div className="flex justify-between">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}