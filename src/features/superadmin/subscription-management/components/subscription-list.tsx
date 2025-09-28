'use client'

import { useState } from 'react'
import { Eye, Edit, Trash2, MoreHorizontal, AlertTriangle, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  useSubscriptions,
  useDeleteSubscription,
  formatSubscriptionDate,
  getDaysUntilExpiry,
  SUBSCRIPTION_STATUS_COLORS,
  SUBSCRIPTION_TIER_COLORS,
  SUBSCRIPTION_STATUS_LABELS,
  type SubscriptionState
} from '@/features/superadmin/subscription-management'
import { cn } from '@/lib/utils'

interface SubscriptionListProps {
  onEdit?: (subscription: SubscriptionState) => void
  onView?: (subscription: SubscriptionState) => void
}

export function SubscriptionList({ onEdit, onView }: SubscriptionListProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  
  const { data, isLoading, error } = useSubscriptions()
  const { mutate: deleteSubscription, isPending: isDeleting } = useDeleteSubscription()

  const handleSelectAll = (checked: boolean) => {
    if (checked && data?.data) {
      setSelectedIds(data.data.map(sub => sub.id))
    } else {
      setSelectedIds([])
    }
  }

  const handleSelectItem = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds(prev => [...prev, id])
    } else {
      setSelectedIds(prev => prev.filter(selectedId => selectedId !== id))
    }
  }

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin membatalkan subscription ini?')) {
      deleteSubscription(id)
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading Subscriptions...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 animate-pulse rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Subscriptions</h3>
            <p className="text-gray-600">{error.message}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!data?.data?.length) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Tidak Ada Subscription</h3>
            <p className="text-gray-600">Belum ada subscription yang dibuat.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const subscriptions = data.data
  const pagination = data.pagination

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Daftar Subscription</CardTitle>
          <div className="text-sm text-muted-foreground">
            {pagination.total} total subscription
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === subscriptions.length}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                </TableHead>
                <TableHead>SPPG</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Mulai</TableHead>
                <TableHead>Berakhir</TableHead>
                <TableHead>Limits</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscriptions.map((subscription) => {
                const daysUntilExpiry = getDaysUntilExpiry(subscription.endDate)
                const isExpiring = daysUntilExpiry !== null && daysUntilExpiry <= 30 && daysUntilExpiry > 0
                const isExpired = daysUntilExpiry !== null && daysUntilExpiry <= 0

                return (
                  <TableRow key={subscription.id}>
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(subscription.id)}
                        onChange={(e) => handleSelectItem(subscription.id, e.target.checked)}
                        className="rounded border-gray-300"
                      />
                    </TableCell>
                    
                    <TableCell>
                      <div className="font-medium">
                        {subscription.sppg?.name || 'Unknown SPPG'}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {subscription.sppg?.email}
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge 
                        variant="outline"
                        className={cn(
                          "font-medium",
                          `border-${SUBSCRIPTION_TIER_COLORS[subscription.tier]}-500`,
                          `text-${SUBSCRIPTION_TIER_COLORS[subscription.tier]}-700`
                        )}
                      >
                        {subscription.tier}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={subscription.status === 'ACTIVE' ? 'default' : 'secondary'}
                          className={cn(
                            `bg-${SUBSCRIPTION_STATUS_COLORS[subscription.status]}-100`,
                            `text-${SUBSCRIPTION_STATUS_COLORS[subscription.status]}-800`,
                            `border-${SUBSCRIPTION_STATUS_COLORS[subscription.status]}-200`
                          )}
                        >
                          {SUBSCRIPTION_STATUS_LABELS[subscription.status]}
                        </Badge>
                        {isExpiring && (
                          <AlertTriangle className="h-4 w-4 text-orange-500" title="Akan berakhir dalam 30 hari" />
                        )}
                        {isExpired && (
                          <AlertTriangle className="h-4 w-4 text-red-500" title="Sudah berakhir" />
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="text-sm">
                      {formatSubscriptionDate(subscription.startDate)}
                    </TableCell>

                    <TableCell className="text-sm">
                      {subscription.endDate ? (
                        <div>
                          {formatSubscriptionDate(subscription.endDate)}
                          {daysUntilExpiry !== null && (
                            <div className={cn(
                              "text-xs",
                              isExpired ? "text-red-600" : 
                              isExpiring ? "text-orange-600" : "text-muted-foreground"
                            )}>
                              {isExpired ? `Expired ${Math.abs(daysUntilExpiry)} hari lalu` :
                               isExpiring ? `${daysUntilExpiry} hari lagi` : 
                               `${daysUntilExpiry} hari lagi`}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Unlimited</span>
                      )}
                    </TableCell>

                    <TableCell className="text-sm">
                      <div className="space-y-1">
                        <div>{subscription.maxRecipients} penerima</div>
                        <div>{subscription.maxStaff} staff</div>
                        <div>{subscription.storageGb}GB storage</div>
                      </div>
                    </TableCell>

                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onView?.(subscription)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Detail
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onEdit?.(subscription)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => handleDelete(subscription.id)}
                            disabled={isDeleting}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Cancel Subscription
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between pt-4">
            <div className="text-sm text-muted-foreground">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
              {pagination.total} results
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page <= 1}
                onClick={() => {/* TODO: Handle previous page */}}
              >
                Previous
              </Button>
              
              {[...Array(pagination.totalPages)].map((_, i) => {
                const pageNumber = i + 1
                if (
                  pageNumber === 1 ||
                  pageNumber === pagination.totalPages ||
                  (pageNumber >= pagination.page - 1 && pageNumber <= pagination.page + 1)
                ) {
                  return (
                    <Button
                      key={pageNumber}
                      variant={pageNumber === pagination.page ? "default" : "outline"}
                      size="sm"
                      onClick={() => {/* TODO: Handle page change */}}
                    >
                      {pageNumber}
                    </Button>
                  )
                } else if (
                  pageNumber === pagination.page - 2 ||
                  pageNumber === pagination.page + 2
                ) {
                  return <span key={pageNumber}>...</span>
                }
                return null
              })}
              
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => {/* TODO: Handle next page */}}
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