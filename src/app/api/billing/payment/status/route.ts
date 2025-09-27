/**
 * API Route: Payment Status (using Invoice model)
 * GET /api/billing/payment/status
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const invoiceId = searchParams.get('invoiceId')
    const subscriptionId = searchParams.get('subscriptionId')

    if (!invoiceId && !subscriptionId) {
      return NextResponse.json(
        { error: 'Invoice ID or Subscription ID is required' },
        { status: 400 }
      )
    }

    let invoice

    if (invoiceId) {
      invoice = await prisma.invoice.findUnique({
        where: { id: invoiceId },
        include: {
          sppg: { select: { name: true } }
        }
      })
    } else if (subscriptionId) {
      invoice = await prisma.invoice.findFirst({
        where: { 
          sppg: {
            subscription: {
              id: subscriptionId
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        include: {
          sppg: { select: { name: true } }
        }
      })
    }

    if (!invoice) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      )
    }

    // Generate timeline based on invoice status
    const generateTimeline = (invoice: { status: string; createdAt: Date; updatedAt: Date; paidDate?: Date | null }) => {
      const timeline = [
        {
          id: '1',
          status: 'Invoice Created',
          description: 'Invoice has been generated',
          timestamp: invoice.createdAt.toISOString(),
          isCompleted: true
        }
      ]

      if (invoice.status !== 'PENDING') {
        timeline.push({
          id: '2',
          status: 'Payment Processing',
          description: 'Payment is being processed',
          timestamp: invoice.updatedAt.toISOString(),
          isCompleted: true
        })
      }

      if (invoice.status === 'COMPLETED') {
        timeline.push({
          id: '3',
          status: 'Payment Completed',
          description: 'Payment has been successfully processed',
          timestamp: invoice.paidDate?.toISOString() || invoice.updatedAt.toISOString(),
          isCompleted: true
        })
      } else if (invoice.status === 'FAILED') {
        timeline.push({
          id: '3',
          status: 'Payment Failed',
          description: 'Payment processing failed',
          timestamp: invoice.updatedAt.toISOString(),
          isCompleted: true
        })
      } else if (invoice.status === 'CANCELLED') {
        timeline.push({
          id: '3',
          status: 'Payment Cancelled',
          description: 'Payment has been cancelled',
          timestamp: invoice.updatedAt.toISOString(),
          isCompleted: true
        })
      }

      return timeline
    }

    const paymentDetails = {
      id: invoice.id,
      amount: invoice.totalAmount,
      currency: 'IDR',
      status: invoice.status,
      method: invoice.paymentMethod || 'BANK_TRANSFER',
      reference: invoice.paymentReference || invoice.invoiceNumber,
      description: `Invoice for period ${invoice.period}`,
      createdAt: invoice.createdAt.toISOString(),
      completedAt: invoice.paidDate?.toISOString(),
      failureReason: invoice.status === 'FAILED' ? 'Payment processing failed' : undefined,
      sppgName: invoice.sppg?.name || 'Unknown Organization',
      invoiceNumber: invoice.invoiceNumber,
      timeline: generateTimeline(invoice)
    }

    return NextResponse.json({ payment: paymentDetails })
  } catch (error) {
    console.error('Error fetching payment status:', error)
    return NextResponse.json(
      { error: 'Failed to fetch payment status' },
      { status: 500 }
    )
  }
}