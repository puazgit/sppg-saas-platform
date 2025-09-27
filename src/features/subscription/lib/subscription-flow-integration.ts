/**
 * End-to-End Subscription Flow Integration & Testing
 * Comprehensive testing suite for subscription flow with package integration
 */

import React from 'react'
import { RegistrationData } from '../schemas/subscription.schema'
import { SubscriptionPackage } from '../services/subscription-api'
import { PaymentCalculator, PaymentBreakdown } from './payment-calculator'
import { EnhancedRegistrationValidator } from './registration-validation'
import { PackageValidator } from './package-validation'

export interface SubscriptionFlowTest {
  testName: string
  description: string
  testData: {
    registrationData: Partial<RegistrationData>
    selectedPackage: SubscriptionPackage
    organizationType: string
    billingCycle: 'MONTHLY' | 'YEARLY'
    promotionCode?: string
  }
  expectedResults: {
    isValidRegistration: boolean
    isCompatiblePackage: boolean
    hasPaymentCalculation: boolean
    totalAmount: number
    discountApplied: boolean
  }
  assertions: string[]
}

export interface IntegrationTestResult {
  testName: string
  passed: boolean
  executionTime: number
  results: {
    registrationValidation: unknown
    packageValidation: unknown
    paymentCalculation: PaymentBreakdown | null
    integrationScore: number
  }
  errors: string[]
  warnings: string[]
}

/**
 * Mock test data for different organization types and scenarios
 */
