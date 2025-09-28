import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user || session.user.userType !== 'SPPG_USER') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' }, 
        { status: 401 }
      )
    }

    const sppgId = session.user.sppgId
    if (!sppgId) {
      return NextResponse.json(
        { success: false, error: 'SPPG ID not found' }, 
        { status: 400 }
      )
    }

    // Get inventory data
    const [
      inventoryItems,
      categories
    ] = await Promise.all([
      // All inventory items for this SPPG
      prisma.ingredient.findMany({
        where: { sppgId },
        orderBy: [
          { category: 'asc' },
          { name: 'asc' }
        ]
      }),
      
      // Unique categories
      prisma.ingredient.groupBy({
        by: ['category'],
        where: { sppgId }
      }).then(groups => groups.map(g => g.category))
    ])

    // Transform and calculate status for each item
    const transformedItems = inventoryItems.map(item => {
      let status = 'GOOD'
      
      // Determine status based on stock levels and expiry
      if (item.currentStock <= 0) {
        status = 'OUT_OF_STOCK'
      } else if (item.currentStock <= item.minimumStock) {
        status = 'LOW_STOCK'
      } else if (item.expiryDate && new Date(item.expiryDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)) {
        status = 'EXPIRING_SOON'
      }

      return {
        id: item.id,
        name: item.name,
        category: item.category,
        unit: item.unit,
        currentStock: item.currentStock,
        minimumStock: item.minimumStock,
        averageUsage: item.averageUsage,
        costPerUnit: item.costPerUnit,
        supplier: item.supplier,
        expiryDate: item.expiryDate?.toISOString(),
        lastRestocked: item.updatedAt.toISOString(),
        status
      }
    })

    // Calculate stats
    const stats = {
      totalItems: transformedItems.length,
      lowStockItems: transformedItems.filter(item => item.status === 'LOW_STOCK').length,
      outOfStockItems: transformedItems.filter(item => item.status === 'OUT_OF_STOCK').length,
      expiringSoonItems: transformedItems.filter(item => item.status === 'EXPIRING_SOON').length,
      totalValue: transformedItems.reduce((sum, item) => sum + (item.currentStock * item.costPerUnit), 0),
      avgMonthlyUsage: transformedItems.length > 0 ? 
        transformedItems.reduce((sum, item) => sum + item.averageUsage, 0) / transformedItems.length * 30 : 0
    }

    const result = {
      items: transformedItems,
      stats,
      categories
    }

    return NextResponse.json({ 
      success: true, 
      data: result 
    })

  } catch (error) {
    console.error('Error fetching inventory:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch inventory' },
      { status: 500 }
    )
  }
}