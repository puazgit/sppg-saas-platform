import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const villageId = params.id

    // Try lookup by lookupCode first, then fallback to id
    const village = await prisma.village.findFirst({
      where: {
        OR: [
          { lookupCode: villageId },
          { id: villageId }
        ]
      }
    })

    if (!village) {
      return NextResponse.json(
        { success: false, error: 'Village not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: village
    })
  } catch (error) {
    console.error('[API] Error fetching village:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}