import { z } from 'zod'
import { OrganizationType, SppgStatus } from '@prisma/client'

// SPPG creation schema
export const createSPPGSchema = z.object({
  name: z.string()
    .min(1, 'Nama SPPG wajib diisi')
    .max(255, 'Nama terlalu panjang'),
  email: z.string()
    .email('Format email tidak valid')
    .optional()
    .or(z.literal('')),
  phone: z.string()
    .optional()
    .or(z.literal('')),
  address: z.string()
    .optional()
    .or(z.literal('')),
  organizationType: z.nativeEnum(OrganizationType),
  provinceId: z.number().positive('Provinsi tidak valid'),
  targetRecipients: z.number()
    .positive('Target penerima harus lebih dari 0')
    .optional(),
  picName: z.string()
    .optional()
    .or(z.literal('')),
  picPhone: z.string()
    .optional()
    .or(z.literal('')),
  picEmail: z.string()
    .email('Format email PIC tidak valid')
    .optional()
    .or(z.literal(''))
})

// SPPG update schema
export const updateSPPGSchema = createSPPGSchema.partial().extend({
  status: z.nativeEnum(SppgStatus).optional()
})

// SPPG filters schema
export const sppgFiltersSchema = z.object({
  search: z.string().optional(),
  status: z.nativeEnum(SppgStatus).optional(),
  organizationType: z.nativeEnum(OrganizationType).optional(),
  provinceId: z.number().positive().optional(),
  isActive: z.boolean().optional()
})

// Bulk actions schema
export const sppgBulkActionSchema = z.object({
  sppgIds: z.array(z.string()).min(1, 'Pilih minimal 1 SPPG'),
  action: z.enum(['activate', 'deactivate', 'delete'])
})

// Pagination schema
export const paginationSchema = z.object({
  page: z.number().positive().default(1),
  limit: z.number().positive().max(100).default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc')
})

// Type exports
export type CreateSPPGInput = z.infer<typeof createSPPGSchema>
export type UpdateSPPGInput = z.infer<typeof updateSPPGSchema>
export type SPPGFiltersInput = z.infer<typeof sppgFiltersSchema>
export type SPPGBulkActionInput = z.infer<typeof sppgBulkActionSchema>
export type PaginationInput = z.infer<typeof paginationSchema>