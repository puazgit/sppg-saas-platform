/**
 * Enhanced Payment Method Step - Complete Payment Options
 * Professional payment interface with comprehensive method selection
 */

'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  CreditCard, Smartphone, Building, Wallet, ArrowRight, ArrowLeft,
  Shield, Info, CheckCircle, Clock
} from 'lucide-react'

import { useSubscriptionStore } from '../store/subscription.store'
import { formatCurrency } from '../lib/utils'

interface PaymentMethodStepProps {
  onNext: () => void
  onBack: () => void
}

interface PaymentMethodOption {
  id: string
  name: string
  type: 'CREDIT_CARD' | 'DEBIT_CARD' | 'E_WALLET' | 'VIRTUAL_ACCOUNT' | 'BANK_TRANSFER'
  icon: React.ReactNode
  description: string
  processingTime: string
  fee: number | string
  feeType: 'FIXED' | 'PERCENTAGE'
  popular?: boolean
  instantPayment: boolean
  providers?: string[]
}

export default function PaymentMethodStep({ onNext, onBack }: PaymentMethodStepProps) {
  const { selectedPackage, isLoading } = useSubscriptionStore()
  const [selectedMethod, setSelectedMethod] = useState<string>('')
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    cardHolderName: '',
    phoneNumber: '',
    bankCode: ''
  })
  const [showCardForm, setShowCardForm] = useState(false)
  const [showEWalletForm, setShowEWalletForm] = useState(false)

  const packagePrice = selectedPackage?.monthlyPrice || 0
  const setupFee = selectedPackage?.setupFee || 0
  const subtotal = packagePrice + setupFee
  const tax = Math.round(subtotal * 0.11)

  const PAYMENT_METHODS: PaymentMethodOption[] = [
    {
      id: 'credit_card',
      name: 'Kartu Kredit',
      type: 'CREDIT_CARD',
      icon: <CreditCard className="h-6 w-6" />,
      description: 'Visa, Mastercard, JCB, American Express',
      processingTime: 'Instan',
      fee: 2.9,
      feeType: 'PERCENTAGE',
      popular: true,
      instantPayment: true,
      providers: ['VISA', 'MASTERCARD', 'JCB', 'AMEX']
    },
    {
      id: 'debit_card',
      name: 'Kartu Debit',
      type: 'DEBIT_CARD',
      icon: <CreditCard className="h-6 w-6" />,
      description: 'Kartu debit semua bank',
      processingTime: 'Instan',
      fee: 1.5,
      feeType: 'PERCENTAGE',
      instantPayment: true,
      providers: ['BCA', 'BNI', 'BRI', 'MANDIRI', 'CIMB', 'DANAMON']
    },
    {
      id: 'gopay',
      name: 'GoPay',
      type: 'E_WALLET',
      icon: <Wallet className="h-6 w-6 text-green-600" />,
      description: 'Pembayaran dengan GoPay',
      processingTime: 'Instan',
      fee: 0,
      feeType: 'FIXED',
      popular: true,
      instantPayment: true
    },
    {
      id: 'ovo',
      name: 'OVO',
      type: 'E_WALLET',
      icon: <Wallet className="h-6 w-6 text-purple-600" />,
      description: 'Pembayaran dengan OVO',
      processingTime: 'Instan',
      fee: 0,
      feeType: 'FIXED',
      instantPayment: true
    },
    {
      id: 'dana',
      name: 'DANA',
      type: 'E_WALLET',
      icon: <Wallet className="h-6 w-6 text-blue-600" />,
      description: 'Pembayaran dengan DANA',
      processingTime: 'Instan',
      fee: 0,
      feeType: 'FIXED',
      instantPayment: true
    },
    {
      id: 'shopeepay',
      name: 'ShopeePay',
      type: 'E_WALLET',
      icon: <Wallet className="h-6 w-6 text-orange-600" />,
      description: 'Pembayaran dengan ShopeePay',
      processingTime: 'Instan',
      fee: 0,
      feeType: 'FIXED',
      instantPayment: true
    },
    {
      id: 'va_bca',
      name: 'Virtual Account BCA',
      type: 'VIRTUAL_ACCOUNT',
      icon: <Building className="h-6 w-6 text-blue-800" />,
      description: 'Transfer ke Virtual Account BCA',
      processingTime: '5-15 menit',
      fee: 4000,
      feeType: 'FIXED',
      instantPayment: false
    },
    {
      id: 'va_bni',
      name: 'Virtual Account BNI',
      type: 'VIRTUAL_ACCOUNT',
      icon: <Building className="h-6 w-6 text-orange-600" />,
      description: 'Transfer ke Virtual Account BNI',
      processingTime: '5-15 menit',
      fee: 4000,
      feeType: 'FIXED',
      instantPayment: false
    },
    {
      id: 'va_bri',
      name: 'Virtual Account BRI',
      type: 'VIRTUAL_ACCOUNT',
      icon: <Building className="h-6 w-6 text-blue-600" />,
      description: 'Transfer ke Virtual Account BRI',
      processingTime: '5-15 menit',
      fee: 4000,
      feeType: 'FIXED',
      instantPayment: false
    },
    {
      id: 'va_mandiri',
      name: 'Virtual Account Mandiri',
      type: 'VIRTUAL_ACCOUNT',
      icon: <Building className="h-6 w-6 text-yellow-600" />,
      description: 'Transfer ke Virtual Account Mandiri',
      processingTime: '5-15 menit',
      fee: 4000,
      feeType: 'FIXED',
      instantPayment: false
    },
    {
      id: 'bank_transfer',
      name: 'Transfer Bank Manual',
      type: 'BANK_TRANSFER',
      icon: <Building className="h-6 w-6" />,
      description: 'Transfer manual ke rekening bank',
      processingTime: '1-24 jam',
      fee: 0,
      feeType: 'FIXED',
      instantPayment: false
    }
  ]

  const calculatePaymentFee = (method: PaymentMethodOption) => {
    if (method.feeType === 'PERCENTAGE') {
      return Math.round(subtotal * (Number(method.fee) / 100))
    }
    return Number(method.fee)
  }

  const calculateTotal = (method?: PaymentMethodOption) => {
    const selectedPaymentMethod = method || PAYMENT_METHODS.find(m => m.id === selectedMethod)
    if (!selectedPaymentMethod) return subtotal + tax
    
    return subtotal + tax + calculatePaymentFee(selectedPaymentMethod)
  }

  const handleMethodSelection = (methodId: string) => {
    setSelectedMethod(methodId)
    const method = PAYMENT_METHODS.find(m => m.id === methodId)
    
    if (method) {
      setShowCardForm(method.type === 'CREDIT_CARD' || method.type === 'DEBIT_CARD')
      setShowEWalletForm(method.type === 'E_WALLET')
    }
  }

  const handleNext = () => {
    const method = PAYMENT_METHODS.find(m => m.id === selectedMethod)
    if (!method) return

    console.log('[Payment Method] Selected:', {
      method: method.name,
      type: method.type,
      fee: calculatePaymentFee(method),
      total: calculateTotal(method),
      details: paymentDetails
    })
    
    onNext()
  }

  const isFormComplete = () => {
    if (!selectedMethod) return false
    
    const method = PAYMENT_METHODS.find(m => m.id === selectedMethod)
    if (!method) return false

    if (method.type === 'CREDIT_CARD' || method.type === 'DEBIT_CARD') {
      return paymentDetails.cardNumber && paymentDetails.expiryMonth && 
             paymentDetails.expiryYear && paymentDetails.cvv && paymentDetails.cardHolderName
    }

    if (method.type === 'E_WALLET') {
      return paymentDetails.phoneNumber
    }

    return true
  }

  const groupMethodsByType = () => {
    const groups = {
      instant: PAYMENT_METHODS.filter(m => m.instantPayment),
      virtual_account: PAYMENT_METHODS.filter(m => m.type === 'VIRTUAL_ACCOUNT'),
      bank_transfer: PAYMENT_METHODS.filter(m => m.type === 'BANK_TRANSFER')
    }
    return groups
  }

  const groups = groupMethodsByType()

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-6xl mx-auto space-y-6"
    >
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Metode Pembayaran</h1>
        <p className="text-lg text-gray-600">
          Pilih metode pembayaran yang paling sesuai untuk Anda
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Payment Methods */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Instant Payment Methods */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Pembayaran Instan
                <Badge className="bg-green-100 text-green-800 text-xs">Direkomendasikan</Badge>
              </CardTitle>
              <p className="text-sm text-gray-600">Proses otomatis dan langsung aktif</p>
            </CardHeader>
            <CardContent>
              <RadioGroup value={selectedMethod} onValueChange={handleMethodSelection}>
                <div className="grid gap-3">
                  {groups.instant.map((method) => (
                    <div key={method.id} className="relative">
                      <div className={`flex items-center space-x-2 p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedMethod === method.id 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}>
                        <RadioGroupItem value={method.id} id={method.id} />
                        <label htmlFor={method.id} className="flex-1 cursor-pointer">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {method.icon}
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{method.name}</span>
                                  {method.popular && (
                                    <Badge className="bg-orange-100 text-orange-800 text-xs">Populer</Badge>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600">{method.description}</p>
                                <div className="flex items-center gap-4 mt-1">
                                  <span className="text-xs text-green-600 flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {method.processingTime}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    Biaya: {method.fee === 0 ? 'Gratis' : 
                                      method.feeType === 'PERCENTAGE' ? `${method.fee}%` : formatCurrency(Number(method.fee))
                                    }
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Virtual Account Methods */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5 text-blue-600" />
                Virtual Account
              </CardTitle>
              <p className="text-sm text-gray-600">Transfer ke nomor Virtual Account</p>
            </CardHeader>
            <CardContent>
              <RadioGroup value={selectedMethod} onValueChange={handleMethodSelection}>
                <div className="grid md:grid-cols-2 gap-3">
                  {groups.virtual_account.map((method) => (
                    <div key={method.id} className="relative">
                      <div className={`flex items-center space-x-2 p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedMethod === method.id 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}>
                        <RadioGroupItem value={method.id} id={method.id} />
                        <label htmlFor={method.id} className="flex-1 cursor-pointer">
                          <div className="flex items-center gap-3">
                            {method.icon}
                            <div>
                              <div className="font-medium">{method.name}</div>
                              <div className="flex items-center gap-4 mt-1">
                                <span className="text-xs text-blue-600 flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {method.processingTime}
                                </span>
                                <span className="text-xs text-gray-500">
                                  Biaya: {formatCurrency(Number(method.fee))}
                                </span>
                              </div>
                            </div>
                          </div>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Bank Transfer */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5 text-gray-600" />
                Transfer Bank Manual
              </CardTitle>
              <p className="text-sm text-gray-600">Transfer manual ke rekening bank kami</p>
            </CardHeader>
            <CardContent>
              <RadioGroup value={selectedMethod} onValueChange={handleMethodSelection}>
                {groups.bank_transfer.map((method) => (
                  <div key={method.id} className="relative">
                    <div className={`flex items-center space-x-2 p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedMethod === method.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}>
                      <RadioGroupItem value={method.id} id={method.id} />
                      <label htmlFor={method.id} className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {method.icon}
                            <div>
                              <div className="font-medium">{method.name}</div>
                              <p className="text-sm text-gray-600">{method.description}</p>
                              <div className="flex items-center gap-4 mt-1">
                                <span className="text-xs text-orange-600 flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {method.processingTime}
                                </span>
                                <span className="text-xs text-green-600">Gratis biaya admin</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Payment Details Form */}
          <AnimatePresence>
            {showCardForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Card className="border-2 border-blue-200">
                  <CardHeader className="bg-blue-50">
                    <CardTitle className="flex items-center gap-2 text-blue-800">
                      <CreditCard className="h-5 w-5" />
                      Detail Kartu
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div>
                      <Label htmlFor="cardNumber">Nomor Kartu</Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={paymentDetails.cardNumber}
                        onChange={(e) => setPaymentDetails(prev => ({ ...prev, cardNumber: e.target.value }))}
                        maxLength={19}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="expiryMonth">Bulan</Label>
                        <Select 
                          value={paymentDetails.expiryMonth} 
                          onValueChange={(value) => setPaymentDetails(prev => ({ ...prev, expiryMonth: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="MM" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 12 }, (_, i) => (
                              <SelectItem key={i + 1} value={String(i + 1).padStart(2, '0')}>
                                {String(i + 1).padStart(2, '0')}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="expiryYear">Tahun</Label>
                        <Select 
                          value={paymentDetails.expiryYear} 
                          onValueChange={(value) => setPaymentDetails(prev => ({ ...prev, expiryYear: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="YYYY" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 10 }, (_, i) => (
                              <SelectItem key={i} value={String(new Date().getFullYear() + i)}>
                                {new Date().getFullYear() + i}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          placeholder="123"
                          value={paymentDetails.cvv}
                          onChange={(e) => setPaymentDetails(prev => ({ ...prev, cvv: e.target.value }))}
                          maxLength={4}
                          type="password"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="cardHolderName">Nama Pemegang Kartu</Label>
                      <Input
                        id="cardHolderName"
                        placeholder="Nama sesuai kartu"
                        value={paymentDetails.cardHolderName}
                        onChange={(e) => setPaymentDetails(prev => ({ ...prev, cardHolderName: e.target.value }))}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {showEWalletForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Card className="border-2 border-green-200">
                  <CardHeader className="bg-green-50">
                    <CardTitle className="flex items-center gap-2 text-green-800">
                      <Smartphone className="h-5 w-5" />
                      Detail E-Wallet
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div>
                      <Label htmlFor="phoneNumber">Nomor HP Terdaftar</Label>
                      <Input
                        id="phoneNumber"
                        placeholder="08123456789"
                        value={paymentDetails.phoneNumber}
                        onChange={(e) => setPaymentDetails(prev => ({ ...prev, phoneNumber: e.target.value }))}
                      />
                      <p className="text-sm text-gray-600 mt-1">
                        Masukkan nomor HP yang terdaftar di aplikasi e-wallet
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Column - Payment Summary */}
        <div className="space-y-6">
          <Card className="border-2 border-green-200 sticky top-4">
            <CardHeader className="bg-green-50">
              <CardTitle className="flex items-center gap-2 text-green-800">
                <Shield className="h-5 w-5" />
                Ringkasan Pembayaran
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Subscription {selectedPackage?.displayName}</span>
                  <span className="font-semibold">{formatCurrency(packagePrice)}</span>
                </div>
                
                {setupFee > 0 && (
                  <div className="flex justify-between">
                    <span>Setup Fee</span>
                    <span className="font-semibold">{formatCurrency(setupFee)}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm text-gray-600">
                  <span>PPN (11%)</span>
                  <span>{formatCurrency(tax)}</span>
                </div>

                <Separator />

                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold">{formatCurrency(subtotal + tax)}</span>
                </div>

                {selectedMethod && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span>Biaya Payment</span>
                      <span className="text-red-600">
                        {(() => {
                          const method = PAYMENT_METHODS.find(m => m.id === selectedMethod)
                          if (!method || method.fee === 0) return 'Gratis'
                          return `+ ${formatCurrency(calculatePaymentFee(method))}`
                        })()}
                      </span>
                    </div>

                    <Separator />

                    <div className="flex justify-between text-lg font-bold">
                      <span>Total Bayar</span>
                      <span className="text-green-600">{formatCurrency(calculateTotal())}</span>
                    </div>
                  </>
                )}
              </div>

              {selectedMethod && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 text-blue-700 text-sm font-medium">
                    <Info className="h-4 w-4" />
                    {(() => {
                      const method = PAYMENT_METHODS.find(m => m.id === selectedMethod)
                      if (method?.instantPayment) {
                        return 'Pembayaran Instan'
                      }
                      return 'Konfirmasi Otomatis'
                    })()}
                  </div>
                  <p className="text-blue-600 text-sm mt-1">
                    {(() => {
                      const method = PAYMENT_METHODS.find(m => m.id === selectedMethod)
                      if (method?.instantPayment) {
                        return 'Akun SPPG akan aktif otomatis setelah pembayaran berhasil'
                      }
                      return `Akun akan aktif dalam ${method?.processingTime} setelah transfer dikonfirmasi`
                    })()}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Security Information */}
          <Card className="border-2 border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 text-gray-700 font-medium mb-3">
                <Shield className="h-5 w-5 text-green-600" />
                Keamanan Terjamin
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <p>✓ SSL 256-bit encryption</p>
                <p>✓ PCI DSS compliant</p>
                <p>✓ Data tidak disimpan di server</p>
                <p>✓ Protected by Midtrans</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Konfirmasi
        </Button>

        <Button
          onClick={handleNext}
          disabled={!isFormComplete() || isLoading}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8"
        >
          {isLoading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="h-4 w-4 border-2 border-white border-t-transparent rounded-full"
            />
          ) : (
            <>
              Lanjut ke Pembayaran
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </motion.div>
  )
}