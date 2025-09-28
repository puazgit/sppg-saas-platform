import { Metadata } from 'next'
import { SPPGManagement } from '@/features/superadmin'

export const metadata: Metadata = {
  title: 'Kelola SPPG - SuperAdmin | SPPG Platform',
  description: 'Manage dan monitor semua organisasi SPPG'
}

export default function SPPGPage() {
  return <SPPGManagement />
}