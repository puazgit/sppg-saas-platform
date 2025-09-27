/**
 * SPPG Marketing Store
 * Zustand store for marketing feature state management
 * Enterprise-grade state management with persistence
 */

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { subscribeWithSelector } from 'zustand/middleware'
import { HeroData, DemoRequest } from '../types'

// Marketing Preferences interface
interface MarketingPreferences {
  language: 'id' | 'en'
  theme: 'light' | 'dark'
  reducedMotion: boolean
  notifications: boolean
  analyticsOptIn: boolean
}

// ===== STORE INTERFACES =====

interface MarketingState {
  // Hero Section State
  heroData: HeroData | null
  heroLoading: boolean
  heroError: string | null
  
  // Demo Request State
  demoFormData: Partial<DemoRequest>
  demoFormErrors: Record<string, string>
  isDemoSubmitting: boolean
  
  // UI State
  isScrolled: boolean
  activeSection: string
  mobileMenuOpen: boolean
  
  // User Preferences
  preferences: MarketingPreferences
  
  // Analytics
  pageViews: number
  interactions: number
  lastVisit: string | null
}

interface MarketingActions {
  // Hero Actions
  setHeroData: (data: HeroData | null) => void
  setHeroLoading: (loading: boolean) => void
  setHeroError: (error: string | null) => void
  
  // Demo Form Actions
  updateDemoForm: (data: Partial<DemoRequest>) => void
  setDemoFormErrors: (errors: Record<string, string>) => void
  clearDemoForm: () => void
  setDemoSubmitting: (submitting: boolean) => void
  
  // UI Actions
  setScrolled: (scrolled: boolean) => void
  setActiveSection: (section: string) => void
  toggleMobileMenu: () => void
  closeMobileMenu: () => void
  
  // Preferences Actions
  updatePreferences: (preferences: Partial<MarketingPreferences>) => void
  
  // Analytics Actions
  incrementPageViews: () => void
  incrementInteractions: () => void
  updateLastVisit: () => void
  
  // Reset Actions
  resetHeroState: () => void
  resetDemoState: () => void
  resetUIState: () => void
  resetStore: () => void
}

type MarketingStore = MarketingState & MarketingActions

// ===== INITIAL STATE =====

const initialState: MarketingState = {
  // Hero Section
  heroData: null,
  heroLoading: false,
  heroError: null,
  
  // Demo Request
  demoFormData: {},
  demoFormErrors: {},
  isDemoSubmitting: false,
  
  // UI State
  isScrolled: false,
  activeSection: 'hero',
  mobileMenuOpen: false,
  
  // User Preferences
  preferences: {
    language: 'id',
    theme: 'light',
    reducedMotion: false,
    notifications: true,
    analyticsOptIn: true,
  },
  
  // Analytics
  pageViews: 0,
  interactions: 0,
  lastVisit: null,
}

// ===== MARKETING STORE =====

export const useMarketingStore = create<MarketingStore>()(
  subscribeWithSelector(
    persist(
      immer((set) => ({
        ...initialState,
        
        // ===== HERO ACTIONS =====
        setHeroData: (data) =>
          set((state) => {
            state.heroData = data
            state.heroError = null
          }),
          
        setHeroLoading: (loading) =>
          set((state) => {
            state.heroLoading = loading
          }),
          
        setHeroError: (error) =>
          set((state) => {
            state.heroError = error
            state.heroLoading = false
          }),
        
        // ===== DEMO FORM ACTIONS =====
        updateDemoForm: (data) =>
          set((state) => {
            state.demoFormData = { ...state.demoFormData, ...data }
            // Clear errors for updated fields
            Object.keys(data).forEach(key => {
              delete state.demoFormErrors[key]
            })
          }),
          
        setDemoFormErrors: (errors) =>
          set((state) => {
            state.demoFormErrors = errors
          }),
          
        clearDemoForm: () =>
          set((state) => {
            state.demoFormData = {}
            state.demoFormErrors = {}
            state.isDemoSubmitting = false
          }),
          
        setDemoSubmitting: (submitting) =>
          set((state) => {
            state.isDemoSubmitting = submitting
          }),
        
        // ===== UI ACTIONS =====
        setScrolled: (scrolled) =>
          set((state) => {
            state.isScrolled = scrolled
          }),
          
        setActiveSection: (section) =>
          set((state) => {
            state.activeSection = section
          }),
          
        toggleMobileMenu: () =>
          set((state) => {
            state.mobileMenuOpen = !state.mobileMenuOpen
          }),
          
        closeMobileMenu: () =>
          set((state) => {
            state.mobileMenuOpen = false
          }),
        
        // ===== PREFERENCES ACTIONS =====
        updatePreferences: (preferences) =>
          set((state) => {
            state.preferences = { ...state.preferences, ...preferences }
          }),
        
        // ===== ANALYTICS ACTIONS =====
        incrementPageViews: () =>
          set((state) => {
            state.pageViews += 1
          }),
          
        incrementInteractions: () =>
          set((state) => {
            state.interactions += 1
          }),
          
        updateLastVisit: () =>
          set((state) => {
            state.lastVisit = new Date().toISOString()
          }),
        
        // ===== RESET ACTIONS =====
        resetHeroState: () =>
          set((state) => {
            state.heroData = null
            state.heroLoading = false
            state.heroError = null
          }),
          
        resetDemoState: () =>
          set((state) => {
            state.demoFormData = {}
            state.demoFormErrors = {}
            state.isDemoSubmitting = false
          }),
          
        resetUIState: () =>
          set((state) => {
            state.isScrolled = false
            state.activeSection = 'hero'
            state.mobileMenuOpen = false
          }),
          
        resetStore: () =>
          set(() => ({
            ...initialState,
          })),
      })),
      {
        name: 'sppg-marketing-store',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          // Only persist user preferences and analytics
          preferences: state.preferences,
          pageViews: state.pageViews,
          interactions: state.interactions,
          lastVisit: state.lastVisit,
        }),
        version: 1,
      }
    )
  )
)

