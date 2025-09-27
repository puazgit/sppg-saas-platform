/**
 * API Route: Subscription Packages
 * GET /api/billing/packages
 */

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const packages = await prisma.subscriptionPackage.findMany({
      where: {
        isActive: true,
      },
      orderBy: [
        { isPopular: 'desc' },
        { monthlyPrice: 'asc' }
      ],
    })

    // Enterprise approach: Always return real data from database
    // If no packages found, it indicates a business configuration issue that should be logged
    if (packages.length === 0) {
      console.warn('[Enterprise Warning] No active subscription packages found in database. Please check business configuration.')
    }

    return NextResponse.json({
      success: true,
      data: packages,
    })
  } catch (error) {
    console.error('Fetch subscription packages error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch subscription packages' 
      },
      { status: 500 }
    )
  }
}