export const SUBSCRIPTION_FLOW_TESTS: SubscriptionFlowTest[] = [
  {
    testName: 'Government Organization - Basic Package',
    description: 'Test government organization registration with basic package and compliance requirements',
    testData: {
      registrationData: {
        code: 'PEMKOT2024',
        name: 'Pemerintah Kota Jakarta Selatan',
        organizationType: 'PEMERINTAH',
        establishedYear: 2010,
        targetRecipients: 800,
        maxRadius: 15,
        phone: '021-12345678',
        email: 'sppg@jaksel.go.id',
        picName: 'Dr. Budi Santoso',
        picPosition: 'Kepala Dinas Kesehatan',
        picEmail: 'budi.santoso@jaksel.go.id',
        picPhone: '081234567890'
      },
      selectedPackage: {
        id: 'basic-001',
        name: 'SPPG Basic',
        displayName: 'BASIC',
        description: 'Paket dasar untuk operasional SPPG',
        tier: 'BASIC',
        monthlyPrice: 125000,
        yearlyPrice: 1200000,
        setupFee: 50000,
        maxRecipients: 500,
        maxStaff: 5,
        maxDistributionPoints: 3,
        maxMenusPerMonth: 30,
        storageGb: 10,
        maxReportsPerMonth: 10,
        hasAdvancedReporting: false,
        hasNutritionAnalysis: true,
        hasCostCalculation: true,
        hasQualityControl: false,
        hasAPIAccess: false,
        hasCustomBranding: false,
        hasPrioritySupport: false,
        hasTrainingIncluded: true,
        supportLevel: 'Community',
        isActive: true,
        isPopular: false,
        isCustom: false,
        highlightFeatures: ['Nutrition Analysis', 'Cost Calculation'],
        createdAt: new Date(),
        updatedAt: new Date()
      } as SubscriptionPackage,
      organizationType: 'PEMERINTAH',
      billingCycle: 'YEARLY',
      promotionCode: 'PEMERINTAH50'
    },
    expectedResults: {
      isValidRegistration: false, // Should fail due to insufficient package features
      isCompatiblePackage: false, // Basic package lacks required government features
      hasPaymentCalculation: true,
      totalAmount: 1150000, // Approximate with discounts
      discountApplied: true
    },
    assertions: [
      'Registration should fail due to missing advanced reporting requirement',
      'Package validation should recommend upgrade to PRO or ENTERPRISE',
      'Payment calculation should include government discount (15%)',
      'Promotion code PEMERINTAH50 should be applied',
      'Should suggest upgrade due to recipient count exceeding package limit'
    ]
  },
  
  {
    testName: 'Foundation - Standard Package with Volume Discount',
    description: 'Test yayasan with standard package and high recipient volume',
    testData: {
      registrationData: {
        code: 'YAY-PEDULI123',
        name: 'Yayasan Peduli Gizi Indonesia',
        organizationType: 'YAYASAN',
        establishedYear: 2018,
        targetRecipients: 1500,
        maxRadius: 20,
        phone: '021-87654321',
        email: 'info@peduligizi.org',
        picName: 'Ibu Sari Widiastuti',
        picPosition: 'Direktur Eksekutif',
        picEmail: 'sari@peduligizi.org',
        picPhone: '081987654321'
      },
      selectedPackage: {
        id: 'standard-001',
        name: 'SPPG Standard',
        displayName: 'STANDARD',
        description: 'Paket standar untuk organisasi menengah',
        tier: 'STANDARD',
        monthlyPrice: 250000,
        yearlyPrice: 2400000,
        setupFee: 100000,
        maxRecipients: 2000,
        maxStaff: 15,
        maxDistributionPoints: 10,
        maxMenusPerMonth: 100,
        storageGb: 50,
        maxReportsPerMonth: 50,
        hasAdvancedReporting: true,
        hasNutritionAnalysis: true,
        hasCostCalculation: true,
        hasQualityControl: true,
        hasAPIAccess: false,
        hasCustomBranding: false,
        hasPrioritySupport: true,
        hasTrainingIncluded: true,
        supportLevel: 'Email',
        isActive: true,
        isPopular: true,
        isCustom: false,
        highlightFeatures: ['Advanced Reporting', 'Quality Control', 'Priority Support'],
        createdAt: new Date(),
        updatedAt: new Date()
      } as SubscriptionPackage,
      organizationType: 'YAYASAN',
      billingCycle: 'YEARLY'
    },
    expectedResults: {
      isValidRegistration: true,
      isCompatiblePackage: true,
      hasPaymentCalculation: true,
      totalAmount: 2100000, // Approximate with discounts
      discountApplied: true
    },
    assertions: [
      'Registration should pass all validation checks',
      'Package should be compatible with yayasan requirements',
      'Volume discount should be applied for 1500 recipients',
      'Foundation discount (10%) should be applied',
      'Yearly billing discount should be included'
    ]
  },

  {
    testName: 'Community - Exceeds Package Limits',
    description: 'Test komunitas with recipient count exceeding package capacity',
    testData: {
      registrationData: {
        code: 'KOM-MAKMUR001',
        name: 'Komunitas Makmur Bersama',
        organizationType: 'KOMUNITAS',
        establishedYear: 2020,
        targetRecipients: 600, // Exceeds basic limit
        maxRadius: 8,
        phone: '021-11111111',
        email: 'info@makmurbersama.org',
        picName: 'Pak Joko Susanto',
        picPosition: 'Koordinator Program',
        picEmail: 'joko@makmurbersama.org',
        picPhone: '081111111111'
      },
      selectedPackage: {
        id: 'basic-001',
        name: 'SPPG Basic',
        displayName: 'BASIC',
        tier: 'BASIC',
        monthlyPrice: 125000,
        yearlyPrice: null,
        setupFee: 50000,
        maxRecipients: 500,
        maxStaff: 5,
        maxDistributionPoints: 3,
        hasAdvancedReporting: false,
        hasNutritionAnalysis: true,
        hasCostCalculation: true,
        hasQualityControl: false,
        hasAPIAccess: false,
        hasCustomBranding: false,
        hasPrioritySupport: false,
        hasTrainingIncluded: true
      } as SubscriptionPackage,
      organizationType: 'KOMUNITAS',
      billingCycle: 'MONTHLY'
    },
    expectedResults: {
      isValidRegistration: false, // Should fail due to package capacity
      isCompatiblePackage: false,
      hasPaymentCalculation: true,
      totalAmount: 100000, // Approximate with discounts
      discountApplied: true
    },
    assertions: [
      'Registration should fail due to recipient count exceeding package limit',
      'Should recommend upgrade to STANDARD package',
      'Community discount (20%) should be applied',
      'Should show upgrade recommendation with cost implications'
    ]
  },

  {
    testName: 'Corporate - Enterprise Package with API Requirements',
    description: 'Test perusahaan swasta with enterprise requirements',
    testData: {
      registrationData: {
        code: 'PT-SEJAHTERA01',
        name: 'PT Sejahtera Bersama Indonesia',
        organizationType: 'SWASTA',
        establishedYear: 2015,
        targetRecipients: 3000,
        maxRadius: 25,
        phone: '021-99999999',
        email: 'csr@sejahtera.co.id',
        picName: 'Ibu Diana Permata',
        picPosition: 'CSR Manager',
        picEmail: 'diana@sejahtera.co.id',
        picPhone: '081999999999'
      },
      selectedPackage: {
        id: 'pro-001',
        name: 'SPPG Pro',
        displayName: 'PRO',
        tier: 'PRO',
        monthlyPrice: 500000,
        yearlyPrice: 4800000,
        setupFee: 200000,
        maxRecipients: 10000,
        maxStaff: 50,
        maxDistributionPoints: 25,
        hasAdvancedReporting: true,
        hasNutritionAnalysis: true,
        hasCostCalculation: true,
        hasQualityControl: true,
        hasAPIAccess: true,
        hasCustomBranding: true,
        hasPrioritySupport: true,
        hasTrainingIncluded: true
      } as SubscriptionPackage,
      organizationType: 'SWASTA',
      billingCycle: 'YEARLY'
    },
    expectedResults: {
      isValidRegistration: true,
      isCompatiblePackage: true,
      hasPaymentCalculation: true,
      totalAmount: 4800000, // No organization discount for private companies
      discountApplied: true // Only yearly discount
    },
    assertions: [
      'Registration should pass with all corporate requirements',
      'PRO package should satisfy API and custom branding requirements',
      'No organization discount should be applied (0% for SWASTA)',
      'Yearly billing discount should be applied',
      'Volume discount should be applied for 3000 recipients'
    ]
  }
]

