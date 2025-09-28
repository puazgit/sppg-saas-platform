'use client'

import { Suspense } from 'react'
import { PaymentList } from '@/features/superadmin/payment-billing'

export default function PaymentsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Payment Management</h1>
              <p className="text-slate-600 mt-1">
                Kelola semua transaksi pembayaran platform SPPG
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <Suspense fallback={
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        }>
          <PaymentList />
        </Suspense>
      </div>
    </div>
  )
}