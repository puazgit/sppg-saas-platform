'use client'

import { useState } from 'react'
import {
  ArrowLeft,
  Download,
  RefreshCw,
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  usePaymentDetail,
  useUpdatePayment,
  useRefundPayment,
  formatCurrency,
  formatPaymentDate,
  PAYMENT_STATUS_LABELS,
  PAYMENT_STATUS_COLORS,
  PAYMENT_METHOD_LABELS,
  PAYMENT_GATEWAY_LABELS,
  type PaymentState
} from '@/features/superadmin/payment-billing'

interface PaymentDetailProps {
  paymentId: string
  onBack?: () => void
  className?: string
}

const statusIcons = {
  PENDING: Clock,
  PROCESSING: RefreshCw,
  COMPLETED: CheckCircle,
  FAILED: XCircle,
  CANCELLED: XCircle,
  REFUNDED: RefreshCw,
  PARTIAL_REFUND: AlertCircle
}

export function PaymentDetail({ paymentId, onBack, className }: PaymentDetailProps) {
  const [refundDialogOpen, setRefundDialogOpen] = useState(false)
  const [refundAmount, setRefundAmount] = useState('')
  const [refundReason, setRefundReason] = useState('')
  
  const { data: payment, isLoading } = usePaymentDetail(paymentId)
  const updatePaymentMutation = useUpdatePayment()
  const refundPaymentMutation = useRefundPayment()

  const handleStatusUpdate = async (status: PaymentState['status']) => {
    try {
      await updatePaymentMutation.mutateAsync({
        id: paymentId,
        data: { 
          status,
          paidAt: status === 'COMPLETED' ? new Date().toISOString() : undefined
        }
      })
    } catch (error) {
      console.error('Failed to update payment status:', error)
    }
  }

  const handleRefund = async () => {
    try {
      await refundPaymentMutation.mutateAsync({
        id: paymentId,
        data: {
          amount: parseFloat(refundAmount),
          reason: refundReason,
          metadata: { 
            refundedBy: 'admin',
            refundDate: new Date().toISOString()
          }
        }
      })
      setRefundDialogOpen(false)
      setRefundAmount('')
      setRefundReason('')
    } catch (error) {
      console.error('Failed to refund payment:', error)
    }
  }

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Skeleton className="h-9 w-9" />
            <Skeleton className="h-6 w-48" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
            <Skeleton className="h-48 w-full" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!payment) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center h-48">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium">Payment tidak ditemukan</p>
            <p className="text-sm text-muted-foreground">ID: {paymentId}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const StatusIcon = statusIcons[payment.status as keyof typeof statusIcons] || AlertCircle
  const maxRefundAmount = payment.amount - (payment.refundedAmount || 0)

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {onBack && (
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <div>
              <h1 className="text-2xl font-semibold">Payment Detail</h1>
              <p className="text-sm text-muted-foreground">ID: {payment.id}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download Receipt
            </Button>
            
            {payment.status === 'PENDING' && (
              <Button 
                size="sm"
                onClick={() => handleStatusUpdate('COMPLETED')}
                disabled={updatePaymentMutation.isPending}
              >
                Mark as Paid
              </Button>
            )}
            
            {payment.status === 'COMPLETED' && maxRefundAmount > 0 && (
              <Dialog open={refundDialogOpen} onOpenChange={setRefundDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refund
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Refund Payment</DialogTitle>
                    <DialogDescription>
                      Proses refund untuk payment {payment.id.slice(-8)}
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="refund-amount">Refund Amount</Label>
                      <Input
                        id="refund-amount"
                        type="number"
                        placeholder="0"
                        value={refundAmount}
                        onChange={(e) => setRefundAmount(e.target.value)}
                        max={maxRefundAmount}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Maximum: {formatCurrency(maxRefundAmount)}
                      </p>
                    </div>
                    
                    <div>
                      <Label htmlFor="refund-reason">Alasan Refund</Label>
                      <Textarea
                        id="refund-reason"
                        placeholder="Masukkan alasan refund..."
                        value={refundReason}
                        onChange={(e) => setRefundReason(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button 
                      variant="outline" 
                      onClick={() => setRefundDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleRefund}
                      disabled={!refundAmount || !refundReason || refundPaymentMutation.isPending}
                    >
                      Process Refund
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Status Card */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <StatusIcon className="h-8 w-8" />
                    <div>
                      <Badge className={PAYMENT_STATUS_COLORS[payment.status]}>
                        {PAYMENT_STATUS_LABELS[payment.status]}
                      </Badge>
                      <p className="text-sm text-muted-foreground mt-1">
                        {formatPaymentDate(payment.createdAt)}
                      </p>
                    </div>
                  </div>
                  
                  <Separator orientation="vertical" className="h-12" />
                  
                  <div>
                    <p className="text-2xl font-bold">{formatCurrency(payment.amount)}</p>
                    <p className="text-sm text-muted-foreground">
                      {PAYMENT_METHOD_LABELS[payment.method]}
                      {payment.gateway && ` via ${PAYMENT_GATEWAY_LABELS[payment.gateway]}`}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Payment Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Payment ID</span>
                    <span className="font-mono">{payment.id.slice(-12)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Invoice ID</span>
                    <span className="font-mono">{payment.invoiceId.slice(-12)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount</span>
                    <span className="font-semibold">{formatCurrency(payment.amount)}</span>
                  </div>
                  
                  {payment.processingFee && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Processing Fee</span>
                      <span>{formatCurrency(payment.processingFee)}</span>
                    </div>
                  )}
                  
                  {payment.refundedAmount && payment.refundedAmount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Refunded</span>
                      <span className="text-red-600">-{formatCurrency(payment.refundedAmount)}</span>
                    </div>
                  )}
                  
                  <Separator />
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Method</span>
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      <span>{PAYMENT_METHOD_LABELS[payment.method]}</span>
                    </div>
                  </div>
                  
                  {payment.gateway && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Gateway</span>
                      <span>{PAYMENT_GATEWAY_LABELS[payment.gateway]}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Subscription Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subscription ID</span>
                    <span className="font-mono">{payment.subscriptionId.slice(-12)}</span>
                  </div>
                  
                  {payment.subscription && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">SPPG ID</span>
                        <span>{payment.subscription.sppgId}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tier</span>
                        <Badge variant="outline">{payment.subscription.tier}</Badge>
                      </div>
                    </>
                  )}
                  
                  <Separator />
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Created At</span>
                    <span>{formatPaymentDate(payment.createdAt)}</span>
                  </div>
                  
                  {payment.paidAt && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Paid At</span>
                      <span>{formatPaymentDate(payment.paidAt)}</span>
                    </div>
                  )}
                  
                  {payment.updatedAt && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Updated</span>
                      <span>{formatPaymentDate(payment.updatedAt)}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="details" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Technical Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {payment.gatewayTransactionId && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Gateway Transaction ID</span>
                    <span className="font-mono">{payment.gatewayTransactionId}</span>
                  </div>
                )}
                
                {payment.gatewayResponse && (
                  <div>
                    <span className="text-muted-foreground block mb-2">Gateway Response</span>
                    <pre className="bg-muted p-3 rounded-md text-sm overflow-auto">
                      {JSON.stringify(payment.gatewayResponse, null, 2)}
                    </pre>
                  </div>
                )}
                
                {payment.metadata && (
                  <div>
                    <span className="text-muted-foreground block mb-2">Metadata</span>
                    <pre className="bg-muted p-3 rounded-md text-sm overflow-auto">
                      {JSON.stringify(payment.metadata, null, 2)}
                    </pre>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 pb-3 border-b">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <Clock className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Payment Created</p>
                      <p className="text-sm text-muted-foreground">
                        {formatPaymentDate(payment.createdAt)}
                      </p>
                    </div>
                  </div>
                  
                  {payment.paidAt && (
                    <div className="flex items-center gap-3 pb-3 border-b">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">Payment Completed</p>
                        <p className="text-sm text-muted-foreground">
                          {formatPaymentDate(payment.paidAt)}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {payment.refundedAmount && payment.refundedAmount > 0 && (
                    <div className="flex items-center gap-3 pb-3 border-b">
                      <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                        <RefreshCw className="h-4 w-4 text-orange-600" />
                      </div>
                      <div>
                        <p className="font-medium">Refund Processed</p>
                        <p className="text-sm text-muted-foreground">
                          {formatCurrency(payment.refundedAmount)} refunded
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}