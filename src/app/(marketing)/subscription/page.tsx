/**
 * SPPG Subscription Flow Page
 * Enterprise-level subscription process untuk organisasi SPPG
 */

'use client'

import { Suspense, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import SubscriptionFlow from '@/features/subscription/components/subscription-flow'
import { useSubscriptionStore } from '@/features/subscription/store/subscription.store'

function SubscriptionPageContent() {
  const { resetState } = useSubscriptionStore()
  const searchParams = useSearchParams()

  // Reset state when entering subscription page, unless it's a continuation
  useEffect(() => {
    const isReturning = searchParams.get('continue') === 'true'
    
    if (!isReturning) {
      console.log('[Subscription Page] Resetting state for new subscription flow')
      resetState()
    } else {
      console.log('[Subscription Page] Continuing existing subscription flow')
    }
  }, [resetState, searchParams])

  return (
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
  )
}

export default function SubscriptionPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <SubscriptionPageContent />
    </Suspense>
  )
}