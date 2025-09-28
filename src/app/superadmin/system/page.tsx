import { Metadata } from 'next'
import { System as SuperAdminSystem } from '@/features/superadmin'

export const metadata: Metadata = {
  title: 'Sistem - SuperAdmin | SPPG Platform',
  description: 'Monitor dan kelola pengaturan platform'
}

export default function SystemPage() {
  return <SuperAdminSystem />
}