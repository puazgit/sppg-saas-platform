'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { 
  Phone, Mail, MapPin, Clock, MessageCircle, 
  Send, CheckCircle, Star, Users, Shield,
  ArrowRight, Sparkles
} from 'lucide-react'

export const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    phone: '',
    message: '',
    packageInterest: 'STANDARD'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/marketing/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (response.ok) {
        setIsSubmitted(true)
        setFormData({
          name: '', email: '', organization: '', phone: '', message: '', packageInterest: 'STANDARD'
        })
      }
    } catch (error) {
      console.error('Contact form error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactMethods = [
    {
      icon: Phone,
      title: 'Telepon',
      value: '+62 21 1234-5678',
      description: 'Senin - Jumat, 09:00 - 18:00 WIB',
      action: `tel:${process.env.NEXT_PUBLIC_COMPANY_PHONE || '+6221-XXX-XXXX'}`
    },
    {
      icon: Mail,
      title: 'Email',
      value: 'info@sppg-platform.com',
      description: 'Respon dalam 24 jam',
      action: 'mailto:info@sppg-platform.com'
    },
    {
      icon: MessageCircle,
      title: 'WhatsApp',
      value: '+62 812-3456-7890',
      description: 'Chat langsung dengan tim support',
      action: `https://wa.me/${(process.env.NEXT_PUBLIC_COMPANY_WHATSAPP || '+62812-XXXX-XXXX').replace(/[^0-9]/g, '')}`
    }
  ]

  const stats = [
    { icon: Users, value: '500+', label: 'SPPG Terdaftar' },
    { icon: Star, value: '4.9/5', label: 'Rating Kepuasan' },
    { icon: Shield, value: '99.9%', label: 'Uptime Platform' },
    { icon: Clock, value: '24/7', label: 'Monitoring' }
  ]

  if (isSubmitted) {
    return (
      <section className="py-24 bg-gradient-to-br from-green-50 via-white to-emerald-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Terima kasih atas ketertarikan Anda!
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Tim kami akan menghubungi Anda dalam 24 jam untuk demo khusus dan konsultasi gratis.
            </p>
            <Button 
              onClick={() => setIsSubmitted(false)}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
            >
              Kirim Pesan Lain
            </Button>
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-24 bg-gradient-to-br from-slate-50 via-white to-indigo-50">
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
            📞 Hubungi Kami
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Siap Memulai Transformasi Digital?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Tim ahli kami siap membantu SPPG Anda meningkatkan efisiensi operasional. 
            Dapatkan konsultasi gratis dan demo khusus sesuai kebutuhan organisasi Anda.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Card className="p-8 bg-white shadow-2xl border-0">
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Jadwalkan Demo Gratis
                </h3>
                <p className="text-gray-600">
                  Isi form di bawah ini dan tim kami akan menghubungi Anda untuk demo khusus
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nama Lengkap *
                    </label>
                    <Input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="John Doe"
                      required
                      className="h-12"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="john@sppg.com"
                      required
                      className="h-12"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nama Organisasi SPPG *
                    </label>
                    <Input
                      type="text"
                      value={formData.organization}
                      onChange={(e) => handleInputChange('organization', e.target.value)}
                      placeholder="SPPG Jakarta Pusat"
                      required
                      className="h-12"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nomor Telepon
                    </label>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+62 812-3456-7890"
                      className="h-12"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Paket yang Diminati
                  </label>
                  <select
                    value={formData.packageInterest}
                    onChange={(e) => handleInputChange('packageInterest', e.target.value)}
                    className="w-full h-12 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="BASIC">Basic - Rp 500.000/bulan</option>
                    <option value="STANDARD">Standard - Rp 1.200.000/bulan</option>
                    <option value="PRO">Pro - Rp 2.500.000/bulan</option>
                    <option value="ENTERPRISE">Enterprise - Custom</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pesan (Opsional)
                  </label>
                  <Textarea
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    placeholder="Ceritakan tentang kebutuhan spesifik SPPG Anda..."
                    rows={4}
                    className="resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold group"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Mengirim...
                    </>
                  ) : (
                    <>
                      Jadwalkan Demo Gratis
                      <Send className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  Dengan mengirim form ini, Anda menyetujui untuk dihubungi oleh tim kami untuk keperluan demo dan konsultasi.
                </p>
              </form>
            </Card>
          </motion.div>

          {/* Contact Info & Stats */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            {/* Contact Methods */}
            <Card className="p-8 bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-0 shadow-2xl">
              <h3 className="text-2xl font-bold mb-6">Kontak Langsung</h3>
              <div className="space-y-6">
                {contactMethods.map((method, index) => (
                  <motion.a
                    key={index}
                    href={method.action}
                    className="flex items-start space-x-4 p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-all duration-300 group"
                    whileHover={{ scale: 1.02 }}
                    target={method.action.startsWith('http') ? '_blank' : '_self'}
                    rel={method.action.startsWith('http') ? 'noopener noreferrer' : ''}
                  >
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <method.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">{method.title}</h4>
                      <p className="text-blue-100 font-medium">{method.value}</p>
                      <p className="text-xs text-blue-200 mt-1">{method.description}</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-white/70 group-hover:text-white group-hover:translate-x-1 transition-all ml-auto" />
                  </motion.a>
                ))}
              </div>
            </Card>

            {/* Platform Stats */}
            <Card className="p-8 bg-white shadow-xl border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Mengapa Memilih Kami</h3>
              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    className="text-center p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors group"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-200 transition-colors">
                      <stat.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>

            {/* Office Location */}
            <Card className="p-8 bg-white shadow-xl border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Kantor Pusat</h3>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <p className="text-gray-700 leading-relaxed">
                    Jl. Sudirman No. 123<br />
                    Jakarta Pusat, DKI Jakarta 10220<br />
                    Indonesia
                  </p>
                  <div className="flex items-center space-x-2 mt-3">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      Senin - Jumat: 09:00 - 18:00 WIB
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div 
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <Card className="p-8 bg-gradient-to-r from-emerald-600 to-green-600 text-white border-0 shadow-2xl max-w-4xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center justify-between space-y-6 lg:space-y-0">
              <div className="text-left">
                <div className="flex items-center space-x-3 mb-3">
                  <Sparkles className="w-8 h-8 text-yellow-300" />
                  <h3 className="text-2xl font-bold">
                    Demo Khusus untuk SPPG Anda
                  </h3>
                </div>
                <p className="text-emerald-100 max-w-2xl">
                  Dapatkan demo platform yang disesuaikan dengan workflow dan kebutuhan 
                  spesifik SPPG Anda. Gratis konsultasi dengan expert kami.
                </p>
              </div>
              <div className="flex flex-col space-y-3">
                <Button 
                  size="lg"
                  className="bg-white text-emerald-600 hover:bg-emerald-50 px-8 py-3 font-semibold"
                >
                  Jadwalkan Sekarang
                </Button>
                <div className="text-xs text-emerald-200 text-center">
                  Respon dalam 2 jam kerja
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}