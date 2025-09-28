import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const searchParams = url.searchParams
    
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''
    const userType = searchParams.get('userType') || 'all'
    const sppgId = searchParams.get('sppgId') || ''
    const status = searchParams.get('status') || 'all' // active, inactive
    
    const skip = (page - 1) * limit
    
    // Build where clause
    const whereConditions: Prisma.UserWhereInput = {}
    
    if (search) {
      whereConditions.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    if (userType !== 'all') {
      const validUserTypes = ['SUPERADMIN', 'SPPG_USER'] as const
      const upperType = userType.toUpperCase() as typeof validUserTypes[number]
      if (validUserTypes.includes(upperType)) {
        whereConditions.userType = upperType
      }
    }
    
    if (sppgId) {
      whereConditions.sppgId = sppgId
    }
    
    if (status === 'active') {
      whereConditions.isActive = true
    } else if (status === 'inactive') {
      whereConditions.isActive = false
    }
    
    // Get users with pagination and relations
    const [users, totalCount, userStats] = await Promise.all([
      prisma.user.findMany({
        where: whereConditions,
        skip,
        take: limit,
        include: {
          sppg: {
            select: {
              id: true,
              name: true,
              province: {
                select: {
                  name: true
                }
              }
            }
          },
          userRoles: {
            include: {
              role: {
                select: {
                  id: true,
                  name: true,
                  description: true
                }
              }
            }
          }
        },
        orderBy: [
          { isActive: 'desc' }, // Active users first
          { createdAt: 'desc' }
        ]
      }),
      
      prisma.user.count({ where: whereConditions }),
      
      // Get user statistics
      Promise.all([
        prisma.user.count({ where: { userType: 'SUPERADMIN' } }),
        prisma.user.count({ where: { userType: 'SPPG_USER' } }),
        prisma.user.count({ where: { isActive: true } }),
        prisma.user.count({ where: { isActive: false } }),
        prisma.user.count({ 
          where: { 
            lastLogin: { 
              gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
            }
          }
        })
      ])
    ])
    
    const [superAdmins, sppgUsers, activeUsers, inactiveUsers, recentLogins] = userStats
    
    // Get SPPG list for filtering
    const sppgList = await prisma.sPPG.findMany({
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            users: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    })
    
    const totalPages = Math.ceil(totalCount / limit)
    
    return NextResponse.json({
      success: true,
      data: {
        users,
        stats: {
          total: totalCount,
          superAdmins,
          sppgUsers,
          activeUsers,
          inactiveUsers,
          recentLogins
        },
        sppgList,
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
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch users' 
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, userType, sppgId, roleIds, isActive = true } = body
    
    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })
    
    if (existingUser) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Email already exists' 
        },
        { status: 400 }
      )
    }
    
    // Create user with roles
    const user = await prisma.user.create({
      data: {
        name,
        email,
        userType: userType.toUpperCase(),
        sppgId: userType === 'SPPG_USER' ? sppgId : null,
        isActive,
        userRoles: roleIds?.length > 0 ? {
          create: roleIds.map((roleId: string) => ({
            roleId
          }))
        } : undefined
      },
      include: {
        sppg: {
          select: {
            id: true,
            name: true
          }
        },
        userRoles: {
          include: {
            role: {
              select: {
                id: true,
                name: true,
                description: true
              }
            }
          }
        }
      }
    })
    
    return NextResponse.json({
      success: true,
      data: user,
      message: 'User created successfully'
    })
    
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create user' 
      },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, userIds } = body
    
    if (action === 'bulk_activate') {
      await prisma.user.updateMany({
        where: {
          id: { in: userIds }
        },
        data: {
          isActive: true
        }
      })
      
      return NextResponse.json({
        success: true,
        message: 'Users activated successfully'
      })
    }
    
    if (action === 'bulk_deactivate') {
      await prisma.user.updateMany({
        where: {
          id: { in: userIds }
        },
        data: {
          isActive: false
        }
      })
      
      return NextResponse.json({
        success: true,
        message: 'Users deactivated successfully'
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
    console.error('Error updating users:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update users' 
      },
      { status: 500 }
    )
  }
}