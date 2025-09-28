'use client'

import { useState } from 'react'
import {
  ArrowLeft,
  Download,
  Send,
  Edit,
  Trash2,
  FileText,
  CheckCircle,
  AlertCircle,
  Eye,
  Calendar
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  useInvoiceDetail,
  useUpdateInvoice,
  useSendInvoice,
  useDeleteInvoice,
  formatCurrency,
  formatInvoiceDate,
  getDaysUntilDue,
  getDueDateStatus,
  INVOICE_STATUS_LABELS,
  INVOICE_STATUS_COLORS,
  type InvoiceState,
  type InvoiceItemState
} from '@/features/superadmin/payment-billing'

interface InvoiceDetailProps {
  invoiceId: string
  onBack?: () => void
  className?: string
}

const statusIcons = {
  DRAFT: FileText,
  SENT: Send,
  VIEWED: Eye,
  OVERDUE: AlertCircle,
  PAID: CheckCircle,
  CANCELLED: AlertCircle,
  REFUNDED: AlertCircle
}

export function InvoiceDetail({ invoiceId, onBack, className }: InvoiceDetailProps) {
  const [sendDialogOpen, setSendDialogOpen] = useState(false)
  const [sendEmail, setSendEmail] = useState('')
  const [sendMessage, setSendMessage] = useState('')
  
  const { data: invoice, isLoading } = useInvoiceDetail(invoiceId)
  const updateInvoiceMutation = useUpdateInvoice()
  const sendInvoiceMutation = useSendInvoice()
  const deleteInvoiceMutation = useDeleteInvoice()

  const handleStatusUpdate = async (status: InvoiceState['status']) => {
    try {
      await updateInvoiceMutation.mutateAsync({
        id: invoiceId,
        data: { status }
      })
    } catch (error) {
      console.error('Failed to update invoice status:', error)
    }
  }

  const handleSendInvoice = async () => {
    try {
      await sendInvoiceMutation.mutateAsync({
        id: invoiceId,
        data: {
          email: sendEmail,
          message: sendMessage
        }
      })
      setSendDialogOpen(false)
      setSendEmail('')
      setSendMessage('')
    } catch (error) {
      console.error('Failed to send invoice:', error)
    }
  }

  const handleDeleteInvoice = async () => {
    if (confirm('Apakah Anda yakin ingin menghapus invoice ini?')) {
      try {
        await deleteInvoiceMutation.mutateAsync(invoiceId)
        onBack?.()
      } catch (error) {
        console.error('Failed to delete invoice:', error)
      }
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

  if (!invoice) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center h-48">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium">Invoice tidak ditemukan</p>
            <p className="text-sm text-muted-foreground">ID: {invoiceId}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const StatusIcon = statusIcons[invoice.status as keyof typeof statusIcons] || FileText
  const dueStatus = getDueDateStatus(invoice.dueDate, invoice.paidAt)
  const daysUntilDue = getDaysUntilDue(invoice.dueDate)
  const subtotal = invoice.totalAmount - (invoice.taxAmount || 0)

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
              <h1 className="text-2xl font-semibold">Invoice Detail</h1>
              <p className="text-sm text-muted-foreground"># {invoice.invoiceNumber}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
            
            {(invoice.status === 'DRAFT' || invoice.status === 'SENT') && (
              <>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                
                <Dialog open={sendDialogOpen} onOpenChange={setSendDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Send className="h-4 w-4 mr-2" />
                      Send Invoice
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Send Invoice</DialogTitle>
                      <DialogDescription>
                        Kirim invoice {invoice.invoiceNumber} ke customer
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="send-email">Email</Label>
                        <Input
                          id="send-email"
                          type="email"
                          placeholder="customer@example.com"
                          value={sendEmail}
                          onChange={(e) => setSendEmail(e.target.value)}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="send-message">Pesan (Optional)</Label>
                        <Textarea
                          id="send-message"
                          placeholder="Pesan untuk customer..."
                          value={sendMessage}
                          onChange={(e) => setSendMessage(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button 
                        variant="outline" 
                        onClick={() => setSendDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleSendInvoice}
                        disabled={!sendEmail || sendInvoiceMutation.isPending}
                      >
                        Send Invoice
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </>
            )}
            
            {invoice.status === 'SENT' && (
              <Button 
                size="sm"
                onClick={() => handleStatusUpdate('PAID')}
                disabled={updateInvoiceMutation.isPending}
              >
                Mark as Paid
              </Button>
            )}
            
            {invoice.status !== 'PAID' && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleDeleteInvoice}
                disabled={deleteInvoiceMutation.isPending}
                className="text-red-600 border-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="items">Items</TabsTrigger>
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
                      <Badge className={INVOICE_STATUS_COLORS[invoice.status]}>
                        {INVOICE_STATUS_LABELS[invoice.status]}
                      </Badge>
                      <p className="text-sm text-muted-foreground mt-1">
                        Issue: {formatInvoiceDate(invoice.issueDate)}
                      </p>
                    </div>
                  </div>
                  
                  <Separator orientation="vertical" className="h-12" />
                  
                  <div>
                    <p className="text-2xl font-bold">{formatCurrency(invoice.totalAmount)}</p>
                    <p className="text-sm text-muted-foreground">
                      Due: {formatInvoiceDate(invoice.dueDate)}
                      {!invoice.paidAt && (
                        <span className="ml-2">
                          ({daysUntilDue >= 0 ? `${daysUntilDue} hari lagi` : `Terlambat ${Math.abs(daysUntilDue)} hari`})
                        </span>
                      )}
                    </p>
                  </div>
                  
                  {!invoice.paidAt && (
                    <>
                      <Separator orientation="vertical" className="h-12" />
                      <Badge 
                        variant={dueStatus.status === 'overdue' ? 'destructive' : 
                               dueStatus.status === 'due-soon' ? 'secondary' : 'outline'}
                      >
                        {dueStatus.label}
                      </Badge>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Invoice Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Invoice Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Invoice Number</span>
                    <span className="font-mono">{invoice.invoiceNumber}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subscription ID</span>
                    <span className="font-mono">{invoice.subscriptionId.slice(-12)}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Issue Date</span>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{formatInvoiceDate(invoice.issueDate)}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Due Date</span>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{formatInvoiceDate(invoice.dueDate)}</span>
                    </div>
                  </div>
                  
                  {invoice.paidAt && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Paid At</span>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>{formatInvoiceDate(invoice.paidAt)}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Billing Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  
                  {invoice.taxAmount && invoice.taxAmount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax</span>
                      <span>{formatCurrency(invoice.taxAmount)}</span>
                    </div>
                  )}
                  
                  <Separator />
                  
                  <div className="flex justify-between font-semibold">
                    <span>Total Amount</span>
                    <span>{formatCurrency(invoice.totalAmount)}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Billing Period</span>
                    <span>
                      {formatInvoiceDate(invoice.billingPeriodStart)} - {formatInvoiceDate(invoice.billingPeriodEnd)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="items" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Invoice Items</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-center">Quantity</TableHead>
                      <TableHead className="text-right">Unit Price</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoice.items?.map((item: InvoiceItemState, index: number) => (
                      <TableRow key={index}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{item.description}</p>
                            {item.metadata && (
                              <p className="text-sm text-muted-foreground">
                                {JSON.stringify(item.metadata)}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">{item.quantity}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.unitPrice)}</TableCell>
                        <TableCell className="text-right font-semibold">
                          {formatCurrency(item.quantity * item.unitPrice)}
                        </TableCell>
                      </TableRow>
                    ))}
                    
                    {(!invoice.items || invoice.items.length === 0) && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                          No items found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Invoice History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 pb-3 border-b">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <FileText className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Invoice Created</p>
                      <p className="text-sm text-muted-foreground">
                        {formatInvoiceDate(invoice.createdAt)}
                      </p>
                    </div>
                  </div>
                  
                  {invoice.sentAt && (
                    <div className="flex items-center gap-3 pb-3 border-b">
                      <div className="w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center">
                        <Send className="h-4 w-4 text-cyan-600" />
                      </div>
                      <div>
                        <p className="font-medium">Invoice Sent</p>
                        <p className="text-sm text-muted-foreground">
                          {formatInvoiceDate(invoice.sentAt)}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {invoice.viewedAt && (
                    <div className="flex items-center gap-3 pb-3 border-b">
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                        <Eye className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium">Invoice Viewed</p>
                        <p className="text-sm text-muted-foreground">
                          {formatInvoiceDate(invoice.viewedAt)}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {invoice.paidAt && (
                    <div className="flex items-center gap-3 pb-3 border-b">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">Invoice Paid</p>
                        <p className="text-sm text-muted-foreground">
                          {formatInvoiceDate(invoice.paidAt)}
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