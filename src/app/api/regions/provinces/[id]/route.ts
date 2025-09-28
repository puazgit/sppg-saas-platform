import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const provinceId = params.id

    // Try lookup by lookupCode first, then fallback to id
    const province = await prisma.province.findFirst({
      where: {
        OR: [
          { lookupCode: provinceId },
          { id: provinceId }
        ]
      }
    })

    if (!province) {
      return NextResponse.json(
        { success: false, error: 'Province not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: province
    })
  } catch (error) {
    console.error('[API] Error fetching province:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}