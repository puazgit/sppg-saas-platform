/**
 * Subscription Flow - Main Flow Component
 */

'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useSubscriptionStore } from '../store/subscription.store'
import { PackageSelectionStep } from './package-selection-step'
import { RegistrationFormStep } from './registration-form-step'
import { ConfirmationStep } from './confirmation-step'
import SimplePaymentMethodStep from './simple-payment-method-step'
import PaymentProcessingStep from './payment-processing-step'
import SuccessStep from './success-step'

// Progress indicator component
function ProgressIndicator({ currentStep }: { currentStep: number }) {
  const steps = [
    { number: 1, name: 'Paket', description: 'Pilih Paket' },
    { number: 2, name: 'Data', description: 'Informasi SPPG' },
    { number: 3, name: 'Konfirmasi', description: 'Review Data' },
    { number: 4, name: 'Pembayaran', description: 'Upload Bukti' },
    { number: 5, name: 'Verifikasi', description: 'Validasi' },
    { number: 6, name: 'Selesai', description: 'Berhasil' }
  ]

  return (
    <div className="mb-8">
      <div className="flex items-center justify-center">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-semibold transition-colors ${
                currentStep === step.number
                  ? 'border-blue-500 bg-blue-500 text-white'
                  : currentStep > step.number
                  ? 'border-green-500 bg-green-500 text-white'
                  : 'border-gray-300 bg-white text-gray-500'
              }`}>
                {currentStep > step.number ? '✓' : step.number}
              </div>
              <div className="mt-2 text-center">
                <div className={`text-xs font-medium ${
                  currentStep >= step.number ? 'text-blue-600' : 'text-gray-500'
                }`}>
                  {step.name}
                </div>
                <div className="text-xs text-gray-400">
                  {step.description}
                </div>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className={`w-16 h-0.5 mx-4 mt-[-24px] ${
                currentStep > step.number ? 'bg-green-500' : 'bg-gray-300'
              }`} />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function SubscriptionFlow() {
  const { currentStep: storeStep, nextStep, prevStep, subscriptionId } = useSubscriptionStore()
  const [direction, setDirection] = useState(1)
  const searchParams = useSearchParams()

  // Enterprise URL parameter handling - delegates to package selection component
  // No mock data or temporary package creation - only real database packages
  useEffect(() => {
    // URL parameters will be processed by PackageSelectionStep component
    // which has access to real package data from the enterprise API
    console.log('[Enterprise] Subscription flow initialized with URL params:', searchParams.toString())
  }, [searchParams])

  const handleNext = () => {
    console.log('[Enterprise] Advancing to next step from:', storeStep)
    console.log('[Enterprise] About to call nextStep()')
    setDirection(1)
    nextStep() // Actually advance to the next step
    console.log('[Enterprise] nextStep() called, new step should be:', storeStep + 1)
  }

  const handlePrevious = () => {
    console.log('[Enterprise] Going back from step:', storeStep)
    setDirection(-1)
    prevStep() // Actually go back to the previous step
  }

  const renderStep = () => {
    switch (storeStep) {
      case 1:
        return <PackageSelectionStep onNext={handleNext} />
      case 2:
        return <RegistrationFormStep onNext={handleNext} onBack={handlePrevious} />
      case 3:
        return <ConfirmationStep onNext={handleNext} onBack={handlePrevious} />
      case 4:
        return <SimplePaymentMethodStep onNext={handleNext} onBack={handlePrevious} />
      case 5:
        return <PaymentProcessingStep onNext={handleNext} onBack={handlePrevious} />
      case 6:
        return <SuccessStep subscriptionId={subscriptionId || "demo-subscription"} />
      default:
        return <PackageSelectionStep onNext={handleNext} />
    }
  }

  return (
    <div className="w-full">
      {/* Progress Indicator */}
      <ProgressIndicator currentStep={storeStep} />
      
      {/* Main Content */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={storeStep}
          custom={direction}
          initial={{ x: direction > 0 ? 300 : -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: direction > 0 ? -300 : 300, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          {renderStep()}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export { SubscriptionFlow }