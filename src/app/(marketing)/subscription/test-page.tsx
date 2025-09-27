/**
 * Simple test page untuk debug subscription issues
 */

'use client'

import { useSearchParams } from 'next/navigation'

export default function TestSubscriptionPage() {
  const searchParams = useSearchParams()
  const packageParam = searchParams.get('package')
  const billingParam = searchParams.get('billing')

  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-2xl font-bold mb-4">Test Subscription Page</h1>
      <div className="space-y-2">
        <p>Package: {packageParam || 'Not specified'}</p>
        <p>Billing: {billingParam || 'Not specified'}</p>
        <p>URL: {typeof window !== 'undefined' ? window.location.href : 'SSR'}</p>
        <p>Time: {new Date().toISOString()}</p>
      </div>
    </div>
  )
}