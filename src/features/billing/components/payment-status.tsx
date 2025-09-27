/**
 * Payment Status Component
 * Real-time payment status tracking dengan detailed information
 */

'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  CheckCircle, Clock, XCircle, AlertCircle,
  CreditCard, Building2, Calendar, User,
  Download, RefreshCw, ExternalLink
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { BillingAPI, type PaymentDetails as ApiPaymentDetails, type BillingError } from '../services/billing-api'

interface PaymentStatusProps {
  paymentId?: string
  subscriptionId?: string
  invoiceId?: string
}

// Use the enterprise API types
type PaymentDetails = ApiPaymentDetails

export function PaymentStatus({ paymentId, subscriptionId, invoiceId }: PaymentStatusProps) {
  // Enterprise API integration with TanStack Query
  const { 
    data: paymentDetails, 
    isLoading, 
    error
  } = useQuery<PaymentDetails, BillingError>({
    queryKey: ['payment-status', { paymentId, subscriptionId, invoiceId }],
    queryFn: async () => {
      try {
        return await BillingAPI.getPaymentStatus(paymentId, subscriptionId, invoiceId)
      } catch (error) {
        console.error('[PaymentStatus] Failed to fetch payment details:', error)
        throw error
      }
    },
    enabled: !!(paymentId || subscriptionId || invoiceId),
    refetchInterval: (query) => {
      // Enterprise auto-refresh logic for pending payments
      const data = query.state.data
      return data?.status === 'PENDING' || data?.status === 'PROCESSING' ? 10000 : false
    },
    staleTime: 5000, // Consider data fresh for 5 seconds
    gcTime: 30000, // Keep in cache for 30 seconds
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800 border-green-200'
      case 'PROCESSING': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'FAILED': return 'bg-red-100 text-red-800 border-red-200'
      case 'CANCELLED': return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'REFUNDED': return 'bg-purple-100 text-purple-800 border-purple-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'PROCESSING': return <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />
      case 'PENDING': return <Clock className="w-5 h-5 text-yellow-600" />
      case 'FAILED': return <XCircle className="w-5 h-5 text-red-600" />
      case 'CANCELLED': return <XCircle className="w-5 h-5 text-gray-600" />
      case 'REFUNDED': return <RefreshCw className="w-5 h-5 text-purple-600" />
      default: return <AlertCircle className="w-5 h-5 text-gray-600" />
    }
  }

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'CREDIT_CARD': return <CreditCard className="w-5 h-5" />
      case 'BANK_TRANSFER': return <Building2 className="w-5 h-5" />
      default: return <CreditCard className="w-5 h-5" />
    }
  }

  const getProgressPercentage = (status: string) => {
    switch (status) {
      case 'PENDING': return 25
      case 'PROCESSING': return 75
      case 'COMPLETED': return 100
      case 'FAILED': return 0
      case 'CANCELLED': return 0
      case 'REFUNDED': return 100
      default: return 0
    }
  }

  if (isLoading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="h-4 w-4 bg-gray-200 rounded-full"></div>
                  <div className="h-4 bg-gray-200 rounded flex-1"></div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || !paymentDetails) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment Not Found</h3>
          <p className="text-gray-600 mb-4">
            {error?.message || 'The payment details could not be retrieved.'}
          </p>
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Payment Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getStatusIcon(paymentDetails.status)}
              <div>
                <CardTitle className="text-2xl">Payment Status</CardTitle>
                <p className="text-gray-600 mt-1">
                  Track your payment progress in real-time
                </p>
              </div>
            </div>
            <Badge className={`${getStatusColor(paymentDetails.status)} text-lg px-4 py-2`}>
              {paymentDetails.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-medium">
              <span>Progress</span>
              <span>{getProgressPercentage(paymentDetails.status)}%</span>
            </div>
            <Progress 
              value={getProgressPercentage(paymentDetails.status)} 
              className="h-2"
            />
          </div>

          {/* Payment Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Amount</p>
                  <p className="text-xl font-bold text-gray-900">
                    Rp {paymentDetails.amount.toLocaleString('id-ID')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {getMethodIcon(paymentDetails.method)}
                <div>
                  <p className="text-sm text-gray-600">Payment Method</p>
                  <p className="font-semibold text-gray-900">
                    {paymentDetails.method.replace('_', ' ')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Building2 className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Organization</p>
                  <p className="font-semibold text-gray-900">{paymentDetails.sppgName}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Reference</p>
                  <p className="font-mono text-sm text-gray-900">{paymentDetails.reference}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Created</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(paymentDetails.createdAt).toLocaleString('id-ID')}
                  </p>
                </div>
              </div>

              {paymentDetails.completedAt && (
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-600">Completed</p>
                    <p className="font-semibold text-gray-900">
                      {new Date(paymentDetails.completedAt).toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Error Message */}
          {paymentDetails.status === 'FAILED' && paymentDetails.failureReason && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-500 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-red-900">Payment Failed</h4>
                  <p className="text-red-700 mt-1">{paymentDetails.failureReason}</p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-3 pt-4 border-t">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download Receipt
            </Button>
            {paymentDetails.invoiceNumber && (
              <Button variant="outline">
                <ExternalLink className="w-4 h-4 mr-2" />
                View Invoice
              </Button>
            )}
            {(paymentDetails.status === 'PENDING' || paymentDetails.status === 'PROCESSING') && (
              <Button>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Status
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {paymentDetails.timeline.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-4"
              >
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  item.isCompleted 
                    ? 'bg-green-100 border-2 border-green-500' 
                    : 'bg-gray-100 border-2 border-gray-300'
                }`}>
                  {item.isCompleted ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <Clock className="w-4 h-4 text-gray-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold ${
                    item.isCompleted ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {item.status}
                  </p>
                  <p className={`text-sm mt-1 ${
                    item.isCompleted ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    {item.description}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(item.timestamp).toLocaleString('id-ID')}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}