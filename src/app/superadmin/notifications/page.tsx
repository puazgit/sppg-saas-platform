import { Metadata } from 'next'
import { Notifications as SuperAdminNotifications } from '@/features/superadmin'

export const metadata: Metadata = {
  title: 'Notifikasi - SuperAdmin | SPPG Platform',
  description: 'Kelola semua notifikasi sistem dan alert platform'
}

export default function NotificationsPage() {
  return <SuperAdminNotifications />
}