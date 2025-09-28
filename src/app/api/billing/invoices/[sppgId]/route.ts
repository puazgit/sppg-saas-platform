/**
 * API Route: Get Invoices by SPPG ID
 * GET /api/billing/invoices/[sppgId]
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sppgId: string }> }
) {
  try {
        const { sppgId } = await params
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    const whereClause = {
      sppgId,
      ...(status && { status: status as 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED' | 'REFUNDED' }),
    }

    const invoices = await prisma.invoice.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc',
      },
      skip: offset,
      take: limit,
      include: {
        sppg: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    const totalCount = await prisma.invoice.count({
      where: whereClause,
    })

    return NextResponse.json({
      success: true,
      invoices,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount,
      },
    })

  } catch (error) {
    console.error('Get invoices error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch invoices' 
      },
      { status: 500 }
    )
  }
}