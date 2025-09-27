/**
 * Billing Dashboard Component
 * Enterprise-level billing dashboard dengan real-time metrics
 */

'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  FileText, TrendingUp, Calendar, 
  Download, Eye, AlertCircle, CheckCircle,
  DollarSign, Users, Building2, Clock
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { BillingAPI, type BillingMetrics as DashboardMetrics, type BillingError } from '../services/billing-api'
// import { useBillingStore } from '../store/billing.store'

interface RecentInvoice {
  id: string
  sppgName: string
  amount: number
  status: 'PAID' | 'PENDING' | 'OVERDUE'
  dueDate: string
  createdAt: string
}

export function BillingDashboard() {
  // const { selectedPackage } = useBillingStore()

  // Enterprise dashboard metrics with proper error handling
  const { data: metrics, isLoading: metricsLoading, error } = useQuery<DashboardMetrics, BillingError>({
    queryKey: ['billing-dashboard-metrics'],
    queryFn: async () => {
      try {
        return await BillingAPI.getDashboardMetrics()
      } catch (error) {
        console.error('[BillingDashboard] Failed to fetch metrics:', error)
        throw error
      }
    },
    refetchInterval: 30000, // Enterprise auto-refresh
    staleTime: 10000, // Consider data fresh for 10 seconds
    gcTime: 60000 // Keep in cache for 1 minute
  })

  // Fetch recent invoices
  const { data: recentInvoices, isLoading: invoicesLoading } = useQuery<RecentInvoice[]>({
    queryKey: ['billing-recent-invoices'],
    queryFn: async () => {
      const response = await fetch('/api/billing/invoices/recent')
      if (!response.ok) throw new Error('Failed to fetch recent invoices')
      return response.json()
    }
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID': return 'bg-green-100 text-green-800'
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'OVERDUE': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PAID': return <CheckCircle className="w-4 h-4" />
      case 'PENDING': return <Clock className="w-4 h-4" />
      case 'OVERDUE': return <AlertCircle className="w-4 h-4" />
      default: return <FileText className="w-4 h-4" />
    }
  }

  // Enterprise error handling
  if (error) {
    return (
      <div className="max-w-4xl mx-auto text-center py-16">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-900 mb-4">
            Dashboard Data Unavailable
          </h2>
          <p className="text-red-700 mb-6">
            {error.message || 'Failed to load billing dashboard. Please try again later.'}
          </p>
          <Button onClick={() => window.location.reload()} className="bg-red-600 hover:bg-red-700 text-white">
            Reload Dashboard
          </Button>
        </div>
      </div>
    )
  }

  if (metricsLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Billing Dashboard</h1>
          <p className="text-gray-600 mt-1">Monitor your billing metrics and manage subscriptions</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          <Button size="sm">
            <Eye className="w-4 h-4 mr-2" />
            View Reports
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">
                    Rp {(metrics?.totalRevenue || 0).toLocaleString('id-ID')}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="flex items-center mt-4">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">
                  {metrics?.revenueGrowth ? `${metrics.revenueGrowth > 0 ? '+' : ''}${metrics.revenueGrowth.toFixed(1)}%` : '--'} from last month
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Subscriptions</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {metrics?.activeSubscriptions || 0}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="flex items-center mt-4">
                <TrendingUp className="w-4 h-4 text-blue-500 mr-1" />
                <span className="text-sm text-blue-600">
                  {metrics?.subscriptionGrowth ? `${metrics.subscriptionGrowth > 0 ? '+' : ''}${metrics.subscriptionGrowth.toFixed(1)}%` : '--'} from last month
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Invoices</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {metrics?.pendingInvoices || 0}
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <FileText className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
              <div className="flex items-center mt-4">
                <AlertCircle className="w-4 h-4 text-yellow-500 mr-1" />
                <span className="text-sm text-yellow-600">Requires attention</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Monthly Recurring</p>
                  <p className="text-2xl font-bold text-gray-900">
                    Rp {(metrics?.monthlyRecurring || 0).toLocaleString('id-ID')}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div className="flex items-center mt-4">
                <TrendingUp className="w-4 h-4 text-purple-500 mr-1" />
                <span className="text-sm text-purple-600">
                  {/* Real pending invoice trend from database - no hardcoded values */}
                  Requires real metrics from API
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Invoices */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Recent Invoices
          </CardTitle>
        </CardHeader>
        <CardContent>
          {invoicesLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {recentInvoices?.map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <Building2 className="w-8 h-8 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">{invoice.sppgName}</p>
                      <p className="text-sm text-gray-500">
                        Invoice #{invoice.id.slice(-8)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        Rp {invoice.amount.toLocaleString('id-ID')}
                      </p>
                      <p className="text-sm text-gray-500">
                        Due: {new Date(invoice.dueDate).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                    <Badge className={`${getStatusColor(invoice.status)} flex items-center gap-1`}>
                      {getStatusIcon(invoice.status)}
                      {invoice.status}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}