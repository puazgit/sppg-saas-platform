import Redis from 'ioredis'

interface RegionData {
  id: string
  name: string
  code: string
  [key: string]: unknown
}

interface ValidationResult {
  isValid: boolean
  errors?: Array<{
    field: string
    message: string
    code: string
  }>
  [key: string]: unknown
}

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD || undefined,
  lazyConnect: true,
  maxRetriesPerRequest: 3
})

// Cache keys
const CACHE_KEYS = {
  PROVINCES: 'regions:provinces',
  REGENCIES: (provinceId: string) => `regions:regencies:${provinceId}`,
  DISTRICTS: (regencyId: string) => `regions:districts:${regencyId}`,
  VILLAGES: (districtId: string) => `regions:villages:${districtId}`,
  REGION_HIERARCHY: (provinceId: string, regencyId: string, districtId: string, villageId: string) => 
    `regions:hierarchy:${provinceId}:${regencyId}:${districtId}:${villageId}`,
} as const

// Cache TTL (time to live) in seconds
const CACHE_TTL = {
  REGIONS: 24 * 60 * 60, // 24 hours - regions data rarely changes
  VALIDATION: 60 * 60, // 1 hour - validation results
} as const

export class RegionCache {
  // Get cached data
  static async get<T>(key: string): Promise<T | null> {
    try {
      const cached = await redis.get(key)
      return cached ? JSON.parse(cached) : null
    } catch (error) {
      console.error('Redis GET error:', error)
      return null
    }
  }

  // Set cache data
  static async set(key: string, data: unknown, ttl: number = CACHE_TTL.REGIONS): Promise<void> {
    try {
      await redis.setex(key, ttl, JSON.stringify(data))
    } catch (error) {
      console.error('Redis SET error:', error)
    }
  }

  // Delete cache key
  static async del(key: string): Promise<void> {
    try {
      await redis.del(key)
    } catch (error) {
      console.error('Redis DEL error:', error)
    }
  }

  // Clear all region caches (useful for admin updates)
  static async clearAll(): Promise<void> {
    try {
      const keys = await redis.keys('regions:*')
      if (keys.length > 0) {
        await redis.del(...keys)
      }
    } catch (error) {
      console.error('Redis CLEAR error:', error)
    }
  }

  // Cache provinces
  static async cacheProvinces(provinces: RegionData[]): Promise<void> {
    await this.set(CACHE_KEYS.PROVINCES, provinces)
  }

  static async getProvinces<T>(): Promise<T | null> {
    return this.get<T>(CACHE_KEYS.PROVINCES)
  }

  // Cache regencies
  static async cacheRegencies(provinceId: string, regencies: RegionData[]): Promise<void> {
    await this.set(CACHE_KEYS.REGENCIES(provinceId), regencies)
  }

  static async getRegencies<T>(provinceId: string): Promise<T | null> {
    return this.get<T>(CACHE_KEYS.REGENCIES(provinceId))
  }

  // Cache districts
  static async cacheDistricts(regencyId: string, districts: RegionData[]): Promise<void> {
    await this.set(CACHE_KEYS.DISTRICTS(regencyId), districts)
  }

  static async getDistricts<T>(regencyId: string): Promise<T | null> {
    return this.get<T>(CACHE_KEYS.DISTRICTS(regencyId))
  }

  // Cache villages
  static async cacheVillages(districtId: string, villages: RegionData[]): Promise<void> {
    await this.set(CACHE_KEYS.VILLAGES(districtId), villages)
  }

  static async getVillages<T>(districtId: string): Promise<T | null> {
    return this.get<T>(CACHE_KEYS.VILLAGES(districtId))
  }

  // Cache validation results
  static async cacheValidation(
    provinceId: string, 
    regencyId: string, 
    districtId: string, 
    villageId: string,
    result: ValidationResult
  ): Promise<void> {
    const key = CACHE_KEYS.REGION_HIERARCHY(provinceId, regencyId, districtId, villageId)
    await this.set(key, result, CACHE_TTL.VALIDATION)
  }

  static async getValidation<T>(
    provinceId: string, 
    regencyId: string, 
    districtId: string, 
    villageId: string
  ): Promise<T | null> {
    const key = CACHE_KEYS.REGION_HIERARCHY(provinceId, regencyId, districtId, villageId)
    return this.get<T>(key)
  }
}

export { redis }
export default RegionCache