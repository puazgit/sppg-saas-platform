import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { RegionCache } from '@/lib/cache/regions'

export async function GET() {
  try {
    // Try to get from cache first
    const cachedProvinces = await RegionCache.getProvinces()
    if (cachedProvinces) {
      return NextResponse.json({
        success: true,
        provinces: cachedProvinces,
        cached: true
      })
    }

    // If not in cache, fetch from database
    const provinces = await prisma.province.findMany({
      orderBy: { name: 'asc' }
    })

    // Cache the result for future requests
    await RegionCache.cacheProvinces(provinces)

    return NextResponse.json({
      success: true,
      provinces: provinces,
      cached: false
    })
  } catch (error) {
    console.error('Error fetching provinces:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch provinces',
        message: 'Terjadi kesalahan saat mengambil data provinsi'
      },
      { status: 500 }
    )
  }
}