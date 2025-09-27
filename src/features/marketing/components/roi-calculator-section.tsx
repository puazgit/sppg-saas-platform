'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { 
  Calculator, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Clock, 
  CheckCircle,
  ArrowRight
} from 'lucide-react'

interface ROIData {
  currentStudents: number
  currentStaff: number
  currentMonthlyBudget: number
  currentEfficiencyHours: number
}

interface ROIResults {
  monthlySavings: number
  annualSavings: number
  efficiencyGain: number
  paybackPeriod: number
  roi: number
  breakEvenMonths: number
}

export const ROICalculatorSection = () => {
  const [formData, setFormData] = useState<ROIData>({
    currentStudents: 1000,
    currentStaff: 15,
    currentMonthlyBudget: 50000000, // 50 juta rupiah
    currentEfficiencyHours: 160 // jam per bulan
  })

  const [results, setResults] = useState<ROIResults | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)

  // Kalkulasi ROI berdasarkan data input
  const calculateROI = (data: ROIData) => {
    // Konstanta berdasarkan data industri SPPG
    const COST_PER_STUDENT_MANUAL = 15000 // Rp per siswa per bulan (manual)
    const COST_PER_STUDENT_AUTOMATED = 8000 // Rp per siswa per bulan (dengan SPPG SaaS)
    const STAFF_EFFICIENCY_IMPROVEMENT = 0.35 // 35% peningkatan efisiensi
    const COMPLIANCE_COST_REDUCTION = 0.25 // 25% pengurangan biaya compliance
    const SUBSCRIPTION_COST_PER_STUDENT = 2500 // Rp per siswa per bulan
    
    // Perhitungan penghematan operasional
    const operationalSavingsPerMonth = (COST_PER_STUDENT_MANUAL - COST_PER_STUDENT_AUTOMATED) * data.currentStudents
    
    // Perhitungan efisiensi staff
    const staffCostPerHour = data.currentMonthlyBudget / data.currentEfficiencyHours
    const efficiencyGainHours = data.currentEfficiencyHours * STAFF_EFFICIENCY_IMPROVEMENT
    const staffSavingsPerMonth = efficiencyGainHours * staffCostPerHour
    
    // Perhitungan pengurangan biaya compliance
    const complianceSavingsPerMonth = data.currentMonthlyBudget * COMPLIANCE_COST_REDUCTION
    
    // Total penghematan sebelum biaya subscription
    const totalSavingsBeforeSubscription = operationalSavingsPerMonth + staffSavingsPerMonth + complianceSavingsPerMonth
    
    // Biaya subscription SPPG SaaS
    const subscriptionCost = SUBSCRIPTION_COST_PER_STUDENT * data.currentStudents
    
    // Net savings setelah subscription
    const monthlySavings = totalSavingsBeforeSubscription - subscriptionCost
    const annualSavings = monthlySavings * 12
    
    // ROI dan payback calculations
    const implementationCost = subscriptionCost * 3 // Asumsi setup 3 bulan
    const roi = ((annualSavings - implementationCost) / implementationCost) * 100
    const paybackPeriod = implementationCost / monthlySavings
    const breakEvenMonths = Math.ceil(paybackPeriod)
    
    return {
      monthlySavings,
      annualSavings,
      efficiencyGain: STAFF_EFFICIENCY_IMPROVEMENT * 100,
      paybackPeriod,
      roi,
      breakEvenMonths
    }
  }

  const handleCalculate = () => {
    setIsCalculating(true)
    setTimeout(() => {
      const calculatedResults = calculateROI(formData)
      setResults(calculatedResults)
      setIsCalculating(false)
    }, 1500) // Simulasi loading untuk UX yang lebih baik
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatNumber = (num: number, decimals = 1) => {
    return new Intl.NumberFormat('id-ID', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(num)
  }

  // Auto-calculate when form data changes (dengan debounce)
  useEffect(() => {
    if (results) {
      const timer = setTimeout(() => {
        const newResults = calculateROI(formData)
        setResults(newResults)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [formData, results])

  return (
    <section className="relative py-24 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-4 bg-blue-50 text-blue-700 border-blue-200">
            <Calculator className="w-4 h-4 mr-2" />
            ROI Calculator
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent mb-6">
            Hitung ROI SPPG SaaS Platform
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Dapatkan estimasi pengembalian investasi dan penghematan biaya operasional 
            dengan menggunakan platform kami untuk organisasi SPPG Anda.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
          {/* Calculator Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="p-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Calculator className="w-6 h-6 mr-3 text-blue-600" />
                Data Organisasi SPPG Anda
              </h3>

              <div className="space-y-6">
                <div>
                  <Label htmlFor="students" className="text-sm font-medium text-gray-700 mb-2 block">
                    Jumlah Siswa yang Dilayani
                  </Label>
                  <Input
                    id="students"
                    type="number"
                    value={formData.currentStudents}
                    onChange={(e) => setFormData(prev => ({ ...prev, currentStudents: parseInt(e.target.value) || 0 }))}
                    className="text-lg h-12"
                    placeholder="1000"
                  />
                  <p className="text-sm text-gray-500 mt-1">Total siswa yang menerima layanan gizi gratis</p>
                </div>

                <div>
                  <Label htmlFor="staff" className="text-sm font-medium text-gray-700 mb-2 block">
                    Jumlah Staff Operasional
                  </Label>
                  <Input
                    id="staff"
                    type="number"
                    value={formData.currentStaff}
                    onChange={(e) => setFormData(prev => ({ ...prev, currentStaff: parseInt(e.target.value) || 0 }))}
                    className="text-lg h-12"
                    placeholder="15"
                  />
                  <p className="text-sm text-gray-500 mt-1">Koki, admin, driver, dan staff operasional lainnya</p>
                </div>

                <div>
                  <Label htmlFor="budget" className="text-sm font-medium text-gray-700 mb-2 block">
                    Budget Operasional Bulanan (Rp)
                  </Label>
                  <Input
                    id="budget"
                    type="number"
                    value={formData.currentMonthlyBudget}
                    onChange={(e) => setFormData(prev => ({ ...prev, currentMonthlyBudget: parseInt(e.target.value) || 0 }))}
                    className="text-lg h-12"
                    placeholder="50000000"
                  />
                  <p className="text-sm text-gray-500 mt-1">Total biaya operasional termasuk gaji, bahan baku, transport</p>
                </div>

                <div>
                  <Label htmlFor="hours" className="text-sm font-medium text-gray-700 mb-2 block">
                    Total Jam Kerja Staff per Bulan
                  </Label>
                  <Input
                    id="hours"
                    type="number"
                    value={formData.currentEfficiencyHours}
                    onChange={(e) => setFormData(prev => ({ ...prev, currentEfficiencyHours: parseInt(e.target.value) || 0 }))}
                    className="text-lg h-12"
                    placeholder="160"
                  />
                  <p className="text-sm text-gray-500 mt-1">Rata-rata jam kerja seluruh staff per bulan</p>
                </div>

                <Button 
                  onClick={handleCalculate} 
                  disabled={isCalculating}
                  className="w-full h-12 text-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  {isCalculating ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                      />
                      Menghitung ROI...
                    </>
                  ) : (
                    <>
                      <TrendingUp className="w-5 h-5 mr-2" />
                      Hitung ROI & Penghematan
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {results ? (
              <div className="space-y-6">
                {/* Main ROI Card */}
                <Card className="p-8 shadow-xl border-0 bg-gradient-to-br from-green-50 to-emerald-50">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Hasil Perhitungan ROI</h3>
                    <p className="text-gray-600">Estimasi pengembalian investasi untuk organisasi Anda</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 mb-1">
                        {formatNumber(results.roi)}%
                      </div>
                      <div className="text-sm text-gray-600">Return on Investment</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-1">
                        {results.breakEvenMonths}
                      </div>
                      <div className="text-sm text-gray-600">Bulan Break Even</div>
                    </div>
                  </div>
                </Card>

                {/* Savings Breakdown */}
                <Card className="p-6 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                    Penghematan Biaya
                  </h4>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-700">Penghematan Bulanan</span>
                      <span className="font-semibold text-green-600">
                        {formatCurrency(results.monthlySavings)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-700">Penghematan Tahunan</span>
                      <span className="font-semibold text-green-600">
                        {formatCurrency(results.annualSavings)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-700">Peningkatan Efisiensi</span>
                      <span className="font-semibold text-blue-600">
                        {formatNumber(results.efficiencyGain, 0)}%
                      </span>
                    </div>
                  </div>
                </Card>

                {/* Benefits List */}
                <Card className="p-6 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                    Manfaat Tambahan
                  </h4>
                  
                  <div className="space-y-3">
                    {[
                      'Otomatisasi pelaporan compliance',
                      'Real-time monitoring kualitas makanan',
                      'Optimasi inventori dan procurement',
                      'Dashboard analytics mendalam',
                      'Mobile app untuk staff lapangan',
                      'Integrasi dengan sistem pemerintah'
                    ].map((benefit, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center"
                      >
                        <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{benefit}</span>
                      </motion.div>
                    ))}
                  </div>
                </Card>

                {/* CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="text-center space-y-4"
                >
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    onClick={() => window.location.href = '/subscription'}
                  >
                    Mulai Berlangganan Sekarang
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                  <p className="text-sm text-gray-500">
                    Setup dalam 24 jam dengan dukungan penuh dari tim ahli kami
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.location.href = '#pricing'}
                  >
                    Lihat Paket Harga
                  </Button>
                </motion.div>
              </div>
            ) : (
              <Card className="p-12 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <div className="text-center">
                  <Calculator className="w-16 h-16 text-gray-300 mx-auto mb-6" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    Siap Menghitung ROI?
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Masukkan data organisasi SPPG Anda di sebelah kiri untuk mendapatkan 
                    estimasi pengembalian investasi yang akurat.
                  </p>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center justify-center">
                      <Users className="w-4 h-4 mr-2" />
                      Jumlah siswa yang dilayani
                    </div>
                    <div className="flex items-center justify-center">
                      <Clock className="w-4 h-4 mr-2" />
                      Data operasional saat ini
                    </div>
                    <div className="flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Proyeksi penghematan
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">
              Dapatkan Konsultasi ROI Personal
            </h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Tim ahli kami siap membantu Anda menganalisis potensi penghematan 
              dan ROI spesifik untuk organisasi SPPG Anda.
            </p>
            <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50">
              Jadwalkan Konsultasi Gratis
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}