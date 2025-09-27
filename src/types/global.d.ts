// Global type declarations for the SPPG SaaS Platform

declare global {
  interface Window {
    gtag?: (command: string, eventName: string, parameters?: Record<string, unknown>) => void
  }
}

export {}