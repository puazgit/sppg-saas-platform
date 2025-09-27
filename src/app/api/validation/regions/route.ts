import { NextRequest, NextResponse } from 'next/server'
import { validateRegionHierarchy, validateSppgCode, checkRegionSppgAvailability } from '@/lib/validation/regions'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      provinceId, 
      regencyId, 
      districtId, 
      villageId, 
      sppgCode, 
      excludeSppgId 
    } = body

    // Validate required fields
    if (!provinceId || !regencyId || !districtId || !villageId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields',
          message: 'Semua field wilayah wajib diisi'
        },
        { status: 400 }
      )
    }

    // Validate region hierarchy
    const regionValidation = await validateRegionHierarchy(
      provinceId,
      regencyId, 
      districtId,
      villageId
    )

    if (!regionValidation.isValid) {
      return NextResponse.json({
        success: false,
        error: 'INVALID_REGION_HIERARCHY',
        message: 'Hierarki wilayah tidak valid',
        validationErrors: regionValidation.errors
      }, { status: 400 })
    }

    // Validate SPPG code if provided
    let codeValidation = true
    if (sppgCode) {
      codeValidation = await validateSppgCode(sppgCode, excludeSppgId)
      if (!codeValidation) {
        return NextResponse.json({
          success: false,
          error: 'SPPG_CODE_EXISTS',
          message: 'Kode SPPG sudah digunakan, silakan gunakan kode lain'
        }, { status: 400 })
      }
    }

    // Check region availability
    const availabilityCheck = await checkRegionSppgAvailability(
      provinceId,
      regencyId,
      districtId, 
      villageId
    )

    if (!availabilityCheck.available) {
      return NextResponse.json({
        success: false,
        error: 'REGION_NOT_AVAILABLE',
        message: 'Wilayah ini sudah memiliki SPPG aktif',
        existingSppg: availabilityCheck.existingSppg
      }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: 'Validasi berhasil, wilayah tersedia untuk SPPG baru',
      data: {
        regionValid: true,
        codeValid: codeValidation,
        regionAvailable: true
      }
    })

  } catch (error) {
    console.error('Error in region validation API:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'VALIDATION_ERROR',
        message: 'Terjadi kesalahan saat validasi'
      },
      { status: 500 }
    )
  }
}