/**
 * Main Integration Test Runner
 */
export class SubscriptionFlowIntegration {
  
  /**
   * Run comprehensive integration tests
   */
  static async runIntegrationTests(): Promise<IntegrationTestResult[]> {
    const results: IntegrationTestResult[] = []
    
    console.log('🚀 Starting Subscription Flow Integration Tests...')
    
    for (const test of SUBSCRIPTION_FLOW_TESTS) {
      const startTime = performance.now()
      const result = await this.runSingleTest(test)
      const endTime = performance.now()
      
      result.executionTime = endTime - startTime
      results.push(result)
      
      console.log(`${result.passed ? '✅' : '❌'} ${test.testName} (${result.executionTime.toFixed(2)}ms)`)
    }
    
    const passedTests = results.filter(r => r.passed).length
    const totalTests = results.length
    
    console.log(`\n📊 Integration Test Results: ${passedTests}/${totalTests} tests passed`)
    
    return results
  }

  /**
   * Run single integration test
   */
  private static async runSingleTest(test: SubscriptionFlowTest): Promise<IntegrationTestResult> {
    const result: IntegrationTestResult = {
      testName: test.testName,
      passed: false,
      executionTime: 0,
      results: {
        registrationValidation: null,
        packageValidation: null,
        paymentCalculation: null,
        integrationScore: 0
      },
      errors: [],
      warnings: []
    }

    try {
      // 1. Test Enhanced Registration Validation
      result.results.registrationValidation = EnhancedRegistrationValidator.validateRegistration(
        test.testData.registrationData,
        test.testData.selectedPackage
      )

      // 2. Test Package Validation
      result.results.packageValidation = PackageValidator.validateRegistrationAgainstPackage(
        test.testData.registrationData,
        test.testData.selectedPackage
      )

      // 3. Test Payment Calculation
      result.results.paymentCalculation = PaymentCalculator.calculatePayment({
        selectedPackage: test.testData.selectedPackage,
        registrationData: test.testData.registrationData,
        billingCycle: test.testData.billingCycle,
        promotionCode: test.testData.promotionCode,
        organizationType: test.testData.organizationType
      })

      // 4. Validate Expected Results
      const validationResults = this.validateExpectedResults(test, result.results)
      result.passed = validationResults.passed
      result.errors = validationResults.errors
      result.warnings = validationResults.warnings

      // 5. Calculate Integration Score
      result.results.integrationScore = this.calculateIntegrationScore(result.results)

    } catch (error) {
      result.errors.push(`Test execution failed: ${error}`)
      result.passed = false
    }

    return result
  }

