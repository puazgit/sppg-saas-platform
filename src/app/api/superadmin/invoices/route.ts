import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { invoiceFiltersSchema } from '@/features/superadmin/payment-billing/schemas'
import { z } from 'zod'

// GET /api/superadmin/invoices - List invoices with filters
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
      amountMin: searchParams.get('amountMin') ? parseFloat(searchParams.get('amountMin')!) : undefined,
      amountMax: searchParams.get('amountMax') ? parseFloat(searchParams.get('amountMax')!) : undefined,
      dateFrom: searchParams.get('dateFrom') || undefined,
      dateTo: searchParams.get('dateTo') || undefined,
      sortBy: searchParams.get('sortBy') || 'issueDate',
      sortOrder: (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc'
    }

    // Validate filters
    const validatedFilters = invoiceFiltersSchema.parse(filters)

    // Build where clause
    const where: Record<string, unknown> = {}
    
    if (validatedFilters.search) {
      where.OR = [
        { invoiceNumber: { contains: validatedFilters.search, mode: 'insensitive' } },
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
    
    if (validatedFilters.amountMin || validatedFilters.amountMax) {
      where.totalAmount = {}
      if (validatedFilters.amountMin) {
        (where.totalAmount as Record<string, number>).gte = validatedFilters.amountMin
      }
      if (validatedFilters.amountMax) {
        (where.totalAmount as Record<string, number>).lte = validatedFilters.amountMax
      }
    }
    
    if (validatedFilters.dateFrom || validatedFilters.dateTo) {
      where.issueDate = {}
      if (validatedFilters.dateFrom) {
        (where.issueDate as Record<string, Date>).gte = new Date(validatedFilters.dateFrom)
      }
      if (validatedFilters.dateTo) {
        const endDate = new Date(validatedFilters.dateTo)
        endDate.setHours(23, 59, 59, 999);
        (where.issueDate as Record<string, Date>).lte = endDate
      }
    }

    // Get total count
    const totalCount = await prisma.invoice.count({ where })

    // Get invoices with pagination
    const skip = (validatedFilters.page - 1) * validatedFilters.limit
    
    const invoices = await prisma.invoice.findMany({
      where,
      include: {
        subscription: {
          select: {
            sppgId: true,
            tier: true
          }
        },
        items: {
          select: {
            description: true,
            quantity: true,
            unitPrice: true,
            metadata: true
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
      invoices,
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
    console.error('Error fetching invoices:', error)
    
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

// POST /api/superadmin/invoices - Create new invoice
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    
    // Generate invoice number if not provided
    const invoiceNumber = body.invoiceNumber || `INV-${Date.now()}`
    
    const createInvoiceData = {
      invoiceNumber,
      subscriptionId: body.subscriptionId,
      totalAmount: body.totalAmount,
      taxAmount: body.taxAmount || 0,
      status: body.status || 'DRAFT',
      issueDate: new Date(body.issueDate),
      dueDate: new Date(body.dueDate),
      billingPeriodStart: new Date(body.billingPeriodStart),
      billingPeriodEnd: new Date(body.billingPeriodEnd),
      metadata: body.metadata,
      items: {
        create: body.items?.map((item: any) => ({
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          metadata: item.metadata
        })) || []
      }
    }

    const invoice = await prisma.invoice.create({
      data: createInvoiceData,
      include: {
        subscription: {
          select: {
            sppgId: true,
            tier: true
          }
        },
        items: {
          select: {
            description: true,
            quantity: true,
            unitPrice: true,
            metadata: true
          }
        }
      }
    })

    return NextResponse.json(invoice, { status: 201 })

  } catch (error) {
    console.error('Error creating invoice:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}