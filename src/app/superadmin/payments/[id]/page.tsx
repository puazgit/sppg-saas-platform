'use client'

import { PaymentDetail } from '@/features/superadmin/payment-billing'
import { useRouter } from 'next/navigation'

interface PaymentDetailPageProps {
  params: {
    id: string
  }
}

export default function PaymentDetailPage({ params }: PaymentDetailPageProps) {
  const router = useRouter()

  return (
    <PaymentDetail 
      paymentId={params.id}
      onBack={() => router.push('/superadmin/payments')}
    />
  )
}