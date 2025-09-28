/**
 * Simple Payment Method Step - Transfer with Proof Upload
 * Simplified payment interface with bank transfer and proof upload
 */

'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Building2, Upload, ArrowRight, ArrowLeft, Copy,
  CheckCircle, Info, FileImage, X, Clock, Shield, Loader2 as Loader
} from 'lucide-react'

import { useSubscriptionStore } from '../store/subscription.store'
import { formatCurrency } from '../lib/utils'

interface SimplePaymentMethodStepProps {
  onNext: () => void
  onBack: () => void
}

interface BankAccount {
  id: string
  bankName: string
  accountNumber: string
  accountName: string
  bankCode: string
  color: string
}

export default function SimplePaymentMethodStep({ onNext, onBack }: SimplePaymentMethodStepProps) {
  const { selectedPackage, subscriptionId, resetState } = useSubscriptionStore()
  const [selectedBank, setSelectedBank] = useState<BankAccount | null>(null)
  const [proofFile, setProofFile] = useState<File | null>(null)
  const [transferNote, setTransferNote] = useState('')
  const [transferAmount, setTransferAmount] = useState('')
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([])
  const [loadingBanks, setLoadingBanks] = useState(false)

  // Load bank accounts from API
  useEffect(() => {
    const fetchBankAccounts = async () => {
      setLoadingBanks(true)
      try {
        const response = await fetch('/api/billing/payment/bank-accounts')
        const data = await response.json()
        if (data.success) {
          setBankAccounts(data.bankAccounts || [])
        }
      } catch (error) {
        console.error('Failed to fetch bank accounts:', error)
      } finally {
        setLoadingBanks(false)
      }
    }

    fetchBankAccounts()
  }, [])
  const [transferDate, setTransferDate] = useState('')
  const [copiedAccount, setCopiedAccount] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Validate required data when component mounts
  React.useEffect(() => {
    console.log('[Payment Step] Component mounted, validating data:', {
      hasSubscriptionId: !!subscriptionId,
      hasSelectedPackage: !!selectedPackage,
      subscriptionId,
      packageName: selectedPackage?.name
    })

    if (!subscriptionId || !selectedPackage) {
      console.warn('[Payment Step] Missing required data, redirecting to start')
      alert('Data tidak lengkap. Akan kembali ke langkah awal.')
      resetState()
      window.location.reload()
    }
  }, [subscriptionId, selectedPackage, resetState])

  // Calculate pricing
  const isYearly = false // Get from store if needed
  const monthlyPrice = selectedPackage?.monthlyPrice || 0
  const yearlyPrice = selectedPackage?.yearlyPrice || 0
  const price = isYearly ? yearlyPrice : monthlyPrice
  const setupFee = selectedPackage?.setupFee || 0
  const subtotal = price + setupFee
  const tax = Math.round(subtotal * 0.11) // 11% PPN
  const total = subtotal + tax

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedAccount(type)
      setTimeout(() => setCopiedAccount(''), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf']
      if (!allowedTypes.includes(file.type)) {
        alert('File harus berformat JPG, PNG, WEBP, atau PDF')
        return
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Ukuran file maksimal 5MB')
        return
      }
      
      setProofFile(file)
    }
  }

  const removeFile = () => {
    setProofFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleNext = async () => {
    // Validate form
    if (!selectedBank) {
      alert('Silakan pilih bank tujuan transfer')
      return
    }
    
    if (!proofFile) {
      alert('Silakan upload bukti transfer')
      return
    }
    
    // Clean and parse the input amount
    const cleanInput = transferAmount.replace(/\D/g, '')
    const inputAmount = parseInt(cleanInput)
    
    console.log('[Payment] Amount validation debug:', {
      transferAmount: transferAmount,
      cleanInput: cleanInput,
      inputAmount: inputAmount,
      total: total,
      totalType: typeof total,
      inputType: typeof inputAmount,
      match: inputAmount === total,
      selectedPackage: selectedPackage
    })
    
    // More flexible validation - allow small differences due to rounding
    if (!transferAmount) {
      alert('Silakan masukkan jumlah transfer')
      return
    }
    
    if (isNaN(inputAmount) || inputAmount <= 0) {
      alert('Jumlah transfer tidak valid')
      return
    }
    
    if (Math.abs(inputAmount - total) > 1) { // Allow 1 rupiah difference for rounding
      alert(`Jumlah transfer harus sesuai dengan total pembayaran: ${formatCurrency(total)}\nAnda memasukkan: ${formatCurrency(inputAmount)}\n\nGunakan tombol "Isi Otomatis" untuk mengisi nominal yang tepat.`)
      return
    }
    
    if (!transferDate) {
      alert('Silakan isi tanggal transfer')
      return
    }

    if (!subscriptionId) {
      console.error('[Payment] Subscription ID not found, redirecting to start')
      alert('ID subscription tidak ditemukan. Akan kembali ke langkah awal.')
      
      // Reset state and go to step 1
      const { resetState } = useSubscriptionStore.getState()
      resetState()
      
      // Reload page to start fresh
      window.location.reload()
      return
    }

    setIsUploading(true)

    try {
      console.log('[Payment] Starting upload process...')
      console.log('[Payment] Subscription ID:', subscriptionId)
      console.log('[Payment] Proof file:', proofFile?.name, proofFile?.size)
      
      // Prepare form data
      const formData = new FormData()
      formData.append('paymentProof', proofFile)
      formData.append('bankAccount', `${selectedBank.bankName} - ${selectedBank.accountNumber}`)
      formData.append('transferAmount', transferAmount.replace(/\D/g, ''))
      formData.append('transferDate', transferDate)
      formData.append('transferNote', transferNote)

      console.log('[Payment] Form data prepared:', {
        bankAccount: `${selectedBank.bankName} - ${selectedBank.accountNumber}`,
        transferAmount: transferAmount.replace(/\D/g, ''),
        transferDate,
        transferNote
      })

      // Upload payment proof
      console.log('[Payment] Sending upload request...')
      const response = await fetch(`/api/subscription/${subscriptionId}/payment-proof`, {
        method: 'POST',
        body: formData,
      })

      console.log('[Payment] Response received:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      })

      const responseText = await response.text()
      console.log('[Payment] Raw response:', responseText)
      
      let result
      try {
        result = JSON.parse(responseText)
        console.log('[Payment] Parsed result:', result)
      } catch (parseError) {
        console.error('[Payment] JSON parse error:', parseError)
        throw new Error(`Invalid server response: ${responseText}`)
      }

      if (!response.ok || !result.success) {
        console.error('[Payment] Upload failed:', result)
        throw new Error(result.error || 'Failed to upload payment proof')
      }

      console.log('[Payment] Payment proof uploaded successfully:', result)
      console.log('[Payment] Proceeding to next step...')
      onNext()
      
    } catch (error) {
      console.error('Error uploading payment proof:', error)
      alert(`Gagal upload bukti transfer: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsUploading(false)
    }
  }

  const formatInputCurrency = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    return numbers.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  }

  const handleAmountChange = (value: string) => {
    setTransferAmount(formatInputCurrency(value))
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Pembayaran Berlangganan
          </h2>
          <p className="text-lg text-gray-600">
            Transfer ke rekening bank kami dan upload bukti pembayaran
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Payment Summary */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-600" />
                Ringkasan Pembayaran
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">
                  {selectedPackage?.displayName || selectedPackage?.name}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {selectedPackage?.description}
                </p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Harga paket ({isYearly ? 'Tahunan' : 'Bulanan'})</span>
                    <span>{formatCurrency(price)}</span>
                  </div>
                  {setupFee > 0 && (
                    <div className="flex justify-between">
                      <span>Biaya setup</span>
                      <span>{formatCurrency(setupFee)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>PPN (11%)</span>
                    <span>{formatCurrency(tax)}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-semibold">
                    <span>Total Pembayaran</span>
                    <span className="text-lg text-green-600">{formatCurrency(total)}</span>
                  </div>
                </div>
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Silakan transfer sesuai dengan nominal total pembayaran di atas.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Transfer Form */}
          <Card>
            <CardHeader>
              <CardTitle>Upload Bukti Transfer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Bank Selection */}
              <div>
                <Label className="text-base font-semibold mb-3 block">
                  1. Pilih Bank Tujuan Transfer
                </Label>
                <div className="grid gap-3">
                  {loadingBanks ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Loader className="h-4 w-4 animate-spin" />
                        <span>Memuat rekening bank...</span>
                      </div>
                    </div>
                  ) : bankAccounts.map((bank) => (
                    <div
                      key={bank.id}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedBank?.id === bank.id
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedBank(bank)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg ${bank.color} flex items-center justify-center`}>
                            <Building2 className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{bank.bankName}</p>
                            <p className="text-sm text-gray-600">{bank.accountName}</p>
                          </div>
                        </div>
                        {selectedBank?.id === bank.id && (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        )}
                      </div>
                      
                      {selectedBank?.id === bank.id && (
                        <div className="mt-4 p-3 bg-white rounded border border-gray-200">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-gray-600">Nomor Rekening:</p>
                              <p className="font-mono font-bold text-lg">{bank.accountNumber}</p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                copyToClipboard(bank.accountNumber, bank.id)
                              }}
                            >
                              {copiedAccount === bank.id ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                              {copiedAccount === bank.id ? 'Tersalin' : 'Salin'}
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Transfer Details */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">
                  2. Detail Transfer
                </Label>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label htmlFor="transferAmount">Jumlah Transfer *</Label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const formattedAmount = formatInputCurrency(total.toString())
                          console.log('[Payment] Auto-fill clicked:', {
                            total,
                            formattedAmount,
                            willSet: formattedAmount
                          })
                          setTransferAmount(formattedAmount)
                        }}
                        className="text-blue-600 hover:text-blue-800 text-xs h-auto p-1"
                      >
                        Isi Otomatis ({formatCurrency(total)})
                      </Button>
                    </div>
                    <Input
                      id="transferAmount"
                      value={transferAmount}
                      onChange={(e) => handleAmountChange(e.target.value)}
                      placeholder={`Contoh: ${formatInputCurrency(total.toString())}`}
                      className="font-mono"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Gunakan titik (.) sebagai pemisah ribuan. Contoh: 2.500.000
                    </p>
                  </div>
                  
                  <div>
                    <Label htmlFor="transferDate">Tanggal Transfer *</Label>
                    <Input
                      id="transferDate"
                      type="date"
                      value={transferDate}
                      onChange={(e) => setTransferDate(e.target.value)}
                      max={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="transferNote">Catatan (Opsional)</Label>
                  <Textarea
                    id="transferNote"
                    value={transferNote}
                    onChange={(e) => setTransferNote(e.target.value)}
                    placeholder="Catatan tambahan untuk transfer ini..."
                    rows={3}
                  />
                </div>
              </div>

              {/* File Upload */}
              <div>
                <Label className="text-base font-semibold mb-3 block">
                  3. Upload Bukti Transfer *
                </Label>
                
                {!proofFile ? (
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-1">
                      Klik untuk upload bukti transfer
                    </p>
                    <p className="text-xs text-gray-500">
                      Format: JPG, PNG, WEBP, PDF (max. 5MB)
                    </p>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileImage className="h-8 w-8 text-green-600" />
                      <div>
                        <p className="font-medium text-gray-900">{proofFile.name}</p>
                        <p className="text-sm text-gray-500">
                          {(proofFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={removeFile}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp,application/pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              <Alert>
                <Clock className="h-4 w-4" />
                <AlertDescription>
                  Pembayaran akan diverifikasi dalam 1x24 jam setelah bukti transfer diterima.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={isUploading}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-50"
          >
            {isUploading ? (
              <>
                <Loader className="h-4 w-4 animate-spin" />
                Mengupload...
              </>
            ) : (
              <>
                Upload & Lanjutkan
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </motion.div>
    </div>
  )
}