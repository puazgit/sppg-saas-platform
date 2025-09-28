import { Metadata } from 'next'
import { Analytics as SuperAdminAnalytics } from '@/features/superadmin'

export const metadata: Metadata = {
  title: 'Analytics Dashboard - SuperAdmin | SPPG Platform',
  description: 'Comprehensive analytics dan business insights untuk platform SPPG'
}

export default function AnalyticsPage() {
  return <SuperAdminAnalytics />
}