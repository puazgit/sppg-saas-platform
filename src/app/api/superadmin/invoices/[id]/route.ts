import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

// GET /api/superadmin/invoices/[id] - Get invoice detail
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    
    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const invoice = await prisma.invoice.findUnique({
      where: { id: params.id },
      include: {
        subscription: {
          select: {
            id: true,
            sppgId: true,
            tier: true,
            status: true
          }
        },
        items: {
          select: {
            id: true,
            description: true,
            quantity: true,
            unitPrice: true,
            metadata: true
          }
        },
        payments: {
          select: {
            id: true,
            amount: true,
            status: true,
            method: true,
            createdAt: true
          }
        }
      }
    })

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
    }

    return NextResponse.json(invoice)

  } catch (error) {
    console.error('Error fetching invoice:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/superadmin/invoices/[id] - Update invoice
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
    if (body.sentAt) updateData.sentAt = new Date(body.sentAt)
    if (body.viewedAt) updateData.viewedAt = new Date(body.viewedAt)
    if (body.totalAmount !== undefined) updateData.totalAmount = body.totalAmount
    if (body.taxAmount !== undefined) updateData.taxAmount = body.taxAmount
    if (body.dueDate) updateData.dueDate = new Date(body.dueDate)
    if (body.metadata) updateData.metadata = body.metadata
    
    updateData.updatedAt = new Date()

    const invoice = await prisma.invoice.update({
      where: { id: params.id },
      data: updateData,
      include: {
        subscription: {
          select: {
            id: true,
            sppgId: true,
            tier: true,
            status: true
          }
        },
        items: {
          select: {
            id: true,
            description: true,
            quantity: true,
            unitPrice: true,
            metadata: true
          }
        },
        payments: {
          select: {
            id: true,
            amount: true,
            status: true,
            method: true,
            createdAt: true
          }
        }
      }
    })

    return NextResponse.json(invoice)

  } catch (error) {
    console.error('Error updating invoice:', error)
    
    if (error instanceof Error && 'code' in error && error.code === 'P2025') {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/superadmin/invoices/[id] - Delete invoice
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    
    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if invoice has payments
    const invoice = await prisma.invoice.findUnique({
      where: { id: params.id },
      include: {
        payments: { where: { status: 'COMPLETED' } }
      }
    })

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
    }

    if (invoice.payments && invoice.payments.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete invoice with completed payments' },
        { status: 400 }
      )
    }

    await prisma.invoice.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Invoice deleted successfully' })

  } catch (error) {
    console.error('Error deleting invoice:', error)
    
    if (error instanceof Error && 'code' in error && error.code === 'P2025') {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}