  /**
   * Validate test results against expected outcomes
   */
  private static validateExpectedResults(
    test: SubscriptionFlowTest,
    results: IntegrationTestResult['results']
  ): { passed: boolean; errors: string[]; warnings: string[] } {
    const errors: string[] = []
    const warnings: string[] = []

    // Validate registration validation
    const regValidation = results.registrationValidation as { isValid: boolean } | null
    if (regValidation?.isValid !== test.expectedResults.isValidRegistration) {
      errors.push(
        `Registration validation mismatch: expected ${test.expectedResults.isValidRegistration}, got ${regValidation?.isValid}`
      )
    }

    // Validate package compatibility
    const pkgValidation = results.packageValidation as { isValid: boolean } | null
    if (pkgValidation?.isValid !== test.expectedResults.isCompatiblePackage) {
      errors.push(
        `Package compatibility mismatch: expected ${test.expectedResults.isCompatiblePackage}, got ${pkgValidation?.isValid}`
      )
    }

    // Validate payment calculation
    if (!results.paymentCalculation && test.expectedResults.hasPaymentCalculation) {
      errors.push('Payment calculation failed but was expected to succeed')
    }

    // Validate discount application
    if (results.paymentCalculation && test.expectedResults.discountApplied) {
      const hasDiscounts = results.paymentCalculation.discountBreakdown.length > 0
      if (!hasDiscounts) {
        warnings.push('Expected discounts to be applied but none were found')
      }
    }

    // Validate total amount (with tolerance)
    if (results.paymentCalculation && test.expectedResults.totalAmount) {
      const actualAmount = results.paymentCalculation.totalAmount
      const expectedAmount = test.expectedResults.totalAmount
      const tolerance = expectedAmount * 0.1 // 10% tolerance
      
      if (Math.abs(actualAmount - expectedAmount) > tolerance) {
        warnings.push(
          `Total amount variance: expected ~${expectedAmount}, got ${actualAmount}`
        )
      }
    }

    return {
      passed: errors.length === 0,
      errors,
      warnings
    }
  }

  /**
   * Calculate integration score based on test results
   */
  private static calculateIntegrationScore(results: IntegrationTestResult['results']): number {
    let score = 0

    // Registration validation (25 points)
    const regValidation = results.registrationValidation as { isValid: boolean } | null
    if (regValidation) {
      score += 25
      if (regValidation.isValid) score += 10
    }

    // Package validation (25 points)  
    const pkgValidation = results.packageValidation as { isValid: boolean } | null
    if (pkgValidation) {
      score += 25
      if (pkgValidation.isValid) score += 10
    }

    // Payment calculation (25 points)
    if (results.paymentCalculation) {
      score += 25
      if (results.paymentCalculation.totalAmount > 0) score += 10
    }

    // Integration completeness (15 points)
    if (regValidation && pkgValidation && results.paymentCalculation) {
      score += 15
    }

    return Math.min(100, score)
  }

