/**
 * SPPG Subscription Flow Page
 * Enterprise-level subscription process untuk organisasi SPPG
 */

import { Suspense } from 'react'
import SubscriptionFlow from '@/features/subscription/components/subscription-flow'

export default function SubscriptionPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat halaman berlangganan...</p>
        </div>
      </div>
    }>
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Berlangganan SPPG Platform
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Mulai transformasi digital organisasi SPPG Anda dengan platform enterprise terdepan untuk manajemen nutrisi dan distribusi makanan
              </p>
            </div>
            
            <SubscriptionFlow />
          </div>
        </div>
      </main>
    </Suspense>
  )
}