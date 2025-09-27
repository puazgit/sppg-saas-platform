import { useMutation } from '@tanstack/react-query'

interface RegionValidationRequest {
  provinceId: string
  regencyId: string
  districtId: string
  villageId: string
  sppgCode?: string
  excludeSppgId?: string
}

interface RegionValidationError {
  field: string
  message: string
  code: string
}

interface RegionValidationResponse {
  success: boolean
  message: string
  data?: {
    regionValid: boolean
    codeValid: boolean
    regionAvailable: boolean
  }
  error?: string
  validationErrors?: RegionValidationError[]
  existingSppg?: {
    id: string
    name: string
    code: string
  }
}

export const useRegionValidation = () => {
  return useMutation({
    mutationFn: async (request: RegionValidationRequest): Promise<RegionValidationResponse> => {
      const response = await fetch('/api/validation/regions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Validation failed')
      }

      return response.json()
    },
    onError: (error) => {
      console.error('Region validation error:', error)
    }
  })
}

// Hook for real-time validation during form filling
export const useRealtimeRegionValidation = () => {
  const mutation = useRegionValidation()

  const validateRegion = async (data: RegionValidationRequest) => {
    try {
      return await mutation.mutateAsync(data)
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Validation failed'
      }
    }
  }

  return {
    validateRegion,
    isValidating: mutation.isPending,
    error: mutation.error,
    reset: mutation.reset
  }
}