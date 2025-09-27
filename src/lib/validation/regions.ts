import { prisma } from '@/lib/prisma'

/**
 * Region Validation Utilities
 * Server-side validation untuk memastikan hierarki wilayah valid
 */

export interface RegionValidationError {
  field: string
  message: string
  code: string
}

export interface RegionValidationResult {
  isValid: boolean
  errors: RegionValidationError[]
}

/**
 * Validate region hierarchy untuk SPPG registration
 */
export async function validateRegionHierarchy(
  provinceId: string,
  regencyId: string,
  districtId: string,
  villageId: string
): Promise<RegionValidationResult> {
  const errors: RegionValidationError[] = []

  try {
    // 1. Validate Province exists
    if (!provinceId) {
      errors.push({
        field: 'provinceId',
        message: 'Provinsi wajib dipilih',
        code: 'PROVINCE_REQUIRED'
      })
    } else {
      const province = await prisma.province.findUnique({
        where: { id: provinceId }
      })
      
      if (!province) {
        errors.push({
          field: 'provinceId',
          message: 'Provinsi tidak valid atau tidak ditemukan',
          code: 'PROVINCE_NOT_FOUND'
        })
      }
    }

    // 2. Validate Regency exists and belongs to Province
    if (!regencyId) {
      errors.push({
        field: 'regencyId',
        message: 'Kabupaten/Kota wajib dipilih',
        code: 'REGENCY_REQUIRED'
      })
    } else {
      const regency = await prisma.regency.findUnique({
        where: { id: regencyId },
        include: { province: true }
      })
      
      if (!regency) {
        errors.push({
          field: 'regencyId',
          message: 'Kabupaten/Kota tidak valid atau tidak ditemukan',
          code: 'REGENCY_NOT_FOUND'
        })
      } else if (regency.provinceId !== provinceId) {
        errors.push({
          field: 'regencyId',
          message: 'Kabupaten/Kota tidak sesuai dengan provinsi yang dipilih',
          code: 'REGENCY_PROVINCE_MISMATCH'
        })
      }
    }

    // 3. Validate District exists and belongs to Regency
    if (!districtId) {
      errors.push({
        field: 'districtId',
        message: 'Kecamatan wajib dipilih',
        code: 'DISTRICT_REQUIRED'
      })
    } else {
      const district = await prisma.district.findUnique({
        where: { id: districtId },
        include: { regency: true }
      })
      
      if (!district) {
        errors.push({
          field: 'districtId',
          message: 'Kecamatan tidak valid atau tidak ditemukan',
          code: 'DISTRICT_NOT_FOUND'
        })
      } else if (district.regencyId !== regencyId) {
        errors.push({
          field: 'districtId',
          message: 'Kecamatan tidak sesuai dengan kabupaten/kota yang dipilih',
          code: 'DISTRICT_REGENCY_MISMATCH'
        })
      }
    }

    // 4. Validate Village exists and belongs to District
    if (!villageId) {
      errors.push({
        field: 'villageId',
        message: 'Desa/Kelurahan wajib dipilih',
        code: 'VILLAGE_REQUIRED'
      })
    } else {
      const village = await prisma.village.findUnique({
        where: { id: villageId },
        include: { district: true }
      })
      
      if (!village) {
        errors.push({
          field: 'villageId',
          message: 'Desa/Kelurahan tidak valid atau tidak ditemukan',
          code: 'VILLAGE_NOT_FOUND'
        })
      } else if (village.districtId !== districtId) {
        errors.push({
          field: 'villageId',
          message: 'Desa/Kelurahan tidak sesuai dengan kecamatan yang dipilih',
          code: 'VILLAGE_DISTRICT_MISMATCH'
        })
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    }

  } catch (error) {
    console.error('Error validating region hierarchy:', error)
    return {
      isValid: false,
      errors: [{
        field: 'general',
        message: 'Terjadi kesalahan saat validasi wilayah',
        code: 'VALIDATION_ERROR'
      }]
    }
  }
}

/**
 * Get region display name with full hierarchy
 */
export async function getRegionDisplayName(
  provinceId: string,
  regencyId: string,
  districtId: string,
  villageId: string
): Promise<string | null> {
  try {
    const village = await prisma.village.findUnique({
      where: { id: villageId },
      include: {
        district: {
          include: {
            regency: {
              include: {
                province: true
              }
            }
          }
        }
      }
    })

    if (!village) return null

    return `${village.name}, ${village.district.name}, ${village.district.regency.name}, ${village.district.regency.province.name}`
  } catch (error) {
    console.error('Error getting region display name:', error)
    return null
  }
}

/**
 * Validate SPPG code uniqueness
 */
export async function validateSppgCode(code: string, excludeId?: string): Promise<boolean> {
  try {
    const existing = await prisma.sPPG.findUnique({
      where: { code }
    })

    if (!existing) return true
    if (excludeId && existing.id === excludeId) return true
    
    return false
  } catch (error) {
    console.error('Error validating SPPG code:', error)
    return false
  }
}

/**
 * Check if region already has active SPPG
 */
export async function checkRegionSppgAvailability(
  provinceId: string,
  regencyId: string,
  districtId: string,
  villageId: string
): Promise<{ available: boolean; existingSppg?: { id: string; name: string; code: string } }> {
  try {
    const existingSppg = await prisma.sPPG.findFirst({
      where: {
        provinceId,
        regencyId,
        districtId,
        villageId,
        status: {
          in: ['ACTIVE', 'PENDING_APPROVAL']
        }
      },
      select: {
        id: true,
        name: true,
        code: true
      }
    })

    return {
      available: !existingSppg,
      existingSppg: existingSppg || undefined
    }
  } catch (error) {
    console.error('Error checking region SPPG availability:', error)
    return { available: false }
  }
}