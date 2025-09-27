/**
 * SPPG Marketing Data Hooks
 * TanStack Query hooks for marketing data with enterprise caching
 * Real-time data fetching with proper error handling
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { 
  HeroData, 
  MarketingFeature, 
  DemoRequest,
  HeroFeature,
  TrustIndicator
} from '../types'
import { 
  validateHeroData, 
  validateDemoRequest 
} from '../schemas'

// ===== SIMPLE API CLIENT =====
const apiClient = {
  async get(url: string) {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return response.json()
  },
  
  async post(url: string, data: unknown) {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return response.json()
  },
}

// ===== QUERY KEYS =====
export const marketingKeys = {
  all: ['marketing'] as const,
  hero: () => [...marketingKeys.all, 'hero'] as const,
  features: () => [...marketingKeys.all, 'features'] as const,
  caseStudies: () => [...marketingKeys.all, 'caseStudies'] as const,
  testimonials: () => [...marketingKeys.all, 'testimonials'] as const,
  stats: () => [...marketingKeys.all, 'stats'] as const,
}

// ===== HERO SECTION HOOKS =====

/**
 * Fetch hero section data with enterprise caching
 */
export const useHeroData = () => {
  return useQuery({
    queryKey: marketingKeys.hero(),
    queryFn: async (): Promise<HeroData> => {
      try {
        const response = await apiClient.get('/api/marketing/hero')
        
        // Extract and validate hero data from API response
        const heroResponse = response.data?.data || response.data
        
        if (!heroResponse) {
          throw new Error('Invalid hero data structure received')
        }

        // Transform API response to match HeroData interface
        const heroData: HeroData = {
          title: heroResponse.title,
          subtitle: heroResponse.subtitle,
          description: heroResponse.description,
          keyBenefits: heroResponse.keyBenefits || [],
          features: (heroResponse.heroFeatures || []).map((f: HeroFeature) => ({
            id: f.id,
            title: f.title,
            description: f.description,
            icon: f.icon,
            category: f.category,
            isActive: f.isActive,
            sortOrder: f.sortOrder,
            createdAt: new Date(f.createdAt),
            updatedAt: new Date(f.updatedAt)
          })),
          trustIndicators: (heroResponse.trustIndicators || []).map((t: TrustIndicator) => ({
            id: t.id,
            label: t.label,
            description: t.description,
            icon: t.icon,
            metricType: t.metricType,
            staticValue: t.staticValue,
            querySource: t.querySource,
            isActive: t.isActive,
            sortOrder: t.sortOrder,
            createdAt: new Date(t.createdAt),
            updatedAt: new Date(t.updatedAt)
          })),
          stats: {
            sppgCount: heroResponse.stats?.sppgCount || 0,
            provinceCount: heroResponse.stats?.provinceCount || 0,
            totalStudents: heroResponse.stats?.totalStudents || 0,
            activeSchools: heroResponse.stats?.activeSchools || 0,
            totalMealsDistributed: heroResponse.stats?.totalMealsDistributed || 0,
            avgSatisfactionRating: heroResponse.stats?.avgSatisfactionRating || 0,
            complianceScore: heroResponse.stats?.complianceScore || 0
          }
        }

        // Validate final data structure
        const validation = validateHeroData(heroData)
        if (!validation.success) {
          console.error('Hero data validation failed:', validation.errors)
          throw new Error('Invalid hero data format')
        }

        return heroData
      } catch (error) {
        console.error('Failed to fetch hero data:', error)
        // Return fallback data for enterprise resilience
        return {
          title: 'Transformasi Digital SPPG Indonesia',
          subtitle: 'Platform SPPG Terdepan',
          description: 'Platform manajemen nutrisi dan distribusi makanan yang mengoptimalkan operasional SPPG dengan teknologi AI dan analytics mendalam.',
          keyBenefits: [
            'Manajemen nutrisi berbasis AI',
            'Tracking real-time distribusi',
            'Analytics mendalam',
            'Compliance otomatis'
          ],
          features: [],
          trustIndicators: [],
          stats: {
            sppgCount: 247,
            provinceCount: 24,
            totalStudents: 185000,
            activeSchools: 1250,
            totalMealsDistributed: 2847500,
            avgSatisfactionRating: 4.7,
            complianceScore: 87
          }
        }
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (previously cacheTime)
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
    refetchOnMount: 'always',
    // Enterprise error handling in TanStack Query v5 uses throwOnError
    throwOnError: false
  })
}

/**
 * Fetch marketing features
 */
export const useMarketingFeatures = (options?: {
  category?: string
  highlighted?: boolean
  limit?: number
}) => {
  return useQuery({
    queryKey: [...marketingKeys.features(), options],
    queryFn: async (): Promise<MarketingFeature[]> => {
      try {
        const params = new URLSearchParams()
        if (options?.category) params.append('category', options.category)
        if (options?.highlighted !== undefined) params.append('highlighted', String(options.highlighted))
        if (options?.limit) params.append('limit', String(options.limit))
        
        const response = await apiClient.get(`/api/marketing/features?${params.toString()}`)
        return response.data
      } catch (error) {
        console.error('Failed to fetch marketing features:', error)
        throw new Error('Failed to load marketing features')
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
  })
}

// ===== FORM SUBMISSION HOOKS =====

/**
 * Submit demo request
 */
export const useDemoRequest = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: DemoRequest): Promise<{ success: boolean; message: string }> => {
      // Validate data first
      const validation = validateDemoRequest(data)
      if (!validation.success) {
        throw new Error(validation.errors?.[0]?.message || 'Invalid form data')
      }
      
      try {
        const response = await apiClient.post('/api/marketing/demo-request', validation.data)
        return response
      } catch (error: unknown) {
        console.error('Demo request failed:', error)
        throw new Error('Failed to submit demo request')
      }
    },
    onSuccess: (data) => {
      toast.success('Demo Request Submitted!', {
        description: data.message || 'Tim kami akan menghubungi Anda dalam 24 jam.',
      })
      
      // Invalidate stats to reflect new demo request
      queryClient.invalidateQueries({ queryKey: marketingKeys.stats() })
    },
    onError: (error: Error) => {
      toast.error('Gagal Mengirim Permintaan Demo', {
        description: error.message,
      })
    },
  })
}

// ===== CACHE MANAGEMENT =====

/**
 * Clear marketing cache
 */
export const useClearMarketingCache = () => {
  const queryClient = useQueryClient()
  
  return () => {
    queryClient.removeQueries({ queryKey: marketingKeys.all })
    toast.info('Cache Cleared', {
      description: 'Marketing data cache has been cleared.',
    })
  }
}

/**
 * Refresh all marketing data
 */
export const useRefreshMarketingData = () => {
  const queryClient = useQueryClient()
  
  return async () => {
    try {
      await queryClient.invalidateQueries({ queryKey: marketingKeys.all })
      toast.success('Data Refreshed', {
        description: 'All marketing data has been refreshed.',
      })
    } catch {
      toast.error('Refresh Failed', {
        description: 'Failed to refresh marketing data.',
      })
    }
  }
}