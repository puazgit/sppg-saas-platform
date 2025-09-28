import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const regencyId = params.id

    // Try lookup by lookupCode first, then fallback to id
    const regency = await prisma.regency.findFirst({
      where: {
        OR: [
          { lookupCode: regencyId },
          { id: regencyId }
        ]
      }
    })

    if (!regency) {
      return NextResponse.json(
        { success: false, error: `Regency not found with ID: ${regencyId}` },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: regency
    })
  } catch (error) {
    console.error('[API] Error fetching regency:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}