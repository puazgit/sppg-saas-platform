'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Shield, BarChart3, Users, Truck, Clock, ChefHat, 
  School, Globe, Target, TrendingUp, Award, 
  CheckCircle, ArrowRight, Sparkles
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'

interface MarketingFeature {
  id: string
  title: string
  description: string
  icon: string
  category: string
  benefits: string[]
  availableIn: string[]
  isHighlight: boolean
}

const iconMap = {
  Shield, BarChart3, Users, Truck, Clock, ChefHat, 
  School, Globe, Target, TrendingUp, Award, 
  CheckCircle, ArrowRight, Sparkles
}

export const FeaturesSection = () => {
  const { data: featuresData, isLoading } = useQuery<{ features: MarketingFeature[] }>({
    queryKey: ['marketing-features'],
    queryFn: async () => {
      const response = await fetch('/api/marketing/features')
      if (!response.ok) throw new Error('Failed to fetch features')
      return response.json()
    }
  })

  if (isLoading || !featuresData) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-96 mx-auto"></div>
            </div>
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-white rounded-xl p-6 h-64">
                  <div className="h-12 w-12 bg-gray-300 rounded-lg mb-4"></div>
                  <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-full mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-300 rounded w-full"></div>
                    <div className="h-3 bg-gray-300 rounded w-5/6"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  const features = featuresData.features || []
  const highlightFeatures = features.filter(f => f.isHighlight)
  const regularFeatures = features.filter(f => !f.isHighlight)

  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Badge className="mb-4 bg-blue-100 text-blue-800 px-4 py-2">
            ✨ Fitur Enterprise
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Platform Terlengkap untuk SPPG Modern
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Kelola seluruh operasi SPPG Anda dengan fitur-fitur canggih yang dirancang khusus 
            untuk meningkatkan efisiensi dan compliance sesuai standar pemerintah.
          </p>
        </motion.div>

        {/* Highlight Features */}
        {highlightFeatures.length > 0 && (
          <motion.div 
            className="mb-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="grid lg:grid-cols-2 gap-8">
              {highlightFeatures.slice(0, 2).map((feature, index) => {
                const IconComponent = iconMap[feature.icon as keyof typeof iconMap] || Shield
                return (
                  <motion.div
                    key={feature.id}
                    initial={{ opacity: 0, x: index === 0 ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card className="p-8 h-full bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 group">
                      <div className="flex items-start space-x-6">
                        <div className="flex-shrink-0">
                          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <IconComponent className="w-8 h-8 text-white" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <Badge className="mb-3 bg-white/20 text-white border-white/30">
                            {feature.category}
                          </Badge>
                          <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                          <p className="text-blue-100 mb-6 text-lg leading-relaxed">
                            {feature.description}
                          </p>
                          
                          {feature.benefits.length > 0 && (
                            <div className="space-y-3 mb-6">
                              {feature.benefits.slice(0, 3).map((benefit, idx) => (
                                <div key={idx} className="flex items-center space-x-3">
                                  <CheckCircle className="w-5 h-5 text-green-300 flex-shrink-0" />
                                  <span className="text-white/90">{benefit}</span>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          <Button 
                            variant="secondary"
                            className="bg-white text-blue-600 hover:bg-blue-50 group/btn"
                          >
                            Pelajari Lebih Lanjut
                            <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* Regular Features Grid */}
        <motion.div 
          className="grid lg:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          {regularFeatures.map((feature, index) => {
            const IconComponent = iconMap[feature.icon as keyof typeof iconMap] || Shield
            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <Card className="p-6 h-full bg-white border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <div className="mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <Badge 
                      variant="secondary" 
                      className="text-xs bg-gray-100 text-gray-600 mb-3"
                    >
                      {feature.category}
                    </Badge>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {feature.description}
                  </p>
                  
                  {feature.benefits.length > 0 && (
                    <div className="space-y-2 mb-4">
                      {feature.benefits.slice(0, 2).map((benefit, idx) => (
                        <div key={idx} className="flex items-center space-x-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span className="text-gray-700">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {feature.availableIn.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-4">
                      {feature.availableIn.map((tier, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {tier}
                        </Badge>
                      ))}
                    </div>
                  )}
                </Card>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div 
          className="text-center mt-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <Card className="p-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-0 shadow-2xl max-w-4xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center justify-between space-y-6 lg:space-y-0">
              <div className="text-left">
                <h3 className="text-2xl font-bold mb-2">
                  Siap Mengoptimalkan SPPG Anda?
                </h3>
                <p className="text-indigo-100">
                  Bergabunglah dengan 500+ SPPG yang telah merasakan manfaatnya
                </p>
              </div>
              <div className="flex space-x-4">
                <Button 
                  size="lg"
                  className="bg-white text-indigo-600 hover:bg-indigo-50 px-8 py-3"
                >
                  Mulai Demo Gratis
                </Button>
                <Button 
                  variant="outline"
                  size="lg" 
                  className="border-white/30 text-white hover:bg-white/10 px-8 py-3"
                >
                  Konsultasi Gratis
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}