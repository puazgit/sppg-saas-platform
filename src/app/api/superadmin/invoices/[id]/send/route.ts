import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

// POST /api/superadmin/invoices/[id]/send - Send invoice via email
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
    const { email, message } = body

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Get the invoice
    const invoice = await prisma.invoice.findUnique({
      where: { id: params.id },
      include: {
        subscription: {
          select: {
            sppgId: true,
            tier: true
          }
        }
      }
    })

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
    }

    if (invoice.status === 'PAID' || invoice.status === 'CANCELLED') {
      return NextResponse.json(
        { error: 'Cannot send paid or cancelled invoice' },
        { status: 400 }
      )
    }

    // Update invoice status and sent timestamp
    const updatedInvoice = await prisma.invoice.update({
      where: { id: params.id },
      data: {
        status: 'SENT',
        sentAt: new Date(),
        metadata: {
          ...(invoice.metadata as object || {}),
          emailHistory: [
            ...((invoice.metadata as Record<string, unknown>)?.emailHistory as unknown[] || []),
            {
              email,
              message: message || '',
              sentAt: new Date().toISOString(),
              sentBy: session.user.id
            }
          ]
        },
        updatedAt: new Date()
      },
      include: {
        subscription: {
          select: {
            sppgId: true,
            tier: true
          }
        }
      }
    })

    // Here you would integrate with your email service
    // For now, we'll just simulate sending
    console.log(`Sending invoice ${invoice.invoiceNumber} to ${email}`)
    console.log(`Message: ${message || 'Invoice terlampir'}`)

    return NextResponse.json({
      invoice: updatedInvoice,
      sent: {
        email,
        message: message || 'Invoice terlampir',
        sentAt: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Error sending invoice:', error)
    
    if (error instanceof Error && 'code' in error && error.code === 'P2025') {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}