import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

// GET /api/superadmin/payments/[id] - Get payment detail
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    
    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payment = await prisma.payment.findUnique({
      where: { id: params.id },
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

    if (!payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 })
    }

    return NextResponse.json(payment)

  } catch (error) {
    console.error('Error fetching payment:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/superadmin/payments/[id] - Update payment
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    
    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    
    // Validate update data
    const updateData: Record<string, unknown> = {}
    
    if (body.status) updateData.status = body.status
    if (body.paidAt) updateData.paidAt = new Date(body.paidAt)
    if (body.processingFee !== undefined) updateData.processingFee = body.processingFee
    if (body.gatewayTransactionId) updateData.gatewayTransactionId = body.gatewayTransactionId
    if (body.gatewayResponse) updateData.gatewayResponse = body.gatewayResponse
    if (body.metadata) updateData.metadata = body.metadata
    
    updateData.updatedAt = new Date()

    const payment = await prisma.payment.update({
      where: { id: params.id },
      data: updateData,
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

    return NextResponse.json(payment)

  } catch (error) {
    console.error('Error updating payment:', error)
    
    if (error instanceof Error && 'code' in error && error.code === 'P2025') {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 })
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/superadmin/payments/[id] - Delete payment
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    
    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await prisma.payment.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Payment deleted successfully' })

  } catch (error) {
    console.error('Error deleting payment:', error)
    
    if (error instanceof Error && 'code' in error && error.code === 'P2025') {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 })
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}