// ===== SELECTOR HOOKS =====

/**
 * Hero section selectors
 */
export const useHeroState = () =>
  useMarketingStore((state) => ({
    data: state.heroData,
    loading: state.heroLoading,
    error: state.heroError,
  }))

/**
 * Demo form selectors
 */
export const useDemoFormState = () =>
  useMarketingStore((state) => ({
    data: state.demoFormData,
    errors: state.demoFormErrors,
    isSubmitting: state.isDemoSubmitting,
  }))

/**
 * UI state selectors
 */
export const useUIState = () =>
  useMarketingStore((state) => ({
    isScrolled: state.isScrolled,
    activeSection: state.activeSection,
    mobileMenuOpen: state.mobileMenuOpen,
  }))

/**
 * User preferences selectors
 */
export const useMarketingPreferences = () =>
  useMarketingStore((state) => state.preferences)

/**
 * Analytics selectors
 */
export const useMarketingAnalytics = () =>
  useMarketingStore((state) => ({
    pageViews: state.pageViews,
    interactions: state.interactions,
    lastVisit: state.lastVisit,
  }))

// ===== ACTION HOOKS =====

/**
 * Hero actions hook
 */
export const useHeroActions = () =>
  useMarketingStore((state) => ({
    setData: state.setHeroData,
    setLoading: state.setHeroLoading,
    setError: state.setHeroError,
    reset: state.resetHeroState,
  }))

/**
 * Demo form actions hook
 */
export const useDemoFormActions = () =>
  useMarketingStore((state) => ({
    updateForm: state.updateDemoForm,
    setErrors: state.setDemoFormErrors,
    clearForm: state.clearDemoForm,
    setSubmitting: state.setDemoSubmitting,
    reset: state.resetDemoState,
  }))

/**
 * UI actions hook
 */
export const useUIActions = () =>
  useMarketingStore((state) => ({
    setScrolled: state.setScrolled,
    setActiveSection: state.setActiveSection,
    toggleMobileMenu: state.toggleMobileMenu,
    closeMobileMenu: state.closeMobileMenu,
    reset: state.resetUIState,
  }))

/**
 * Preferences actions hook
 */
export const usePreferencesActions = () =>
  useMarketingStore((state) => ({
    update: state.updatePreferences,
  }))

/**
 * Analytics actions hook
 */
export const useAnalyticsActions = () =>
  useMarketingStore((state) => ({
    incrementPageViews: state.incrementPageViews,
    incrementInteractions: state.incrementInteractions,
    updateLastVisit: state.updateLastVisit,
  }))

// ===== UTILITY HOOKS =====

/**
 * Demo form validation helper
 */
export const useDemoFormValidation = () => {
  const { data, errors } = useDemoFormState()
  const { setErrors } = useDemoFormActions()
  
  const validate = (field?: string) => {
    const newErrors: Record<string, string> = {}
    
    // Validate specific field or all fields
    const fieldsToValidate = field ? [field] : Object.keys(data)
    
    fieldsToValidate.forEach((key) => {
      const value = data[key as keyof DemoRequest]
      
      switch (key) {
        case 'organizationName':
          if (!value || (typeof value === 'string' && value.trim().length === 0)) {
            newErrors[key] = 'Organization name is required'
          }
          break
        case 'contactName':
          if (!value || (typeof value === 'string' && value.trim().length === 0)) {
            newErrors[key] = 'Contact name is required'
          }
          break
        case 'email':
          if (!value || (typeof value === 'string' && value.trim().length === 0)) {
            newErrors[key] = 'Email is required'
          } else if (typeof value === 'string' && !/\S+@\S+\.\S+/.test(value)) {
            newErrors[key] = 'Invalid email format'
          }
          break
        case 'phone':
          if (!value || (typeof value === 'string' && value.trim().length === 0)) {
            newErrors[key] = 'Phone number is required'
          }
          break
        case 'expectedStudents':
          if (!value || (typeof value === 'number' && value <= 0)) {
            newErrors[key] = 'Expected students must be greater than 0'
          }
          break
      }
    })
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return false
    }
    
    return true
  }
  
  return {
    validate,
    isValid: Object.keys(errors).length === 0,
    hasErrors: Object.keys(errors).length > 0,
  }
}

/**
 * Scroll tracking helper
 */
export const useScrollTracking = () => {
  const { setScrolled, setActiveSection } = useUIActions()
  const { incrementInteractions } = useAnalyticsActions()
  
  const handleScroll = () => {
    const scrolled = window.scrollY > 50
    setScrolled(scrolled)
    
    // Track scroll interaction
    incrementInteractions()
    
    // Update active section based on scroll position
    const sections = ['hero', 'features', 'testimonials', 'demo']
    let activeSection = 'hero'
    
    for (const section of sections) {
      const element = document.getElementById(section)
      if (element) {
        const rect = element.getBoundingClientRect()
        if (rect.top <= 100 && rect.bottom >= 100) {
          activeSection = section
          break
        }
      }
    }
    
    setActiveSection(activeSection)
  }
  
  return { handleScroll }
}

// ===== STORE SUBSCRIPTIONS =====

/**
 * Subscribe to store changes for debugging
 */
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  useMarketingStore.subscribe(
    (state) => state,
    (state) => {
      console.log('Marketing Store Updated:', {
        heroLoading: state.heroLoading,
        activeSection: state.activeSection,
        demoFormErrors: Object.keys(state.demoFormErrors).length,
        timestamp: new Date().toISOString(),
      })
    }
  )
}