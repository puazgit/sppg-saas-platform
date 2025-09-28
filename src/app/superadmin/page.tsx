import { Metadata } from 'next'
import { SuperAdminDashboard } from '@/features/superadmin'

export const metadata: Metadata = {
  title: 'SuperAdmin - SPPG Platform',
  description: 'Dashboard manajemen sistem SPPG Platform untuk SuperAdmin'
}

export default function SuperAdminPage() {
  return <SuperAdminDashboard />
}