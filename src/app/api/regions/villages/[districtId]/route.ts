import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ districtId: string }> }
) {
  try {
    const { districtId } = await params
    
    if (!districtId) {
      return NextResponse.json(
        { success: false, error: 'District ID is required' },
        { status: 400 }
      )
    }

    const villages = await prisma.village.findMany({
      where: {
        districtId: districtId
      },
      select: {
        id: true,
        name: true,
        code: true
      },
      orderBy: {
        name: 'asc'
      }
    })

    return NextResponse.json({
      success: true,
      villages: villages,
      cached: false
    })
  } catch (error) {
    console.error('Error fetching villages:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch villages' },
      { status: 500 }
    )
  }
}