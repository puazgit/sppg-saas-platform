'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Star, Quote, MapPin } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'

interface MarketingTestimonial {
  id: string
  organizationName: string
  contactName: string
  position: string
  location: string
  organizationSize: string
  content: string
  rating: number
  photoUrl?: string
  isPublished: boolean
  isFeatured: boolean
}

const organizationSizeLabels = {
  'SMALL': 'Kecil (1-50 siswa)',
  'MEDIUM': 'Menengah (51-200 siswa)', 
  'LARGE': 'Besar (201-500 siswa)',
  'ENTERPRISE': 'Enterprise (500+ siswa)'
}

export const TestimonialsSection = () => {
  const { data: testimonialsData, isLoading } = useQuery<{ testimonials: MarketingTestimonial[] }>({
    queryKey: ['marketing-testimonials'],
    queryFn: async () => {
      const response = await fetch('/api/marketing/testimonials')
      if (!response.ok) throw new Error('Failed to fetch testimonials')
      return response.json()
    }
  })

  if (isLoading || !testimonialsData) {
    return (
      <section className="py-20 bg-white">
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
                <div className="bg-gray-200 rounded-xl p-6 h-80">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-300 rounded w-full"></div>
                    <div className="h-3 bg-gray-300 rounded w-5/6"></div>
                    <div className="h-3 bg-gray-300 rounded w-4/5"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  const testimonials = testimonialsData.testimonials || []
  const featuredTestimonials = testimonials.filter(t => t.isFeatured)
  const regularTestimonials = testimonials.filter(t => !t.isFeatured)

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ))
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  return (
    <section className="py-24 bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Badge className="mb-4 bg-green-100 text-green-800 px-4 py-2">
            💬 Testimoni Pelanggan
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Dipercaya oleh Ribuan SPPG
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Dengarkan langsung dari SPPG yang telah merasakan transformasi digital 
            dengan platform kami dan meningkatkan efisiensi operasional mereka.
          </p>
        </motion.div>

        {/* Featured Testimonials */}
        {featuredTestimonials.length > 0 && (
          <motion.div 
            className="mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="grid lg:grid-cols-2 gap-8">
              {featuredTestimonials.slice(0, 2).map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, x: index === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="p-8 h-full bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 group relative overflow-hidden">
                    {/* Decorative Quote */}
                    <Quote className="absolute top-4 right-4 w-12 h-12 text-white/20" />
                    
                    <div className="relative z-10">
                      {/* Rating */}
                      <div className="flex items-center space-x-1 mb-4">
                        {renderStars(testimonial.rating)}
                        <span className="ml-2 text-sm font-medium text-blue-100">
                          {testimonial.rating}/5
                        </span>
                      </div>
                      
                      {/* Content */}
                      <blockquote className="text-lg leading-relaxed mb-6 text-blue-50">
                        &ldquo;{testimonial.content}&rdquo;
                      </blockquote>
                      
                      {/* Author Info */}
                      <div className="flex items-center space-x-4">
                        <Avatar className="w-14 h-14 border-2 border-white/30">
                          <AvatarImage src={testimonial.photoUrl} />
                          <AvatarFallback className="bg-white/20 text-white font-bold">
                            {getInitials(testimonial.contactName)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="font-bold text-white">{testimonial.contactName}</h4>
                          <p className="text-blue-100 text-sm">{testimonial.position}</p>
                          <p className="text-blue-200 text-sm font-semibold">
                            {testimonial.organizationName}
                          </p>
                          <div className="flex items-center space-x-4 mt-2">
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-3 h-3 text-blue-300" />
                              <span className="text-xs text-blue-300">{testimonial.location}</span>
                            </div>
                            <Badge className="bg-white/20 text-white text-xs border-white/30">
                              {organizationSizeLabels[testimonial.organizationSize as keyof typeof organizationSizeLabels]}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Regular Testimonials Grid */}
        <motion.div 
          className="grid lg:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          {regularTestimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <Card className="p-6 h-full bg-white border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 group relative">
                {/* Decorative Quote */}
                <Quote className="absolute top-4 right-4 w-8 h-8 text-gray-200 group-hover:text-blue-200 transition-colors" />
                
                <div className="relative z-10">
                  {/* Rating */}
                  <div className="flex items-center space-x-1 mb-4">
                    {renderStars(testimonial.rating)}
                    <span className="ml-2 text-sm font-medium text-gray-600">
                      {testimonial.rating}/5
                    </span>
                  </div>
                  
                  {/* Content */}
                  <blockquote className="text-gray-700 leading-relaxed mb-6">
                    &ldquo;{testimonial.content}&rdquo;
                  </blockquote>
                  
                  {/* Author Info */}
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-12 h-12 border-2 border-gray-200">
                      <AvatarImage src={testimonial.photoUrl} />
                      <AvatarFallback className="bg-blue-100 text-blue-600 font-bold">
                        {getInitials(testimonial.contactName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900">{testimonial.contactName}</h4>
                      <p className="text-gray-600 text-sm">{testimonial.position}</p>
                      <p className="text-blue-600 text-sm font-semibold">
                        {testimonial.organizationName}
                      </p>
                      <div className="flex items-center space-x-3 mt-1">
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500">{testimonial.location}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {organizationSizeLabels[testimonial.organizationSize as keyof typeof organizationSizeLabels]}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Statistics Banner */}
        <motion.div 
          className="mt-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <Card className="p-8 bg-gradient-to-r from-green-600 to-emerald-600 text-white border-0 shadow-2xl">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-6">
                Bergabunglah dengan Komunitas SPPG Sukses
              </h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">500+</div>
                  <div className="text-sm text-green-100">SPPG Terdaftar</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">4.8/5</div>
                  <div className="text-sm text-green-100">Rating Kepuasan</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">25K+</div>
                  <div className="text-sm text-green-100">Siswa Terlayani</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">98%</div>
                  <div className="text-sm text-green-100">Uptime Platform</div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}