import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Schema untuk validasi query parameters export
const exportQuerySchema = z.object({
  type: z.enum(['payments', 'invoices', 'analytics']).default('payments'),
  format: z.enum(['csv', 'json']).default('csv'),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  status: z.string().optional(),
  sppgId: z.string().optional()
})

// POST /api/superadmin/billing-analytics/export - Export billing data
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedParams = exportQuerySchema.parse(body)

    // Build date range
    const startDate = validatedParams.startDate ? new Date(validatedParams.startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const endDate = validatedParams.endDate ? new Date(validatedParams.endDate) : new Date()

    let data: unknown[] = []
    let filename = ''

    switch (validatedParams.type) {
      case 'payments':
        const paymentWhere: Record<string, unknown> = {
          createdAt: { gte: startDate, lte: endDate }
        }
        
        if (validatedParams.status) {
          paymentWhere.status = validatedParams.status
        }
        
        if (validatedParams.sppgId) {
          paymentWhere.subscription = { sppgId: validatedParams.sppgId }
        }

        const payments = await prisma.payment.findMany({
          where: paymentWhere,
          include: {
            invoice: { select: { invoiceNumber: true } },
            subscription: { select: { sppgId: true, tier: true } }
          },
          orderBy: { createdAt: 'desc' }
        })

        data = payments.map(payment => ({
          id: payment.id,
          invoiceNumber: payment.invoice?.invoiceNumber,
          sppgId: payment.subscription?.sppgId,
          tier: payment.subscription?.tier,
          amount: payment.amount,
          processingFee: payment.processingFee,
          refundedAmount: payment.refundedAmount,
          status: payment.status,
          method: payment.method,
          gateway: payment.gateway,
          gatewayTransactionId: payment.gatewayTransactionId,
          createdAt: payment.createdAt,
          paidAt: payment.paidAt,
          updatedAt: payment.updatedAt
        }))
        
        filename = `payments_${startDate.toISOString().split('T')[0]}_to_${endDate.toISOString().split('T')[0]}`
        break

      case 'invoices':
        const invoiceWhere: Record<string, unknown> = {
          issueDate: { gte: startDate, lte: endDate }
        }
        
        if (validatedParams.status) {
          invoiceWhere.status = validatedParams.status
        }
        
        if (validatedParams.sppgId) {
          invoiceWhere.subscription = { sppgId: validatedParams.sppgId }
        }

        const invoices = await prisma.invoice.findMany({
          where: invoiceWhere,
          include: {
            subscription: { select: { sppgId: true, tier: true } },
            items: true,
            payments: { select: { id: true, amount: true, status: true } }
          },
          orderBy: { issueDate: 'desc' }
        })

        data = invoices.map(invoice => ({
          id: invoice.id,
          invoiceNumber: invoice.invoiceNumber,
          sppgId: invoice.subscription?.sppgId,
          tier: invoice.subscription?.tier,
          totalAmount: invoice.totalAmount,
          taxAmount: invoice.taxAmount,
          status: invoice.status,
          issueDate: invoice.issueDate,
          dueDate: invoice.dueDate,
          paidAt: invoice.paidAt,
          sentAt: invoice.sentAt,
          viewedAt: invoice.viewedAt,
          billingPeriodStart: invoice.billingPeriodStart,
          billingPeriodEnd: invoice.billingPeriodEnd,
          itemsCount: invoice.items?.length || 0,
          paymentsCount: invoice.payments?.length || 0,
          createdAt: invoice.createdAt,
          updatedAt: invoice.updatedAt
        }))
        
        filename = `invoices_${startDate.toISOString().split('T')[0]}_to_${endDate.toISOString().split('T')[0]}`
        break

      case 'analytics':
        // Generate summary analytics data
        const analyticsData = await Promise.all([
          // Revenue by day
          prisma.$queryRaw<Array<{date: Date, revenue: string, payments: string}>>`
            SELECT 
              DATE("createdAt") as date,
              SUM("amount") as revenue,
              COUNT(*) as payments
            FROM "Payment" 
            WHERE "status" = 'COMPLETED'
              AND "createdAt" >= ${startDate}
              AND "createdAt" <= ${endDate}
            GROUP BY DATE("createdAt")
            ORDER BY date DESC
          `,
          
          // Revenue by SPPG
          prisma.$queryRaw<Array<{sppgId: string, tier: string, revenue: string, payments: string}>>`
            SELECT 
              s."sppgId",
              s."tier",
              COALESCE(SUM(p."amount"), 0) as revenue,
              COUNT(p."id") as payments
            FROM "Subscription" s
            LEFT JOIN "Payment" p ON s."id" = p."subscriptionId" 
              AND p."status" = 'COMPLETED'
              AND p."createdAt" >= ${startDate}
              AND p."createdAt" <= ${endDate}
            GROUP BY s."sppgId", s."tier"
            ORDER BY revenue DESC
          `
        ])

        data = [
          ...analyticsData[0].map(item => ({
            type: 'daily_revenue',
            date: item.date,
            revenue: parseFloat(item.revenue || '0'),
            payments: parseInt(item.payments || '0')
          })),
          ...analyticsData[1].map(item => ({
            type: 'sppg_revenue',
            sppgId: item.sppgId,
            tier: item.tier,
            revenue: parseFloat(item.revenue || '0'),
            payments: parseInt(item.payments || '0')
          }))
        ]
        
        filename = `analytics_${startDate.toISOString().split('T')[0]}_to_${endDate.toISOString().split('T')[0]}`
        break
    }

    // Format response based on format
    if (validatedParams.format === 'csv') {
      // Convert to CSV
      if (data.length === 0) {
        return NextResponse.json({ error: 'No data found' }, { status: 404 })
      }

      const headers = Object.keys(data[0] as Record<string, unknown>)
      const csvRows = [
        headers.join(','),
        ...data.map(row => 
          headers.map(header => {
            const value = (row as Record<string, unknown>)[header]
            return typeof value === 'string' && value.includes(',') 
              ? `"${value}"` 
              : String(value || '')
          }).join(',')
        )
      ]

      const csvContent = csvRows.join('\n')
      
      return new Response(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="${filename}.csv"`
        }
      })
    } else {
      // Return JSON
      return NextResponse.json({
        data,
        metadata: {
          type: validatedParams.type,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          count: data.length,
          exportedAt: new Date().toISOString(),
          exportedBy: session.user.id
        }
      })
    }

  } catch (error) {
    console.error('Error exporting billing data:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid parameters', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}