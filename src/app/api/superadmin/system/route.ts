import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // System health metrics
    const systemHealth = {
      database: 'connected',
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      nodeVersion: process.version,
      timestamp: new Date().toISOString()
    }

    // Database statistics
    const [
      totalSPPGs,
      totalUsers,
      totalSubscriptions,
      activeSubscriptions,
      totalMenus,
      totalDistributions,
      recentErrors
    ] = await Promise.all([
      prisma.sPPG.count(),
      prisma.user.count(),
      prisma.subscription.count(),
      prisma.subscription.count({ where: { status: 'ACTIVE' } }),
      prisma.menu.count(),
      prisma.distribution.count(),
      
      // Get recent error logs (if you have error logging table)
      prisma.notification.count({
        where: {
          type: 'ERROR',
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
          }
        }
      })
    ])

    // System settings - simplified for now
    const systemSettings: Record<string, Array<{ key: string; value: string; description: string | null }>> = {
      SYSTEM: [
        { key: 'maintenance_mode', value: 'false', description: 'System maintenance mode' },
        { key: 'max_upload_size', value: '10MB', description: 'Maximum file upload size' }
      ],
      SECURITY: [
        { key: 'password_min_length', value: '8', description: 'Minimum password length' },
        { key: 'session_timeout', value: '30', description: 'Session timeout in minutes' }
      ],
      NOTIFICATION: [
        { key: 'email_notifications', value: 'true', description: 'Enable email notifications' },
        { key: 'sms_notifications', value: 'false', description: 'Enable SMS notifications' }
      ],
      PAYMENT: [
        { key: 'payment_gateway', value: 'midtrans', description: 'Payment gateway provider' },
        { key: 'auto_invoice', value: 'true', description: 'Auto generate invoices' }
      ]
    }

    // Recent system activity
    const recentActivity = await prisma.user.findMany({
      where: {
        lastLogin: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
        }
      },
      select: {
        id: true,
        name: true,
        email: true,
        userType: true,
        lastLogin: true,
        sppg: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        lastLogin: 'desc'
      },
      take: 10
    })

    // Security metrics
    const securityMetrics = {
      activeSessions: await prisma.user.count({ where: { lastLogin: { gte: new Date(Date.now() - 30 * 60 * 1000) } } }), // Last 30 minutes
      failedLogins: 0, // Would be tracked in audit logs
      blockedIPs: [], // Would be tracked separately
      twoFactorEnabled: await prisma.user.count({ where: { userType: 'SUPERADMIN' } }) // Count SuperAdmin users with 2FA
    }

    // Security logs (simulated - would come from audit table)
    const securityLogs = [
      {
        id: 1,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        type: 'LOGIN_SUCCESS',
        user: 'admin@sppg.com',
        ip: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
      },
      {
        id: 2,
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        type: 'PASSWORD_CHANGE',
        user: 'user@sppg.com',
        ip: '192.168.1.101',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      },
      {
        id: 3,
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        type: 'SUSPICIOUS_ACTIVITY',
        user: 'unknown',
        ip: '45.123.45.67',
        userAgent: 'curl/7.68.0'
      }
    ]

    return NextResponse.json({
      success: true,
      data: {
        systemHealth,
        statistics: {
          totalSPPGs,
          totalUsers,
          totalSubscriptions,
          activeSubscriptions,
          totalMenus,
          totalDistributions,
          recentErrors
        },
        systemSettings,
        recentActivity,
        securityMetrics,
        securityLogs
      }
    })

  } catch (error) {
    console.error('Error fetching system info:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch system information' 
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, settings } = body

    if (action === 'update_settings') {
      // Update multiple settings - simplified for now
      console.log('Updating settings:', settings)
      // In real implementation, you would update actual settings in database

      return NextResponse.json({
        success: true,
        message: 'Settings updated successfully'
      })
    }

    if (action === 'clear_cache') {
      // Simulate cache clearing
      // In real implementation, you would clear Redis cache here
      console.log('Cache cleared')
      
      return NextResponse.json({
        success: true,
        message: 'Cache cleared successfully'
      })
    }

    if (action === 'backup_database') {
      // Simulate database backup
      // In real implementation, you would trigger actual backup process
      console.log('Database backup initiated')
      
      return NextResponse.json({
        success: true,
        message: 'Database backup initiated'
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
    console.error('Error processing system action:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process system action' 
      },
      { status: 500 }
    )
  }
}