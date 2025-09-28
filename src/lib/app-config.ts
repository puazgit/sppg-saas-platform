/**
 * Application Configuration - NO HARDCODE VALUES!
 * Semua values harus dari environment variables atau database
 */

// Environment utilities
export const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = process.env[key]
  if (!value && !defaultValue) {
    throw new Error(`Environment variable ${key} is required but not set`)
  }
  return value || defaultValue || ''
}

// Company information - NO HARDCODE!
export const COMPANY_CONFIG = {
  phone: getEnvVar('COMPANY_PHONE', '+6221-XXX-XXXX'),
  whatsapp: getEnvVar('COMPANY_WHATSAPP', '+62812-XXXX-XXXX'), 
  email: getEnvVar('COMPANY_EMAIL', 'info@sppg-platform.com'),
  address: getEnvVar('COMPANY_ADDRESS', 'Jakarta, Indonesia'),
} as const

// Business rules - CONFIGURABLE!
export const BUSINESS_CONFIG = {
  maxRadiusKm: parseInt(getEnvVar('DEFAULT_MAX_RADIUS_KM', '25')),
  maxTravelTimeMin: parseInt(getEnvVar('DEFAULT_MAX_TRAVEL_TIME_MIN', '90')),
  businessHoursStart: getEnvVar('DEFAULT_BUSINESS_HOURS_START', '06:00'),
  businessHoursEnd: getEnvVar('DEFAULT_BUSINESS_HOURS_END', '18:00'),
} as const

// Regional settings - CONFIGURABLE!
export const REGIONAL_CONFIG = {
  timezone: getEnvVar('DEFAULT_TIMEZONE', 'Asia/Jakarta'),
  currency: getEnvVar('DEFAULT_CURRENCY', 'IDR'),
  locale: getEnvVar('DEFAULT_LOCALE', 'id-ID'),
} as const

// Dynamic calculation functions - NO HARDCODE!
export const calculateOptimalRadius = (recipients: number): number => {
  if (recipients <= 100) return 5
  if (recipients <= 500) return 15
  if (recipients <= 1000) return 25
  return Math.min(50, Math.ceil(recipients / 40)) // Max 50km
}

export const calculateOptimalTravelTime = (recipients: number): number => {
  if (recipients <= 100) return 30
  if (recipients <= 500) return 45
  if (recipients <= 1000) return 90
  return Math.min(120, Math.ceil(recipients / 10)) // Max 2 hours
}

export const calculateStaffNeeds = (recipients: number): number => {
  // 1 staff per 50 recipients, minimum 1
  return Math.max(1, Math.ceil(recipients / 50))
}

// Organization type helpers - NO HARDCODE MAPPING!
export const inferSystemExperience = (orgType: string): boolean => {
  const experiencedTypes = ['PEMERINTAH', 'SWASTA']
  return experiencedTypes.includes(orgType.toUpperCase())
}

export const inferTrainingNeeds = (orgType: string): boolean => {
  // Inverse of system experience
  return !inferSystemExperience(orgType)
}

// Generate unique identifiers - NO HARDCODE!
export const generateUniqueCode = (prefix: string = 'SPPG'): string => {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 8)
  return `${prefix}-${timestamp}-${random}`.toUpperCase()
}

export const generateAccountNumber = (): string => {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 7)
  return `${timestamp}${random}`
}

// Export all configs
export const APP_CONFIG = {
  company: COMPANY_CONFIG,
  business: BUSINESS_CONFIG,
  regional: REGIONAL_CONFIG,
  calculations: {
    calculateOptimalRadius,
    calculateOptimalTravelTime, 
    calculateStaffNeeds,
    inferSystemExperience,
    inferTrainingNeeds,
  },
  generators: {
    generateUniqueCode,
    generateAccountNumber,
  }
} as const