/**
 * Hero Section Component
 * Hero section dengan animasi dan real-time stats dari database
 */

'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { 
  Sparkles, ArrowRight, Play, Users, Building2, 
  TrendingUp, Clock, ChefHat, School, MapPin,
  Heart, Award, Zap
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'





const iconMap = {
  Users, Building2, TrendingUp, Clock, ChefHat, School, 
  MapPin, Heart, Award, Zap, Sparkles
}

export function HeroSection() {
  const [currentStatIndex, setCurrentStatIndex] = useState(0)
  const [animatedNumbers, setAnimatedNumbers] = useState<Record<string, number>>({})

  // Fetch hero content from database
  const { data: heroResponse, isLoading: heroLoading } = useQuery({
    queryKey: ['marketing-hero'],
    queryFn: async () => {
      const response = await fetch('/api/marketing/hero')
      if (!response.ok) throw new Error('Failed to fetch hero data')
      return response.json()
    }
  })

  // Extract hero data from API response
  const heroData = heroResponse?.data
  
  // Fetch real-time stats from database
  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['marketing-stats'],
    queryFn: async () => {
      const response = await fetch('/api/marketing/stats')
      if (!response.ok) throw new Error('Failed to fetch stats')
      return response.json()
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  })

    // Animate numbers
  useEffect(() => {
    if (heroData?.stats) {
      const targets = {
        sppgCount: heroData.stats.sppgCount,
        totalStudents: heroData.stats.totalStudents,
        totalMealsDistributed: heroData.stats.totalMealsDistributed,
        activeSchools: heroData.stats.activeSchools,
        provinceCount: heroData.stats.provinceCount,
        complianceScore: heroData.stats.complianceScore,
        avgSatisfactionRating: heroData.stats.avgSatisfactionRating
      }

      Object.keys(targets).forEach(key => {
        const target = targets[key as keyof typeof targets]
        let current = 0
        const increment = target / 50 // 50 steps
        const timer = setInterval(() => {
          current += increment
          if (current >= target) {
            current = target
            clearInterval(timer)
          }
          setAnimatedNumbers(prev => ({ ...prev, [key]: Math.floor(current) }))
        }, 40) // 40ms * 50 = 2 seconds total animation
      })
    }
  }, [heroData])

    // Rotate trust indicators display
  useEffect(() => {
    if (heroData?.trustIndicators && heroData.trustIndicators.length > 1) {
      const interval = setInterval(() => {
        setCurrentStatIndex(prev => (prev + 1) % heroData.trustIndicators.length)
      }, 3000)
      return () => clearInterval(interval)
    }
  }, [heroData])

  if (heroLoading || !heroData) {
    return (
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8 animate-pulse">
            <div className="h-6 bg-white/20 rounded w-48 mx-auto"></div>
            <div className="space-y-4">
              <div className="h-16 bg-white/20 rounded w-96 mx-auto"></div>
              <div className="h-16 bg-white/20 rounded w-80 mx-auto"></div>
            </div>
            <div className="h-6 bg-white/20 rounded w-2/3 mx-auto"></div>
            <div className="flex justify-center gap-4">
              <div className="h-14 bg-white/20 rounded w-32"></div>
              <div className="h-14 bg-white/20 rounded w-40"></div>
            </div>
          </div>
        </div>
      </section>
    )
  }



  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
      
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight,
              scale: 0 
            }}
            animate={{ 
              y: -100,
              scale: [0, 1, 0],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-screen">
          {/* Content */}
          <motion.div 
            className="text-center lg:text-left space-y-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Badge className="mb-4 bg-blue-500/20 text-blue-300 border-blue-400/30 px-4 py-2">
                <Sparkles className="w-4 h-4 mr-2" />
                {heroData?.subtitle || 'Platform SPPG Modern'}
              </Badge>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight text-white">
                <span className="bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
                  {heroData?.title?.split(' ').slice(0, 2).join(' ') || 'Platform SaaS'}
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {heroData?.title?.split(' ').slice(2).join(' ') || 'untuk SPPG Modern'}
                </span>
              </h1>
            </motion.div>
            
            <motion.p 
              className="text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              {heroData?.description || 'Kelola operasi Satuan Pelayanan Gizi Gratis dengan teknologi terdepan.'}
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-2xl shadow-blue-500/25 px-8 py-4 text-lg group"
              >
                <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Demo Interaktif
              </Button>
              
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-white/20 text-white hover:bg-white/10 backdrop-blur-sm px-8 py-4 text-lg group"
              >
                Pelajari Lebih Lanjut
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>

            {/* Real-time trust indicators */}
            {heroData?.trustIndicators && heroData.trustIndicators.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="mt-12"
              >
                <Card className="bg-white/10 backdrop-blur-md border-white/20 p-6">
                  <motion.div
                    key={currentStatIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex items-center justify-center lg:justify-start space-x-4"
                  >
                    {(() => {
                      const indicator = heroData.trustIndicators[currentStatIndex % heroData.trustIndicators.length]
                      const IconComponent = iconMap[indicator.icon as keyof typeof iconMap] || Building2
                      return (
                        <>
                          <IconComponent className="w-8 h-8 text-blue-300" />
                          <div>
                            <div className="text-2xl font-bold text-white">
                              {indicator.value}
                              {indicator.trend && (
                                <span className="text-sm text-green-400 ml-2">
                                  +{indicator.trend.percentage.toFixed(0)}%
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-300">{indicator.label}</div>
                          </div>
                        </>
                      )
                    })()}
                  </motion.div>
                </Card>
              </motion.div>
            )}
          </motion.div>

          {/* Stats Grid */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {!statsLoading && statsData && (
              <div className="grid grid-cols-2 gap-4">
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Card className="bg-white/10 backdrop-blur-md border-white/20 p-6 text-center">
                    <Building2 className="w-8 h-8 text-blue-300 mx-auto mb-3" />
                    <div className="text-3xl font-bold text-white">
                      {animatedNumbers.sppgActive || 0}
                    </div>
                    <div className="text-sm text-gray-300">SPPG Aktif</div>
                  </Card>
                </motion.div>

                <motion.div whileHover={{ scale: 1.05 }}>
                  <Card className="bg-white/10 backdrop-blur-md border-white/20 p-6 text-center">
                    <Users className="w-8 h-8 text-green-300 mx-auto mb-3" />
                    <div className="text-3xl font-bold text-white">
                      {(animatedNumbers.totalStudents || 0).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-300">Total Siswa</div>
                  </Card>
                </motion.div>

                <motion.div whileHover={{ scale: 1.05 }}>
                  <Card className="bg-white/10 backdrop-blur-md border-white/20 p-6 text-center">
                    <ChefHat className="w-8 h-8 text-yellow-300 mx-auto mb-3" />
                    <div className="text-3xl font-bold text-white">
                      {(animatedNumbers.mealsDistributed || 0).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-300">Makanan Disajikan</div>
                  </Card>
                </motion.div>

                <motion.div whileHover={{ scale: 1.05 }}>
                  <Card className="bg-white/10 backdrop-blur-md border-white/20 p-6 text-center">
                    <School className="w-8 h-8 text-purple-300 mx-auto mb-3" />
                    <div className="text-3xl font-bold text-white">
                      {animatedNumbers.activeSchools || 0}
                    </div>
                    <div className="text-sm text-gray-300">Sekolah Aktif</div>
                  </Card>
                </motion.div>

                <motion.div whileHover={{ scale: 1.05 }} className="col-span-2">
                  <Card className="bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-md border-white/20 p-6 text-center">
                    <Award className="w-10 h-10 text-yellow-300 mx-auto mb-3" />
                    <div className="text-4xl font-bold text-white">
                      {animatedNumbers.complianceScore || 0}%
                    </div>
                    <div className="text-sm text-gray-300">Skor Kepatuhan</div>
                  </Card>
                </motion.div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
