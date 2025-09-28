import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { paymentFiltersSchema } from '@/features/superadmin/payment-billing/schemas'
import { z } from 'zod'

// GET /api/superadmin/payments - List payments with filters
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    
    // Parse and validate query parameters
    const filters = {
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '10'),
      search: searchParams.get('search') || undefined,
      status: searchParams.get('status') || undefined,
      method: searchParams.get('method') || undefined,
      gateway: searchParams.get('gateway') || undefined,
      amountMin: searchParams.get('amountMin') ? parseFloat(searchParams.get('amountMin')!) : undefined,
      amountMax: searchParams.get('amountMax') ? parseFloat(searchParams.get('amountMax')!) : undefined,
      dateFrom: searchParams.get('dateFrom') || undefined,
      dateTo: searchParams.get('dateTo') || undefined,
      sortBy: searchParams.get('sortBy') || 'createdAt',
      sortOrder: (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc'
    }

    // Validate filters
    const validatedFilters = paymentFiltersSchema.parse(filters)

    // Build where clause
    const where: Record<string, any> = {}
    
    if (validatedFilters.search) {
      where.OR = [
        { id: { contains: validatedFilters.search, mode: 'insensitive' } },
        { invoiceId: { contains: validatedFilters.search, mode: 'insensitive' } },
        { 
          subscription: {
            sppgId: { contains: validatedFilters.search, mode: 'insensitive' }
          }
        }
      ]
    }
    
    if (validatedFilters.status) {
      where.status = validatedFilters.status
    }
    
    if (validatedFilters.method) {
      where.method = validatedFilters.method
    }
    
    if (validatedFilters.gateway) {
      where.gateway = validatedFilters.gateway
    }
    
    if (validatedFilters.amountMin || validatedFilters.amountMax) {
      where.amount = {}
      if (validatedFilters.amountMin) where.amount.gte = validatedFilters.amountMin
      if (validatedFilters.amountMax) where.amount.lte = validatedFilters.amountMax
    }
    
    if (validatedFilters.dateFrom || validatedFilters.dateTo) {
      where.createdAt = {}
      if (validatedFilters.dateFrom) where.createdAt.gte = new Date(validatedFilters.dateFrom)
      if (validatedFilters.dateTo) {
        const endDate = new Date(validatedFilters.dateTo)
        endDate.setHours(23, 59, 59, 999)
        where.createdAt.lte = endDate
      }
    }

    // Get total count
    const totalCount = await prisma.payment.count({ where })

    // Get payments with pagination
    const skip = (validatedFilters.page - 1) * validatedFilters.limit
    
    const payments = await prisma.payment.findMany({
      where,
      include: {
        invoice: {
          select: {
            invoiceNumber: true
          }
        },
        subscription: {
          select: {
            sppgId: true,
            tier: true
          }
        }
      },
      orderBy: {
        [validatedFilters.sortBy]: validatedFilters.sortOrder
      },
      skip,
      take: validatedFilters.limit
    })

    const totalPages = Math.ceil(totalCount / validatedFilters.limit)
    const hasNextPage = validatedFilters.page < totalPages
    const hasPreviousPage = validatedFilters.page > 1

    return NextResponse.json({
      payments,
      pagination: {
        currentPage: validatedFilters.page,
        totalPages,
        totalCount,
        hasNextPage,
        hasPreviousPage,
        limit: validatedFilters.limit
      }
    })

  } catch (error) {
    console.error('Error fetching payments:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/superadmin/payments - Create new payment
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    
    // Validate request body (you should create a proper schema)
    const createPaymentData = {
      invoiceId: body.invoiceId,
      subscriptionId: body.subscriptionId,
      amount: body.amount,
      method: body.method,
      gateway: body.gateway,
      status: body.status || 'PENDING',
      processingFee: body.processingFee,
      metadata: body.metadata
    }

    const payment = await prisma.payment.create({
      data: createPaymentData,
      include: {
        invoice: {
          select: {
            invoiceNumber: true
          }
        },
        subscription: {
          select: {
            sppgId: true,
            tier: true
          }
        }
      }
    })

    return NextResponse.json(payment, { status: 201 })

  } catch (error) {
    console.error('Error creating payment:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}