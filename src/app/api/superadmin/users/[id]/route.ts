import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: {
    id: string
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params
    
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        sppg: {
          select: {
            id: true,
            name: true,
            province: {
              select: {
                name: true
              }
            },
            city: {
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
                description: true,
                permissions: {
                  select: {
                    id: true,
                    name: true,
                    description: true
                  }
                }
              }
            }
          }
        }
      }
    })
    
    if (!user) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'User not found' 
        },
        { status: 404 }
      )
    }
    
    // Get user activity logs (last 30 days)
    const activityLogs = await prisma.notification.findMany({
      where: {
        OR: [
          { content: { contains: user.email } },
          { content: { contains: user.name } }
        ],
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        }
      },
      select: {
        id: true,
        title: true,
        content: true,
        type: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 20
    })
    
    return NextResponse.json({
      success: true,
      data: {
        user,
        activityLogs
      }
    })
    
  } catch (error) {
    console.error('Error fetching user detail:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch user detail' 
      },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params
    const body = await request.json()
    const { name, email, userType, sppgId, roleIds, isActive } = body
    
    // Check if email exists for other users
    if (email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email,
          id: { not: id }
        }
      })
      
      if (existingUser) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Email already exists for another user' 
          },
          { status: 400 }
        )
      }
    }
    
    // Update user and roles in transaction
    await prisma.$transaction(async (tx) => {
      // Update user basic info
      const user = await tx.user.update({
        where: { id },
        data: {
          name,
          email,
          userType: userType?.toUpperCase(),
          sppgId: userType === 'SPPG_USER' ? sppgId : null,
          isActive
        }
      })
      
      // Update roles if provided
      if (roleIds) {
        // Remove existing roles
        await tx.userRole.deleteMany({
          where: { userId: id }
        })
        
        // Add new roles
        if (roleIds.length > 0) {
          await tx.userRole.createMany({
            data: roleIds.map((roleId: string) => ({
              userId: id,
              roleId
            }))
          })
        }
      }
      
      return user
    })
    
    // Fetch updated user with relations
    const userWithRelations = await prisma.user.findUnique({
      where: { id },
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
      data: userWithRelations,
      message: 'User updated successfully'
    })
    
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update user' 
      },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params
    
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id }
    })
    
    if (!user) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'User not found' 
        },
        { status: 404 }
      )
    }
    
    // Soft delete (deactivate) instead of hard delete for data integrity
    await prisma.user.update({
      where: { id },
      data: {
        isActive: false,
        email: `${user.email}.deleted.${Date.now()}` // Prevent email conflicts
      }
    })
    
    return NextResponse.json({
      success: true,
      message: 'User deleted successfully'
    })
    
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to delete user' 
      },
      { status: 500 }
    )
  }
}