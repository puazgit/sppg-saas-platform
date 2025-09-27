import { useQuery } from '@tanstack/react-query'

interface Region {
  id: string
  name: string
}

interface RegionResponse {
  success: boolean
  data: Region[]
  error?: string
}

// Fetch provinces
export function useProvinces() {
  return useQuery({
    queryKey: ['provinces'],
    queryFn: async (): Promise<Region[]> => {
      const response = await fetch('/api/regions/provinces')
      const result: RegionResponse = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch provinces')
      }
      
      return result.data
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  })
}

// Fetch regencies by province
export function useRegencies(provinceId: string | null) {
  return useQuery({
    queryKey: ['regencies', provinceId],
    queryFn: async (): Promise<Region[]> => {
      if (!provinceId) return []
      
      const response = await fetch(`/api/regions/regencies/${provinceId}`)
      const result: RegionResponse = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch regencies')
      }
      
      return result.data
    },
    enabled: !!provinceId,
    staleTime: 1000 * 60 * 60, // 1 hour
  })
}

// Fetch districts by regency
export function useDistricts(regencyId: string | null) {
  return useQuery({
    queryKey: ['districts', regencyId],
    queryFn: async (): Promise<Region[]> => {
      if (!regencyId) return []
      
      const response = await fetch(`/api/regions/districts/${regencyId}`)
      const result: RegionResponse = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch districts')
      }
      
      return result.data
    },
    enabled: !!regencyId,
    staleTime: 1000 * 60 * 60, // 1 hour
  })
}

// Fetch villages by district
export function useVillages(districtId: string | null) {
  return useQuery({
    queryKey: ['villages', districtId],
    queryFn: async (): Promise<Region[]> => {
      if (!districtId) return []
      
      const response = await fetch(`/api/regions/villages/${districtId}`)
      const result: RegionResponse = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch villages')
      }
      
      return result.data
    },
    enabled: !!districtId,
    staleTime: 1000 * 60 * 60, // 1 hour
  })
}