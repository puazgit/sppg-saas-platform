/**
 * Subscription Feature - Enterprise Custom Hooks
 * Reusable hooks for subscription logic and data fetching with comprehensive error handling
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import { SubscriptionAPI, type SubscriptionPackage, type ApiError } from '../services/subscription-api'
import { useSubscriptionStore } from '../store/subscription.store'
import { RegistrationData, PaymentData } from '../schemas/subscription.schema'
import { registrationDataSchema, paymentDataSchema } from '../schemas/subscription.schema'
import { z } from 'zod'

// Enterprise hook for fetching subscription packages with comprehensive error handling
export const useSubscriptionPackages = () => {
  return useQuery<SubscriptionPackage[], ApiError>({
    queryKey: ['subscription', 'packages'],
    queryFn: async () => {
      try {
        return await SubscriptionAPI.getPackages()
      } catch (error) {
        console.error('[useSubscriptionPackages] Failed to fetch packages:', error)
        throw error
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - enterprise caching
    gcTime: 10 * 60 * 1000, // 10 minutes - memory management
  })
}

// Hook for package pricing calculation
export const usePackagePricing = (packageId?: string, isYearly: boolean = false) => {
  return useQuery({
    queryKey: ['subscription', 'pricing', packageId, isYearly],
    queryFn: () => SubscriptionAPI.getPackagePricing(packageId!, isYearly ? 'ANNUAL' : 'MONTHLY'),
    enabled: !!packageId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

// Hook for validating registration data
export const useRegistrationValidation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: RegistrationData) => 
      SubscriptionAPI.validateOrganization(data.name, data.email),
    onSuccess: (result, variables) => {
      // Cache validation result
      queryClient.setQueryData(
        ['subscription', 'validation', variables.code], 
        result
      )
    },
  })
}

// Hook for creating SPPG subscription
export const useCreateSppgSubscription = () => {
  const queryClient = useQueryClient()
  const { setLoading, setError, markStepCompleted, nextStep } = useSubscriptionStore()
  
  return useMutation({
    mutationFn: async () => {
      setLoading(true)
      setError(null)
      
      try {
        // Mock implementation - replace with actual API call
        const result = await Promise.resolve({ subscriptionId: 'mock-id', success: true })
        return result
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Unknown error')
        throw error
      } finally {
        setLoading(false)
      }
    },
    onSuccess: (data) => {
      // Mark current step as completed
      markStepCompleted(4) // Payment step
      nextStep() // Move to success step
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['subscription'] })
      
      // Cache the created subscription
      queryClient.setQueryData(['subscription', 'current'], data)
    },
    onError: (error) => {
      console.error('Subscription creation error:', error)
    }
  })
}

// Hook for validating form data with Zod
export const useFormValidation = () => {
  const { setValidationErrors, clearValidationErrors } = useSubscriptionStore()
  
  const validateRegistration = useCallback((data: Partial<RegistrationData>) => {
    try {
      registrationDataSchema.parse(data)
      clearValidationErrors()
      return { isValid: true, errors: {} }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string[]> = {}
        error.issues.forEach((err) => {
          const field = err.path.join('.')
          if (!errors[field]) {
            errors[field] = []
          }
          errors[field].push(err.message)
        })
        setValidationErrors(errors)
        return { isValid: false, errors }
      }
      return { isValid: false, errors: {} }
    }
  }, [setValidationErrors, clearValidationErrors])

  const validatePayment = useCallback((data: Partial<PaymentData>) => {
    try {
      paymentDataSchema.parse(data)
      return { isValid: true, errors: {} }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string[]> = {}
        error.issues.forEach((err) => {
          const field = err.path.join('.')
          if (!errors[field]) {
            errors[field] = []
          }
          errors[field].push(err.message)
        })
        return { isValid: false, errors }
      }
      return { isValid: false, errors: {} }
    }
  }, [])

  return {
    validateRegistration,
    validatePayment
  }
}

// Hook for subscription flow navigation
export const useSubscriptionNavigation = () => {
  const { 
    currentStep, 
    selectedPackage, 
    registrationData, 
    paymentData,
    setStep, 
    nextStep, 
    prevStep,
    markStepCompleted,
    resetToStep
  } = useSubscriptionStore()

  const canProceedToStep = useCallback((step: number): boolean => {
    switch (step) {
      case 1: // Package selection
        return true
      case 2: // Registration
        return !!selectedPackage
      case 3: // Confirmation
        const requiredFields = ['code', 'name', 'email', 'phone', 'address', 'provinceId', 'regencyId']
        return requiredFields.every(field => !!registrationData[field as keyof RegistrationData])
      case 4: // Payment
        return !!registrationData.code && !!registrationData.name
      case 5: // Success
        return !!paymentData?.method
      default:
        return false
    }
  }, [selectedPackage, registrationData, paymentData])

  const goToStep = useCallback((step: number) => {
    if (canProceedToStep(step)) {
      setStep(step)
    }
  }, [canProceedToStep, setStep])

  const goNext = useCallback(() => {
    if (canProceedToStep(currentStep + 1)) {
      markStepCompleted(currentStep)
      nextStep()
    }
  }, [currentStep, canProceedToStep, markStepCompleted, nextStep])

  const goPrev = useCallback(() => {
    prevStep()
  }, [prevStep])

  const restart = useCallback(() => {
    resetToStep(1)
  }, [resetToStep])

  return {
    currentStep,
    canProceedToStep,
    goToStep,
    goNext,
    goPrev,
    restart
  }
}

// Hook for auto-save functionality
export const useAutoSave = () => {
  const { saveDraft, isDraft } = useSubscriptionStore()
  
  const saveData = useCallback(async () => {
    if (isDraft) {
      try {
        // Mock implementation - replace with actual API call
        await Promise.resolve()
        saveDraft()
      } catch (error) {
        console.error('Auto-save failed:', error)
      }
    }
  }, [saveDraft, isDraft])

  // Auto-save logic would go here with useEffect
  // Simplified for now
  
  return {
    saveData,
    isDraft
  }
}

// Hook for subscription progress tracking
export const useSubscriptionProgress = () => {
  const { completedSteps, currentStep } = useSubscriptionStore()
  
  const totalSteps = 5
  const completedCount = completedSteps.length
  const progressPercentage = Math.round((completedCount / totalSteps) * 100)
  
  const stepStatus = {
    1: completedSteps.includes(1) ? 'completed' : currentStep === 1 ? 'active' : 'pending',
    2: completedSteps.includes(2) ? 'completed' : currentStep === 2 ? 'active' : 'pending',
    3: completedSteps.includes(3) ? 'completed' : currentStep === 3 ? 'active' : 'pending',
    4: completedSteps.includes(4) ? 'completed' : currentStep === 4 ? 'active' : 'pending',
    5: completedSteps.includes(5) ? 'completed' : currentStep === 5 ? 'active' : 'pending',
  }

  return {
    progressPercentage,
    completedSteps,
    currentStep,
    totalSteps,
    stepStatus
  }
}

// Hook for handling subscription errors
export const useSubscriptionErrorHandling = () => {
  const { error, setError, clearError } = useSubscriptionStore()
  
  const handleError = useCallback((err: unknown) => {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
    setError(errorMessage)
  }, [setError])

  const clearCurrentError = useCallback(() => {
    clearError()
  }, [clearError])

  return {
    error,
    handleError,
    clearError: clearCurrentError,
    hasError: !!error
  }
}