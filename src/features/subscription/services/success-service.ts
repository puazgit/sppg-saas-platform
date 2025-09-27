/**
 * Success Flow Service
 * Handles post-subscription success operations
 */

import { SuccessData, OnboardingStep, WelcomeNotification } from '../types/success'

export class SuccessService {
  
  /**
   * Get subscription success data from API
   */
  static async getSuccessData(subscriptionId: string): Promise<SuccessData> {
    try {
      console.log(`[API] Getting success data for subscription: ${subscriptionId}`)
      
      const response = await fetch(`/api/subscription/${subscriptionId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch subscription data')
      }

      // Transform API response to match SuccessData interface
      const apiData = result.data
      return {
        subscriptionId: apiData.subscriptionId,
        sppgId: apiData.sppgId,
        organizationName: apiData.organizationName,
        packageName: apiData.packageName,
        activationStatus: apiData.activationStatus,
        invoice: apiData.invoice,
        account: apiData.account,
        nextSteps: [
          {
            title: 'Aktivasi Akun Admin',
            description: 'Login pertama dan ganti password default',
            actionRequired: true,
            dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
          },
          {
            title: 'Setup Profil Organisasi',
            description: 'Lengkapi data organisasi dan upload logo',
            actionRequired: true,
            dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 days
          },
          {
            title: 'Training Online',
            description: 'Ikuti training penggunaan platform (2 jam)',
            actionRequired: false,
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
          }
        ],
        support: {
          email: 'support@sppg-platform.com',
          phone: '+62-21-1234-5678',
          whatsapp: '+62-811-2345-6789'
        }
      }
    } catch (error) {
      console.error('[API] Error fetching success data:', error)
      
      // Return fallback data if API fails
      return {
        subscriptionId,
        sppgId: `SPPG-${Date.now()}`,
        organizationName: 'SPPG Contoh',
        packageName: 'Paket STANDARD',
        activationStatus: 'ACTIVE',
        invoice: {
          id: `INV-${Date.now()}`,
          amount: 2500000,
          paidAt: new Date(),
          paymentMethod: 'Bank Transfer'
        },
        account: {
          adminEmail: 'admin@sppg-contoh.com',
          loginUrl: '/sppg/login',
          tempPassword: 'Welcome2024!',
          setupRequired: true
        },
        nextSteps: [
          {
            title: 'Aktivasi Akun Admin',
            description: 'Login pertama dan ganti password default',
            actionRequired: true,
            dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000)
          }
        ],
        support: {
          email: 'support@sppg-platform.com',
          phone: '+62-21-1234-5678',
          whatsapp: '+62-811-2345-6789'
        }
      }
    }
  }

  /**
   * Get onboarding steps - Using mock data for now
   */
  static async getOnboardingSteps(sppgId: string): Promise<OnboardingStep[]> {
    // TODO: Implement actual API call when backend is ready
    // For now, return mock data immediately
    console.log(`[Mock] Getting onboarding steps for SPPG: ${sppgId}`)
    
    return [
        {
          id: 'account-setup',
          title: 'Setup Akun Administrator',
          description: 'Aktivasi akun dan pengaturan keamanan dasar',
          status: 'PENDING',
          estimatedTime: 15,
          category: 'SETUP',
          isOptional: false
        },
        {
          id: 'organization-profile',
          title: 'Profil Organisasi',
          description: 'Lengkapi data organisasi dan preferensi operasional',
          status: 'PENDING',
          estimatedTime: 30,
          category: 'CONFIGURATION',
          isOptional: false,
          dependencies: ['account-setup']
        },
        {
          id: 'staff-setup',
          title: 'Setup Tim dan Staff',
          description: 'Tambahkan anggota tim dan atur role masing-masing',
          status: 'PENDING',
          estimatedTime: 45,
          category: 'CONFIGURATION',
          isOptional: false,
          dependencies: ['organization-profile']
        },
        {
          id: 'menu-planning',
          title: 'Perencanaan Menu Awal',
          description: 'Setup menu dasar dan perencanaan nutrisi',
          status: 'PENDING',
          estimatedTime: 60,
          category: 'CONFIGURATION',
          isOptional: true,
          dependencies: ['staff-setup']
        },
        {
          id: 'platform-training',
          title: 'Training Platform',
          description: 'Pelatihan penggunaan fitur-fitur utama platform',
          status: 'PENDING',
          estimatedTime: 120,
          category: 'TRAINING',
          isOptional: false,
          dependencies: ['menu-planning']
        },
        {
          id: 'verification',
          title: 'Verifikasi Data',
          description: 'Validasi kelengkapan data dan persetujuan operasional',
          status: 'PENDING',
          estimatedTime: 30,
          category: 'VERIFICATION',
          isOptional: false,
          dependencies: ['platform-training']
        }
      ]
  }

  /**
   * Send welcome notifications - Using mock implementation
   */
  static async sendWelcomeNotifications(
    subscriptionId: string,
    notifications: WelcomeNotification[]
  ): Promise<{ success: boolean; sent: number; failed: number }> {
    // TODO: Implement actual API call when backend is ready
    console.log(`[Mock] Sending welcome notifications for subscription: ${subscriptionId}`)
    
    // Simulate success response
    return {
      success: true,
      sent: notifications.length,
      failed: 0
    }
  }

  /**
   * Generate temporary password
   */
  static generateTempPassword(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789'
    let password = ''
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return password
  }

  /**
   * Create admin account
   */
  static async createAdminAccount(data: {
    sppgId: string
    email: string
    organizationName: string
  }): Promise<{
    success: boolean
    loginUrl: string
    tempPassword: string
    activationToken: string
  }> {
    try {
      const tempPassword = this.generateTempPassword()
      
      const response = await fetch('/api/accounts/create-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          tempPassword
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create admin account')
      }

      const result = await response.json()
      return {
        success: true,
        loginUrl: `${process.env.NEXT_PUBLIC_APP_URL}/login`,
        tempPassword,
        activationToken: result.activationToken
      }
    } catch (error) {
      console.error('Error creating admin account:', error)
      throw error
    }
  }

  /**
   * Schedule onboarding reminder
   */
  static async scheduleOnboardingReminder(
    sppgId: string,
    reminderType: 'EMAIL' | 'SMS' | 'WHATSAPP',
    scheduledAt: Date
  ): Promise<boolean> {
    try {
      const response = await fetch('/api/reminders/schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sppgId,
          type: 'ONBOARDING_REMINDER',
          channel: reminderType,
          scheduledAt: scheduledAt.toISOString()
        }),
      })

      return response.ok
    } catch (error) {
      console.error('Error scheduling reminder:', error)
      return false
    }
  }

  /**
   * Track success page metrics - Using mock implementation
   */
  static async trackSuccessMetrics(subscriptionId: string, eventType: string): Promise<void> {
    // TODO: Implement actual analytics tracking when backend is ready
    console.log(`[Mock] Tracking success metrics:`, {
      subscriptionId,
      eventType,
      timestamp: new Date().toISOString()
    })
  }

  /**
   * Download welcome packet - Using mock implementation
   */
  static async generateWelcomePacket(sppgId: string): Promise<string> {
    // TODO: Implement actual API call when backend is ready
    console.log(`[Mock] Generating welcome packet for SPPG: ${sppgId}`)
    
    // Simulate delay and return mock download URL
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    return `https://mock-cdn.sppg-platform.com/welcome-packets/${sppgId}/welcome-packet.pdf`
  }
}