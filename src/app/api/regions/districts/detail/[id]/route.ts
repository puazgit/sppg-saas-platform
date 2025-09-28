import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const districtId = params.id

    // Try lookup by lookupCode first, then fallback to id
    const district = await prisma.district.findFirst({
      where: {
        OR: [
          { lookupCode: districtId },
          { id: districtId }
        ]
      }
    })

    if (!district) {
      return NextResponse.json(
        { success: false, error: 'District not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: district
    })
  } catch (error) {
    console.error('[API] Error fetching district:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}