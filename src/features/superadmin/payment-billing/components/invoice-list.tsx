'use client'

import { useState } from 'react'
import {
  MoreHorizontal,
  Eye,
  Edit,
  Send,
  Download,
  Search,
  Filter,
  Trash2
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
  useInvoices,
  usePaymentBillingStore,
  useUpdateInvoice,
  useSendInvoice,
  useDeleteInvoice,
  formatCurrency,
  formatInvoiceDate,
  getDaysUntilDue,
  getDueDateStatus,
  getInvoiceFilterOptions,
  INVOICE_STATUS_LABELS,
  INVOICE_STATUS_COLORS,
  type InvoiceState
} from '@/features/superadmin/payment-billing'

interface InvoiceListProps {
  className?: string
}

export function InvoiceList({ className }: InvoiceListProps) {
  const [showFilters, setShowFilters] = useState(false)
  
  const {
    invoiceFilters,
    setInvoiceFilters,
    resetInvoiceFilters,
    isLoadingInvoices
  } = usePaymentBillingStore()

  const { data: invoicesData, isLoading } = useInvoices(invoiceFilters)
  const updateInvoiceMutation = useUpdateInvoice()
  const sendInvoiceMutation = useSendInvoice()
  const deleteInvoiceMutation = useDeleteInvoice()

  const loading = isLoading || isLoadingInvoices
  const filterOptions = getInvoiceFilterOptions()

  const handleSearchChange = (value: string) => {
    setInvoiceFilters({ search: value, page: 1 })
  }

  const handleStatusChange = (value: string) => {
    setInvoiceFilters({ 
      status: value === 'all' ? undefined : value as InvoiceState['status'],
      page: 1 
    })
  }

  const handlePageChange = (page: number) => {
    setInvoiceFilters({ page })
  }

  const handleUpdateInvoiceStatus = async (invoiceId: string, status: InvoiceState['status']) => {
    try {
      await updateInvoiceMutation.mutateAsync({
        id: invoiceId,
        data: { status }
      })
    } catch (error) {
      console.error('Failed to update invoice status:', error)
    }
  }

  const handleSendInvoice = async (invoiceId: string) => {
    try {
      await sendInvoiceMutation.mutateAsync({
        id: invoiceId,
        data: {
          email: 'sppg@example.com',
          message: 'Invoice terlampir untuk pembayaran langganan SPPG.'
        }
      })
    } catch (error) {
      console.error('Failed to send invoice:', error)
    }
  }

  const handleDeleteInvoice = async (invoiceId: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus invoice ini?')) {
      try {
        await deleteInvoiceMutation.mutateAsync(invoiceId)
      } catch (error) {
        console.error('Failed to delete invoice:', error)
      }
    }
  }

  if (loading && !invoicesData) {
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
          <CardTitle className="text-xl font-semibold">Manajemen Invoice</CardTitle>
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
            <Button size="sm">
              Buat Invoice
            </Button>
          </div>
        </div>

        {/* Quick Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari invoice number, SPPG, atau customer..."
                value={invoiceFilters.search || ''}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <Select value={invoiceFilters.status || 'all'} onValueChange={handleStatusChange}>
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
        </div>
      </CardHeader>

      <CardContent>
        {/* Advanced Filters */}
        {showFilters && (
          <div className="mb-6 p-4 border rounded-lg bg-muted/50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Amount Range</label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={invoiceFilters.amountMin || ''}
                    onChange={(e) => setInvoiceFilters({ amountMin: e.target.value ? parseFloat(e.target.value) : undefined, page: 1 })}
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    value={invoiceFilters.amountMax || ''}
                    onChange={(e) => setInvoiceFilters({ amountMax: e.target.value ? parseFloat(e.target.value) : undefined, page: 1 })}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Tanggal Range</label>
                <div className="flex gap-2">
                  <Input
                    type="date"
                    value={invoiceFilters.dateFrom || ''}
                    onChange={(e) => setInvoiceFilters({ dateFrom: e.target.value || undefined, page: 1 })}
                  />
                  <Input
                    type="date"
                    value={invoiceFilters.dateTo || ''}
                    onChange={(e) => setInvoiceFilters({ dateTo: e.target.value || undefined, page: 1 })}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Sort By</label>
                <Select value={invoiceFilters.sortBy} onValueChange={(value) => setInvoiceFilters({ sortBy: value as 'issueDate' | 'dueDate' | 'totalAmount' | 'status', page: 1 })}>
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
              <Button variant="outline" size="sm" onClick={resetInvoiceFilters}>
                Reset Filters
              </Button>
              <div className="text-sm text-muted-foreground">
                {invoicesData?.totalCount || 0} invoices ditemukan
              </div>
            </div>
          </div>
        )}

        {/* Invoice Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>SPPG</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Issue Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Due Status</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                  </TableRow>
                ))
              ) : invoicesData?.invoices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    Tidak ada data invoice
                  </TableCell>
                </TableRow>
              ) : (
                invoicesData?.invoices.map((invoice: InvoiceState) => {
                  const dueStatus = getDueDateStatus(invoice.dueDate, invoice.paidAt)
                  const daysUntilDue = getDaysUntilDue(invoice.dueDate)
                  
                  return (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-mono text-sm font-medium">
                        {invoice.invoiceNumber}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{invoice.subscriptionId}</p>
                          <p className="text-sm text-muted-foreground">Tier: Premium</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-semibold">{formatCurrency(invoice.totalAmount)}</p>
                          {invoice.taxAmount > 0 && (
                            <p className="text-xs text-muted-foreground">
                              Tax: {formatCurrency(invoice.taxAmount)}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {formatInvoiceDate(invoice.issueDate)}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">{formatInvoiceDate(invoice.dueDate)}</p>
                          {!invoice.paidAt && (
                            <p className="text-xs text-muted-foreground">
                              {daysUntilDue >= 0 ? `${daysUntilDue} hari lagi` : `Terlambat ${Math.abs(daysUntilDue)} hari`}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={INVOICE_STATUS_COLORS[invoice.status]}>
                          {INVOICE_STATUS_LABELS[invoice.status]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {!invoice.paidAt && (
                          <Badge 
                            variant={dueStatus.status === 'overdue' ? 'destructive' : 
                                   dueStatus.status === 'due-soon' ? 'secondary' : 'outline'}
                          >
                            {dueStatus.label}
                          </Badge>
                        )}
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
                            <DropdownMenuItem>
                              <Download className="h-4 w-4 mr-2" />
                              Download PDF
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {(invoice.status === 'DRAFT' || invoice.status === 'SENT') && (
                              <>
                                <DropdownMenuItem>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit Invoice
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleSendInvoice(invoice.id)}
                                  disabled={sendInvoiceMutation.isPending}
                                >
                                  <Send className="h-4 w-4 mr-2" />
                                  Send Invoice
                                </DropdownMenuItem>
                              </>
                            )}
                            {invoice.status === 'SENT' && (
                              <DropdownMenuItem 
                                onClick={() => handleUpdateInvoiceStatus(invoice.id, 'PAID')}
                                disabled={updateInvoiceMutation.isPending}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Mark as Paid
                              </DropdownMenuItem>
                            )}
                            {invoice.status !== 'PAID' && (
                              <DropdownMenuItem 
                                onClick={() => handleDeleteInvoice(invoice.id)}
                                disabled={deleteInvoiceMutation.isPending}
                                className="text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {invoicesData && invoicesData.totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Menampilkan {((invoicesData.currentPage - 1) * invoiceFilters.limit) + 1} - {Math.min(invoicesData.currentPage * invoiceFilters.limit, invoicesData.totalCount)} dari {invoicesData.totalCount} invoices
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(invoicesData.currentPage - 1)}
                disabled={!invoicesData.hasPreviousPage || loading}
              >
                Previous
              </Button>
              <span className="text-sm">
                Page {invoicesData.currentPage} of {invoicesData.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(invoicesData.currentPage + 1)}
                disabled={!invoicesData.hasNextPage || loading}
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