'use client'

import { useState } from 'react'
import {
  MoreHorizontal,
  Eye,
  Edit,
  RefreshCw,
  Download,
  Search,
  Filter
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  usePayments,
  usePaymentBillingStore,
  useUpdatePayment,
  useRefundPayment,
  formatCurrency,
  formatPaymentDate,
  PAYMENT_STATUS_LABELS,
  PAYMENT_STATUS_COLORS,
  PAYMENT_METHOD_LABELS,
  PAYMENT_GATEWAY_LABELS,
  getPaymentFilterOptions,
  type PaymentState
} from '@/features/superadmin/payment-billing'

interface PaymentListProps {
  className?: string
  onSelectPayment?: (paymentId: string) => void
}

export function PaymentList({ className }: PaymentListProps) {
  const [showFilters, setShowFilters] = useState(false)
  
  const {
    paymentFilters,
    setPaymentFilters,
    resetPaymentFilters,
    isLoadingPayments
  } = usePaymentBillingStore()

  const { data: paymentsData, isLoading } = usePayments(paymentFilters)
  const updatePaymentMutation = useUpdatePayment()
  const refundPaymentMutation = useRefundPayment()

  const loading = isLoading || isLoadingPayments
  const filterOptions = getPaymentFilterOptions()

  const handleSearchChange = (value: string) => {
    setPaymentFilters({ search: value, page: 1 })
  }

  const handleStatusChange = (value: string) => {
    setPaymentFilters({ 
      status: value === 'all' ? undefined : value as PaymentState['status'],
      page: 1 
    })
  }

  const handleMethodChange = (value: string) => {
    setPaymentFilters({ 
      method: value === 'all' ? undefined : value as PaymentState['method'],
      page: 1 
    })
  }

  const handlePageChange = (page: number) => {
    setPaymentFilters({ page })
  }

  const handleUpdatePaymentStatus = async (paymentId: string, status: PaymentState['status']) => {
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

  const handleRefundPayment = async (paymentId: string, amount: number) => {
    try {
      await refundPaymentMutation.mutateAsync({
        id: paymentId,
        data: {
          amount,
          reason: 'Refund manual dari admin',
          metadata: { refundedBy: 'admin', refundDate: new Date().toISOString() }
        }
      })
    } catch (error) {
      console.error('Failed to refund payment:', error)
    }
  }

  if (loading && !paymentsData) {
    return (
      <Card className={className}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-9 w-32" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">Manajemen Pembayaran</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Quick Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari payment ID, invoice, atau SPPG..."
                value={paymentFilters.search || ''}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <Select value={paymentFilters.status || 'all'} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              {filterOptions.status.map((option: { value: string, label: string }) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={paymentFilters.method || 'all'} onValueChange={handleMethodChange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Method</SelectItem>
              {filterOptions.method.map((option: { value: string, label: string }) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        {/* Advanced Filters */}
        {showFilters && (
          <div className="mb-6 p-4 border rounded-lg bg-muted/50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Gateway</label>
                <Select value={paymentFilters.gateway || 'all'} onValueChange={(value) => setPaymentFilters({ gateway: value === 'all' ? undefined : (value as PaymentState['gateway']) || undefined, page: 1 })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Gateway" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Gateway</SelectItem>
                    {filterOptions.gateway.map((option: { value: string, label: string }) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Amount Range</label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={paymentFilters.amountMin || ''}
                    onChange={(e) => setPaymentFilters({ amountMin: e.target.value ? parseFloat(e.target.value) : undefined, page: 1 })}
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    value={paymentFilters.amountMax || ''}
                    onChange={(e) => setPaymentFilters({ amountMax: e.target.value ? parseFloat(e.target.value) : undefined, page: 1 })}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Sort By</label>
                <Select value={paymentFilters.sortBy} onValueChange={(value) => setPaymentFilters({ sortBy: value as 'createdAt' | 'paidAt' | 'amount' | 'status', page: 1 })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {filterOptions.sortBy.map((option: { value: string, label: string }) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-between items-center mt-4">
              <Button variant="outline" size="sm" onClick={resetPaymentFilters}>
                Reset Filters
              </Button>
              <div className="text-sm text-muted-foreground">
                {paymentsData?.totalCount || 0} payments ditemukan
              </div>
            </div>
          </div>
        )}

        {/* Payment Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Payment ID</TableHead>
                <TableHead>Invoice</TableHead>
                <TableHead>SPPG</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Gateway</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                  </TableRow>
                ))
              ) : paymentsData?.payments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                    Tidak ada data pembayaran
                  </TableCell>
                </TableRow>
              ) : (
                paymentsData?.payments.map((payment: PaymentState) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-mono text-sm">
                      {payment.id.slice(-8)}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {payment.invoice?.invoiceNumber || payment.invoiceId.slice(-8)}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{payment.subscription?.sppgId || 'N/A'}</p>
                        <p className="text-sm text-muted-foreground">{payment.subscription?.tier}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-semibold">{formatCurrency(payment.amount)}</p>
                        {payment.processingFee && (
                          <p className="text-xs text-muted-foreground">
                            Fee: {formatCurrency(payment.processingFee)}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {PAYMENT_METHOD_LABELS[payment.method]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {payment.gateway ? (
                        <Badge variant="secondary">
                          {PAYMENT_GATEWAY_LABELS[payment.gateway]}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={PAYMENT_STATUS_COLORS[payment.status]}>
                        {PAYMENT_STATUS_LABELS[payment.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{formatPaymentDate(payment.createdAt)}</p>
                        {payment.paidAt && (
                          <p className="text-xs text-green-600">
                            Paid: {formatPaymentDate(payment.paidAt)}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View Detail
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {payment.status === 'PENDING' && (
                            <DropdownMenuItem 
                              onClick={() => handleUpdatePaymentStatus(payment.id, 'COMPLETED')}
                              disabled={updatePaymentMutation.isPending}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Mark as Paid
                            </DropdownMenuItem>
                          )}
                          {payment.status === 'COMPLETED' && (
                            <DropdownMenuItem 
                              onClick={() => handleRefundPayment(payment.id, payment.amount)}
                              disabled={refundPaymentMutation.isPending}
                              className="text-red-600"
                            >
                              <RefreshCw className="h-4 w-4 mr-2" />
                              Refund
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {paymentsData && paymentsData.totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Menampilkan {((paymentsData.currentPage - 1) * paymentFilters.limit) + 1} - {Math.min(paymentsData.currentPage * paymentFilters.limit, paymentsData.totalCount)} dari {paymentsData.totalCount} payments
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(paymentsData.currentPage - 1)}
                disabled={!paymentsData.hasPreviousPage || loading}
              >
                Previous
              </Button>
              <span className="text-sm">
                Page {paymentsData.currentPage} of {paymentsData.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(paymentsData.currentPage + 1)}
                disabled={!paymentsData.hasNextPage || loading}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}