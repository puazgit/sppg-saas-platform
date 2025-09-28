/**
 * Enum constants untuk subscription forms
 * Sinkronisasi dengan Prisma schema enums
 */

// Staff roles/positions untuk PIC
export const STAFF_POSITIONS = {
  SPPG_MANAGER: 'Manajer SPPG',
  PRODUCTION_SUPERVISOR: 'Supervisor Produksi',
  HEAD_CHEF: 'Chef Kepala',
  ASSISTANT_CHEF: 'Asisten Chef',
  DISTRIBUTION_COORDINATOR: 'Koordinator Distribusi',
  DRIVER: 'Driver',
  INVENTORY_ADMIN: 'Admin Inventory',
  QUALITY_CONTROL: 'Quality Control',
  FIELD_STAFF: 'Staff Lapangan'
} as const

export const STAFF_POSITION_VALUES = Object.keys(STAFF_POSITIONS) as Array<keyof typeof STAFF_POSITIONS>

// Organization types
export const ORGANIZATION_TYPES = {
  PEMERINTAH: 'Pemerintah',
  SWASTA: 'Swasta',
  YAYASAN: 'Yayasan',
  KOMUNITAS: 'Komunitas',
  LAINNYA: 'Lainnya'
} as const

export const ORGANIZATION_TYPE_VALUES = Object.keys(ORGANIZATION_TYPES) as Array<keyof typeof ORGANIZATION_TYPES>

// Helper functions
export const getPositionDisplayName = (position: string): string => {
  return STAFF_POSITIONS[position as keyof typeof STAFF_POSITIONS] || position
}

export const getOrganizationDisplayName = (orgType: string): string => {
  return ORGANIZATION_TYPES[orgType as keyof typeof ORGANIZATION_TYPES] || orgType
}