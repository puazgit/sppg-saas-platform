import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ regencyId: string }> }
) {
  try {
    const { regencyId } = await params
    
    if (!regencyId) {
      return NextResponse.json(
        { success: false, error: 'Regency ID is required' },
        { status: 400 }
      )
    }

    const districts = await prisma.district.findMany({
      where: {
        regencyId: regencyId
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
      districts: districts,
      cached: false
    })
  } catch (error) {
    console.error('Error fetching districts:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch districts' },
      { status: 500 }
    )
  }
}