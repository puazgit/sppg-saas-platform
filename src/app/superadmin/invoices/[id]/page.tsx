'use client'

import { InvoiceDetail } from '@/features/superadmin/payment-billing'
import { useRouter } from 'next/navigation'

interface InvoiceDetailPageProps {
  params: {
    id: string
  }
}

export default function InvoiceDetailPage({ params }: InvoiceDetailPageProps) {
  const router = useRouter()

  return (
    <InvoiceDetail 
      invoiceId={params.id}
      onBack={() => router.push('/superadmin/invoices')}
    />
  )
}