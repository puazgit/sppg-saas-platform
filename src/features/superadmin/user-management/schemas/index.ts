import { z } from 'zod'
import { UserType } from '@prisma/client'

// User base schema
export const userBaseSchema = z.object({
  id: z.string().cuid(),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  userType: z.nativeEnum(UserType),
  isActive: z.boolean(),
  sppgId: z.string().cuid().nullable(),
  lastLogin: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

// Create user schema
export const createUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  userType: z.nativeEnum(UserType),
  sppgId: z.string().cuid().optional().nullable(),
  roleIds: z.array(z.string().cuid()).optional(),
  isActive: z.boolean().default(true),
})

// Update user schema
export const updateUserSchema = createUserSchema.partial().extend({
  id: z.string().cuid()
})

// User filters schema
export const userFiltersSchema = z.object({
  search: z.string().optional(),
  userType: z.nativeEnum(UserType).optional(),
  sppgId: z.string().cuid().optional(),
  isActive: z.boolean().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
})

// Bulk actions schema
export const bulkUserActionSchema = z.object({
  userIds: z.array(z.string().cuid()).min(1, 'Select at least one user'),
  action: z.enum(['activate', 'deactivate', 'delete']),
})

// User with relations schema
export const userWithRelationsSchema = userBaseSchema.extend({
  sppg: z.object({
    id: z.string(),
    name: z.string(),
    province: z.object({
      name: z.string()
    }).nullable()
  }).nullable(),
  userRoles: z.array(z.object({
    role: z.object({
      id: z.string(),
      name: z.string(),
      description: z.string().nullable()
    })
  })),
})

// User statistics schema
export const userStatsSchema = z.object({
  total: z.number(),
  superAdmins: z.number(),
  sppgUsers: z.number(),
  activeUsers: z.number(),
  inactiveUsers: z.number(),
  recentLogins: z.number(),
})

// API responses
export const usersListResponseSchema = z.object({
  users: z.array(userWithRelationsSchema),
  stats: userStatsSchema,
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    totalCount: z.number(),
    totalPages: z.number(),
    hasNextPage: z.boolean(),
    hasPrevPage: z.boolean(),
  })
})

// Type exports
export type User = z.infer<typeof userBaseSchema>
export type CreateUserInput = z.infer<typeof createUserSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>
export type UserFilters = z.infer<typeof userFiltersSchema>
export type BulkUserAction = z.infer<typeof bulkUserActionSchema>
export type UserWithRelations = z.infer<typeof userWithRelationsSchema>
export type UserStats = z.infer<typeof userStatsSchema>
export type UsersListResponse = z.infer<typeof usersListResponseSchema>