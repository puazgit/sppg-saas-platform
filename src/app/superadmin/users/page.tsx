import { Metadata } from 'next'
import { UserManagement } from '@/features/superadmin/user-management'

export const metadata: Metadata = {
  title: 'Manajemen Users - SuperAdmin | SPPG Platform',
  description: 'Kelola semua users di platform SPPG'
}

export default function UsersPage() {
  return <UserManagement />
}