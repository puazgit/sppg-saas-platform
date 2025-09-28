import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

// POST /api/superadmin/payments/[id]/refund - Refund payment
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    
    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { amount, reason, metadata } = body

    // Get the payment
    const payment = await prisma.payment.findUnique({
      where: { id: params.id }
    })

    if (!payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 })
    }

    if (payment.status !== 'COMPLETED') {
      return NextResponse.json(
        { error: 'Can only refund completed payments' },
        { status: 400 }
      )
    }

    const currentRefunded = payment.refundedAmount || 0
    const maxRefundable = payment.amount - currentRefunded

    if (amount > maxRefundable) {
      return NextResponse.json(
        { error: `Maximum refundable amount is ${maxRefundable}` },
        { status: 400 }
      )
    }

    // Update payment with refund
    const newRefundedAmount = currentRefunded + amount
    const newStatus = newRefundedAmount >= payment.amount ? 'REFUNDED' : 'PARTIAL_REFUND'

    const updatedPayment = await prisma.payment.update({
      where: { id: params.id },
      data: {
        refundedAmount: newRefundedAmount,
        status: newStatus,
        metadata: {
          ...(payment.metadata as object || {}),
          refunds: [
            ...((payment.metadata as any)?.refunds || []),
            {
              amount,
              reason,
              refundedAt: new Date().toISOString(),
              refundedBy: session.user.id,
              ...metadata
            }
          ]
        },
        updatedAt: new Date()
      },
      include: {
        invoice: {
          select: {
            id: true,
            invoiceNumber: true,
            totalAmount: true,
            status: true
          }
        },
        subscription: {
          select: {
            id: true,
            sppgId: true,
            tier: true,
            status: true
          }
        }
      }
    })

    return NextResponse.json({
      payment: updatedPayment,
      refund: {
        amount,
        reason,
        refundedAt: new Date().toISOString(),
        newRefundedAmount,
        newStatus
      }
    })

  } catch (error) {
    console.error('Error processing refund:', error)
    
    if (error instanceof Error && 'code' in error && error.code === 'P2025') {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 })
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}