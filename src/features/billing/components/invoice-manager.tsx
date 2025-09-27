/**
 * Invoice Manager Component
 * Enterprise invoice management dengan filtering dan bulk operations
 */

'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  Search, Filter, Download, Eye, Send, 
  AlertCircle, CheckCircle, FileText,
  MoreHorizontal, Trash2, Calendar
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { type Invoice } from '../services/billing-api'

// Using enterprise API types from BillingAPI service

export function InvoiceManager() {
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Fetch invoices with filters
  const { data: invoicesData, isLoading, refetch } = useQuery({
    queryKey: ['invoices', searchTerm, statusFilter, currentPage],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter !== 'all' && { status: statusFilter })
      })
      
      const response = await fetch(`/api/billing/invoices?${params}`)
      if (!response.ok) throw new Error('Failed to fetch invoices')
      return response.json()
    }
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID': return 'bg-green-100 text-green-800 border-green-200'
      case 'SENT': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'OVERDUE': return 'bg-red-100 text-red-800 border-red-200'
      case 'DRAFT': return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'CANCELLED': return 'bg-orange-100 text-orange-800 border-orange-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PAID': return <CheckCircle className="w-4 h-4" />
      case 'SENT': return <Send className="w-4 h-4" />
      case 'OVERDUE': return <AlertCircle className="w-4 h-4" />
      case 'DRAFT': return <FileText className="w-4 h-4" />
      case 'CANCELLED': return <Trash2 className="w-4 h-4" />
      default: return <FileText className="w-4 h-4" />
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedInvoices(invoicesData?.invoices?.map((inv: Invoice) => inv.id) || [])
    } else {
      setSelectedInvoices([])
    }
  }

  const handleSelectInvoice = (invoiceId: string, checked: boolean) => {
    if (checked) {
      setSelectedInvoices(prev => [...prev, invoiceId])
    } else {
      setSelectedInvoices(prev => prev.filter(id => id !== invoiceId))
    }
  }

  const handleBulkAction = async (action: string) => {
    try {
      const response = await fetch('/api/billing/invoices/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, invoiceIds: selectedInvoices })
      })
      
      if (response.ok) {
        refetch()
        setSelectedInvoices([])
      }
    } catch (error) {
      console.error('Bulk action failed:', error)
    }
  }

  const invoices = invoicesData?.invoices || []
  const totalInvoices = invoicesData?.total || 0
  const totalPages = Math.ceil(totalInvoices / itemsPerPage)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Invoice Manager</h1>
          <p className="text-gray-600 mt-1">Manage and track all your invoices</p>
        </div>
        <Button>
          <FileText className="w-4 h-4 mr-2" />
          Create Invoice
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search invoices by number, SPPG name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="SENT">Sent</SelectItem>
                <SelectItem value="PAID">Paid</SelectItem>
                <SelectItem value="OVERDUE">Overdue</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedInvoices.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 p-4 bg-blue-50 border border-blue-200 rounded-lg"
        >
          <span className="text-sm font-medium text-blue-900">
            {selectedInvoices.length} invoice(s) selected
          </span>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => handleBulkAction('send')}>
              <Send className="w-4 h-4 mr-1" />
              Send
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleBulkAction('download')}>
              <Download className="w-4 h-4 mr-1" />
              Download
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleBulkAction('delete')}>
              <Trash2 className="w-4 h-4 mr-1" />
              Delete
            </Button>
          </div>
        </motion.div>
      )}

      {/* Invoices Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Invoices ({totalInvoices})</span>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4 p-4 animate-pulse">
                  <div className="h-4 w-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/8"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/8"></div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 pb-4 border-b text-sm font-medium text-gray-600">
                <div className="col-span-1">
                  <Checkbox
                    checked={selectedInvoices.length === invoices.length && invoices.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </div>
                <div className="col-span-2">Invoice #</div>
                <div className="col-span-3">SPPG</div>
                <div className="col-span-2">Amount</div>
                <div className="col-span-2">Due Date</div>
                <div className="col-span-1">Status</div>
                <div className="col-span-1">Actions</div>
              </div>

              {/* Table Body */}
              <div className="space-y-2 mt-4">
                {invoices.map((invoice: Invoice) => (
                  <motion.div
                    key={invoice.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="grid grid-cols-12 gap-4 items-center p-4 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="col-span-1">
                      <Checkbox
                        checked={selectedInvoices.includes(invoice.id)}
                        onCheckedChange={(checked) => handleSelectInvoice(invoice.id, !!checked)}
                      />
                    </div>
                    <div className="col-span-2">
                      <span className="font-mono text-sm">{invoice.invoiceNumber}</span>
                    </div>
                    <div className="col-span-3">
                      <div>
                        <p className="font-medium text-gray-900">{invoice.sppgName}</p>
                        <p className="text-sm text-gray-500">{invoice.description}</p>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <span className="font-semibold text-gray-900">
                        Rp {invoice.amount.toLocaleString('id-ID')}
                      </span>
                    </div>
                    <div className="col-span-2">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {new Date(invoice.dueDate).toLocaleDateString('id-ID')}
                        </span>
                      </div>
                    </div>
                    <div className="col-span-1">
                      <Badge className={`${getStatusColor(invoice.status)} flex items-center gap-1`}>
                        {getStatusIcon(invoice.status)}
                        {invoice.status}
                      </Badge>
                    </div>
                    <div className="col-span-1">
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t">
                  <div className="text-sm text-gray-600">
                    Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalInvoices)} of {totalInvoices} invoices
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(prev => prev - 1)}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(prev => prev + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}