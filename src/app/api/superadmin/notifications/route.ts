import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const searchParams = url.searchParams
    
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const type = searchParams.get('type') || ''
    const status = searchParams.get('status') || ''
    
    const skip = (page - 1) * limit
    
    // Build where clause for notifications
    const whereConditions: Prisma.NotificationWhereInput = {
      userId: null // SuperAdmin notifications
    }
    
    if (type && type !== 'all') {
      // Validate type is a valid NotificationType enum value
      const validTypes = ['INFO', 'WARNING', 'ERROR', 'SUCCESS', 'REMINDER', 'SYSTEM', 'PROCUREMENT', 'PRODUCTION', 'DISTRIBUTION', 'BILLING'] as const
      const upperType = type.toUpperCase() as typeof validTypes[number]
      if (validTypes.includes(upperType)) {
        whereConditions.type = upperType
      }
    }
    
    if (status === 'unread') {
      whereConditions.isRead = false
    } else if (status === 'read') {
      whereConditions.isRead = true
    }
    
    // Get notifications
    const [notifications, totalCount] = await Promise.all([
      prisma.notification.findMany({
        where: whereConditions,
        skip,
        take: limit,
        include: {
          sppg: {
            select: {
              id: true,
              name: true
            }
          }
        },
        orderBy: [
          { isRead: 'asc' }, // Unread first
          { createdAt: 'desc' }
        ]
      }),
      
      prisma.notification.count({ where: whereConditions })
    ])
    
    // Get notification stats
    const [totalUnread, typeStats] = await Promise.all([
      prisma.notification.count({
        where: {
          userId: null, // SuperAdmin notifications
          isRead: false
        }
      }),
      
      prisma.notification.groupBy({
        by: ['type'],
        where: {
          userId: null // SuperAdmin notifications
        },
        _count: {
          _all: true
        }
      })
    ])
    
    const totalPages = Math.ceil(totalCount / limit)
    
    return NextResponse.json({
      success: true,
      data: {
        notifications,
        stats: {
          totalUnread,
          typeStats: typeStats.map(stat => ({
            type: stat.type,
            count: stat._count._all
          }))
        },
        pagination: {
          page,
          limit,
          totalCount,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    })
    
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch notifications' 
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, message, type, sppgId, priority } = body
    
    // Create notification
    const notification = await prisma.notification.create({
      data: {
        title,
        content: message,
        type: type || 'SYSTEM',
        priority: priority || 'NORMAL',
        sppgId: sppgId || null,
        isRead: false
      }
    })
    
    return NextResponse.json({
      success: true,
      data: notification
    })
    
  } catch (error) {
    console.error('Error creating notification:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create notification' 
      },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, notificationIds } = body
    
    if (action === 'mark_read') {
      await prisma.notification.updateMany({
        where: {
          id: {
            in: notificationIds
          },
          userId: null
        },
        data: {
          isRead: true,
          readAt: new Date()
        }
      })
      
      return NextResponse.json({
        success: true,
        message: 'Notifications marked as read'
      })
    }
    
    if (action === 'mark_unread') {
      await prisma.notification.updateMany({
        where: {
          id: {
            in: notificationIds
          },
          userId: null
        },
        data: {
          isRead: false,
          readAt: null
        }
      })
      
      return NextResponse.json({
        success: true,
        message: 'Notifications marked as unread'
      })
    }
    
    if (action === 'delete') {
      await prisma.notification.deleteMany({
        where: {
          id: {
            in: notificationIds
          },
          userId: null
        }
      })
      
      return NextResponse.json({
        success: true,
        message: 'Notifications deleted'
      })
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Invalid action' 
      },
      { status: 400 }
    )
    
  } catch (error) {
    console.error('Error updating notifications:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update notifications' 
      },
      { status: 500 }
    )
  }
}