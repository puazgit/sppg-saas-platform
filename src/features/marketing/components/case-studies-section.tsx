'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  ArrowRight, TrendingUp, CheckCircle, BarChart3, 
  Target, Clock, Users, Award
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'

interface MarketingCaseStudy {
  id: string
  title: string
  clientName: string
  industry: string
  challenge: string
  solution: string
  results: string[]
  metrics: Record<string, string>
  testimonialQuote: string
  imageUrl?: string
  tags: string[]
  isPublished: boolean
  isFeatured: boolean
}

const metricIcons = {
  efficiency: TrendingUp,
  wasteReduction: Target,
  timeSaved: Clock,
  satisfaction: Users,
  compliance: Award,
  cost: BarChart3
}

export const CaseStudiesSection = () => {
  const { data: caseStudiesData, isLoading } = useQuery<{ caseStudies: MarketingCaseStudy[] }>({
    queryKey: ['marketing-case-studies'],
    queryFn: async () => {
      const response = await fetch('/api/marketing/case-studies')
      if (!response.ok) throw new Error('Failed to fetch case studies')
      return response.json()
    }
  })

  if (isLoading || !caseStudiesData) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-96 mx-auto"></div>
            </div>
          </div>
          <div className="grid lg:grid-cols-2 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-white rounded-xl p-6 h-96">
                  <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2 mb-6"></div>
                  <div className="space-y-2 mb-6">
                    <div className="h-3 bg-gray-300 rounded w-full"></div>
                    <div className="h-3 bg-gray-300 rounded w-5/6"></div>
                    <div className="h-3 bg-gray-300 rounded w-4/5"></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="h-16 bg-gray-300 rounded"></div>
                    <div className="h-16 bg-gray-300 rounded"></div>
                  </div>
                  <div className="h-10 bg-gray-300 rounded w-32"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  const caseStudies = caseStudiesData.caseStudies || []
  const featuredCaseStudies = caseStudies.filter(cs => cs.isFeatured)
  const regularCaseStudies = caseStudies.filter(cs => !cs.isFeatured)

  const getMetricIcon = (key: string) => {
    const lowerKey = key.toLowerCase()
    for (const [metricKey, IconComponent] of Object.entries(metricIcons)) {
      if (lowerKey.includes(metricKey.toLowerCase())) {
        return IconComponent
      }
    }
    return TrendingUp
  }

  const formatMetricValue = (value: string) => {
    if (value.startsWith('+') || value.startsWith('-')) {
      return { value, color: value.startsWith('+') ? 'text-green-600' : 'text-red-600' }
    }
    return { value, color: 'text-blue-600' }
  }

  return (
    <section className="py-24 bg-gradient-to-br from-white via-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Badge className="mb-4 bg-purple-100 text-purple-800 px-4 py-2">
            📊 Studi Kasus
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Kesuksesan SPPG Bersama Kami
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Temukan bagaimana SPPG di seluruh Indonesia meningkatkan efisiensi operasional 
            dan mencapai hasil yang luar biasa dengan platform kami.
          </p>
        </motion.div>

        {/* Featured Case Studies */}
        {featuredCaseStudies.length > 0 && (
          <motion.div 
            className="mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="grid lg:grid-cols-2 gap-8">
              {featuredCaseStudies.slice(0, 2).map((caseStudy, index) => (
                <motion.div
                  key={caseStudy.id}
                  initial={{ opacity: 0, x: index === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="p-8 h-full bg-gradient-to-br from-indigo-600 to-purple-700 text-white border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 group">
                    <div className="space-y-6">
                      {/* Header */}
                      <div>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {caseStudy.tags.slice(0, 2).map((tag, idx) => (
                            <Badge key={idx} className="bg-white/20 text-white border-white/30 text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <h3 className="text-2xl font-bold mb-2">{caseStudy.title}</h3>
                        <p className="text-indigo-100 font-medium">
                          {caseStudy.clientName} • {caseStudy.industry}
                        </p>
                      </div>

                      {/* Challenge & Solution */}
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-white mb-2">Tantangan:</h4>
                          <p className="text-indigo-100 text-sm leading-relaxed">
                            {caseStudy.challenge}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-white mb-2">Solusi:</h4>
                          <p className="text-indigo-100 text-sm leading-relaxed">
                            {caseStudy.solution}
                          </p>
                        </div>
                      </div>

                      {/* Metrics */}
                      <div className="grid grid-cols-2 gap-4">
                        {Object.entries(caseStudy.metrics).slice(0, 4).map(([key, value], idx) => {
                          const IconComponent = getMetricIcon(key)
                          const { value: formattedValue, color } = formatMetricValue(value as string)
                          return (
                            <div key={idx} className="text-center p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                              <IconComponent className="w-6 h-6 text-white mx-auto mb-2" />
                              <div className={`text-lg font-bold ${color === 'text-green-600' ? 'text-green-300' : color === 'text-red-600' ? 'text-red-300' : 'text-white'}`}>
                                {formattedValue}
                              </div>
                              <div className="text-xs text-indigo-200 capitalize">
                                {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                              </div>
                            </div>
                          )
                        })}
                      </div>

                      {/* Testimonial Quote */}
                      <blockquote className="border-l-4 border-white/30 pl-4 text-indigo-100 italic">
                        &ldquo;{caseStudy.testimonialQuote}&rdquo;
                      </blockquote>

                      {/* CTA */}
                      <Button 
                        variant="secondary"
                        className="w-full bg-white text-indigo-600 hover:bg-indigo-50 group/btn"
                      >
                        Baca Selengkapnya
                        <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Regular Case Studies */}
        <motion.div 
          className="grid lg:grid-cols-2 gap-8"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          {regularCaseStudies.map((caseStudy, index) => (
            <motion.div
              key={caseStudy.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <Card className="p-6 h-full bg-white border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <div className="space-y-6">
                  {/* Header */}
                  <div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {caseStudy.tags.slice(0, 3).map((tag, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {caseStudy.title}
                    </h3>
                    <p className="text-gray-600 font-medium">
                      {caseStudy.clientName} • {caseStudy.industry}
                    </p>
                  </div>

                  {/* Challenge */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Tantangan:</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {caseStudy.challenge}
                    </p>
                  </div>

                  {/* Key Results */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Hasil Utama:</h4>
                    <div className="space-y-2">
                      {caseStudy.results.slice(0, 3).map((result, idx) => (
                        <div key={idx} className="flex items-start space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-700">{result}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(caseStudy.metrics).slice(0, 2).map(([key, value], idx) => {
                      const IconComponent = getMetricIcon(key)
                      const { value: formattedValue, color } = formatMetricValue(value as string)
                      return (
                        <div key={idx} className="text-center p-3 bg-gray-50 rounded-lg group-hover:bg-blue-50 transition-colors">
                          <IconComponent className="w-5 h-5 text-gray-600 mx-auto mb-2" />
                          <div className={`text-lg font-bold ${color}`}>
                            {formattedValue}
                          </div>
                          <div className="text-xs text-gray-500 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* CTA */}
                  <Button 
                    variant="outline"
                    className="w-full group/btn"
                  >
                    Pelajari Detail
                    <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div 
          className="text-center mt-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <Card className="p-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 shadow-2xl max-w-4xl mx-auto">
            <div className="text-center space-y-6">
              <h3 className="text-3xl font-bold">
                Siap Menjadi Studi Kasus Berikutnya?
              </h3>
              <p className="text-purple-100 text-lg max-w-2xl mx-auto">
                Bergabunglah dengan SPPG sukses lainnya dan rasakan transformasi 
                digital yang akan meningkatkan efisiensi operasional Anda hingga 65%.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  className="bg-white text-purple-600 hover:bg-purple-50 px-8 py-3"
                >
                  Mulai Transformasi
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