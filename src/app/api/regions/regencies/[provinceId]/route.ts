import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { RegionCache } from '@/lib/cache/regions'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ provinceId: string }> }
) {
  try {
    const { provinceId } = await params
    
    if (!provinceId) {
      return NextResponse.json(
        { success: false, error: 'Province ID is required' },
        { status: 400 }
      )
    }

    // Try to get from cache first
    const cachedRegencies = await RegionCache.getRegencies(provinceId)
    if (cachedRegencies) {
      return NextResponse.json({
        success: true,
        regencies: cachedRegencies,
        cached: true
      })
    }

    // If not in cache, fetch from database
    const regencies = await prisma.regency.findMany({
      where: {
        provinceId: provinceId
      },
      select: {
        id: true,
        name: true,
        code: true,
        type: true
      },
      orderBy: {
        name: 'asc'
      }
    })

    // Cache the result for future requests
    await RegionCache.cacheRegencies(provinceId, regencies)

    return NextResponse.json({
      success: true,
      regencies: regencies,
      cached: false
    })
  } catch (error) {
    console.error('Error fetching regencies:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch regencies' },
      { status: 500 }
    )
  }
}