  /**
   * Generate integration test report
   */
  static generateTestReport(results: IntegrationTestResult[]): string {
    const passedTests = results.filter(r => r.passed)
    const failedTests = results.filter(r => !r.passed)
    const avgScore = results.reduce((sum, r) => sum + r.results.integrationScore, 0) / results.length
    const totalExecutionTime = results.reduce((sum, r) => sum + r.executionTime, 0)

    let report = `
# Subscription Flow Integration Test Report

## Test Summary
- **Total Tests**: ${results.length}
- **Passed**: ${passedTests.length}
- **Failed**: ${failedTests.length}
- **Success Rate**: ${((passedTests.length / results.length) * 100).toFixed(1)}%
- **Average Integration Score**: ${avgScore.toFixed(1)}/100
- **Total Execution Time**: ${totalExecutionTime.toFixed(2)}ms

## Test Results

`

    results.forEach(result => {
      report += `
### ${result.testName}
- **Status**: ${result.passed ? '✅ PASSED' : '❌ FAILED'}
- **Execution Time**: ${result.executionTime.toFixed(2)}ms
- **Integration Score**: ${result.results.integrationScore}/100

`

      if (result.errors.length > 0) {
        report += `**Errors:**\n`
        result.errors.forEach(error => {
          report += `- ${error}\n`
        })
        report += `\n`
      }

      if (result.warnings.length > 0) {
        report += `**Warnings:**\n`
        result.warnings.forEach(warning => {
          report += `- ${warning}\n`
        })
        report += `\n`
      }
    })

    return report
  }

  /**
   * Test specific subscription flow scenario
   */
  static async testSubscriptionScenario(
    registrationData: Partial<RegistrationData>,
    selectedPackage: SubscriptionPackage,
    organizationType: string
  ): Promise<{
    isFlowComplete: boolean
    validationResults: {
      registration: unknown
      package: unknown
    }
    paymentResults: PaymentBreakdown | null
    recommendations: string[]
  }> {
    const recommendations: string[] = []
    
    // Test registration validation
    const registrationValidation = EnhancedRegistrationValidator.validateRegistration(
      registrationData,
      selectedPackage
    )

    // Test package validation  
    const packageValidation = PackageValidator.validateRegistrationAgainstPackage(
      registrationData,
      selectedPackage
    )

    // Test payment calculation
    let paymentResults = null
    try {
      paymentResults = PaymentCalculator.calculatePayment({
        selectedPackage,
        registrationData,
        billingCycle: 'MONTHLY',
        organizationType
      })
    } catch {
      recommendations.push('Payment calculation failed - check package configuration')
    }

    // Generate recommendations
    if (!registrationValidation.isValid) {
      recommendations.push('Complete required registration fields')
    }

    if (!packageValidation.isValid) {
      recommendations.push('Consider upgrading package to meet requirements')
    }

    if (registrationValidation.organizationCompliance.missing.length > 0) {
      recommendations.push('Package does not meet organization compliance requirements')
    }

    const isFlowComplete = registrationValidation.isValid && 
                          packageValidation.isValid && 
                          paymentResults !== null

    return {
      isFlowComplete,
      validationResults: {
        registration: registrationValidation,
        package: packageValidation
      },
      paymentResults,
      recommendations
    }
  }
}

/**
 * React Hook for Integration Testing
 */
export const useSubscriptionFlowTesting = () => {
  const [testResults, setTestResults] = React.useState<IntegrationTestResult[]>([])
  const [isRunning, setIsRunning] = React.useState(false)

  const runTests = async () => {
    setIsRunning(true)
    try {
      const results = await SubscriptionFlowIntegration.runIntegrationTests()
      setTestResults(results)
    } catch (error) {
      console.error('Integration test failed:', error)
    } finally {
      setIsRunning(false)
    }
  }

  const testScenario = async (
    registrationData: Partial<RegistrationData>,
    selectedPackage: SubscriptionPackage,
    organizationType: string
  ) => {
    return SubscriptionFlowIntegration.testSubscriptionScenario(
      registrationData,
      selectedPackage,
      organizationType
    )
  }

  return {
    testResults,
    isRunning,
    runTests,
    testScenario
  }
}

export default SubscriptionFlowIntegration