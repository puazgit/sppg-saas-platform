'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  BillingOverview, 
  PaymentList, 
  InvoiceList 
} from '@/features/superadmin/payment-billing'

export default function PaymentBillingPage() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Payment & Billing Management</h1>
        <p className="text-muted-foreground dark:text-gray-300">
          Kelola pembayaran, invoice, dan analytics billing platform SPPG
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview & Analytics</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <BillingOverview />
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <PaymentList />
        </TabsContent>

        <TabsContent value="invoices" className="space-y-4">
          <InvoiceList />
        </TabsContent>
      </Tabs>
    </div>
  )
}