/**
 * API Route: Recent Invoices
 * GET /api/billing/invoices/recent
 */

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const recentInvoices = await prisma.invoice.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        sppg: {
          select: {
            name: true
          }
        }
      }
    })

    const formattedInvoices = recentInvoices.map(invoice => ({
      id: invoice.id,
      sppgName: invoice.sppg.name,
      amount: invoice.totalAmount,
      status: invoice.status,
      dueDate: invoice.dueDate.toISOString(),
      createdAt: invoice.createdAt.toISOString()
    }))

    return NextResponse.json(formattedInvoices)
  } catch (error) {
    console.error('Error fetching recent invoices:', error)
    return NextResponse.json(
      { error: 'Failed to fetch recent invoices' },
      { status: 500 }
    )
  }
}