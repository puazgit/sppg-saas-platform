import { ReactNode } from 'react'

interface SubscriptionLayoutProps {
  children: ReactNode
}

export default function SubscriptionLayout({ children }: SubscriptionLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto py-8">
        {children}
      </div>
    </div>
  )
}