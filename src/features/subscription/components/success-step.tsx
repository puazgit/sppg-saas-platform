/**
 * Success Page Component - Comprehensive success flow with account activation and onboarding
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { SuccessData, OnboardingStep } from '../types/success';
import { SuccessService } from '../services/success-service';
import { useSubscriptionStore } from '../store/subscription.store';
import { formatCurrency, formatDate } from '../lib/utils';

interface SuccessStepProps {
  subscriptionId: string;
}

export default function SuccessStep({ subscriptionId }: SuccessStepProps) {
  const { selectedPackage, resetState } = useSubscriptionStore();
  
  const [successData, setSuccessData] = useState<SuccessData | null>(null);
  const [onboardingSteps, setOnboardingSteps] = useState<OnboardingStep[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<'CONFIRMATION' | 'ACCOUNT' | 'NEXT_STEPS' | 'SUPPORT'>('CONFIRMATION');
  const [isDownloadingPacket, setIsDownloadingPacket] = useState(false);

  const loadSuccessData = useCallback(async () => {
    try {
      setIsLoading(true);
      
      const [success, onboarding] = await Promise.all([
        SuccessService.getSuccessData(subscriptionId),
        SuccessService.getOnboardingSteps(`SPPG-${Date.now()}`)
      ]);
      
      setSuccessData(success);
      setOnboardingSteps(onboarding);
    } catch (error) {
      console.error('Error loading success data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [subscriptionId]);

  useEffect(() => {
    loadSuccessData();
    // Track success metrics
    SuccessService.trackSuccessMetrics(subscriptionId, 'SUCCESS_PAGE_VIEWED');
  }, [subscriptionId, loadSuccessData]);

  const handleDownloadWelcomePacket = async () => {
    if (!successData) return;
    
    try {
      setIsDownloadingPacket(true);
      const downloadUrl = await SuccessService.generateWelcomePacket(successData.sppgId);
      
      // Open download in new tab
      window.open(downloadUrl, '_blank');
    } catch (error) {
      console.error('Error downloading welcome packet:', error);
    } finally {
      setIsDownloadingPacket(false);
    }
  };

  const handleStartOnboarding = () => {
    if (successData?.account?.loginUrl) {
      // Track onboarding start
      SuccessService.trackSuccessMetrics(subscriptionId, 'ONBOARDING_STARTED');
      
      // Open login URL
      window.open(successData.account.loginUrl, '_blank');
    }
  };

  const handleContactSupport = (method: 'email' | 'phone' | 'whatsapp') => {
    if (!successData?.support) return;
    
    const { support } = successData;
    
    switch (method) {
      case 'email':
        window.open(`mailto:${support.email}`, '_blank');
        break;
      case 'phone':
        window.open(`tel:${support.phone}`, '_blank');
        break;
      case 'whatsapp':
        const message = encodeURIComponent(`Halo, saya membutuhkan bantuan untuk akun SPPG ${successData.sppgId}`);
        window.open(`https://wa.me/${support.whatsapp.replace(/\D/g, '')}?text=${message}`, '_blank');
        break;
    }
  };

  const getActivationStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'text-green-600 bg-green-100 border-green-200';
      case 'PENDING': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'FAILED': return 'text-red-600 bg-red-100 border-red-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getActivationStatusText = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'Aktif';
      case 'PENDING': return 'Menunggu Aktivasi';
      case 'FAILED': return 'Gagal Aktivasi';
      default: return 'Unknown';
    }
  };

  if (isLoading || !successData) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-gray-600">Memuat data aktivasi...</p>
        </div>
      </div>
    );
  }

  if (!successData) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl">✗</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Terjadi Kesalahan</h2>
          <p className="text-gray-600 mb-6">Tidak dapat memuat data aktivasi akun.</p>
          <button
            onClick={loadSuccessData}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Success Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="flex justify-center mb-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
            className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center"
          >
            <span className="text-white text-4xl">🎉</span>
          </motion.div>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Selamat! Pendaftaran Berhasil
        </h1>
        
        <p className="text-lg text-gray-600 mb-4">
          {successData.organizationName} telah terdaftar sebagai{' '}
          <span className="font-semibold text-blue-600">{successData.sppgId}</span>
        </p>
        
        <div className={`inline-flex items-center px-4 py-2 rounded-full border ${getActivationStatusColor(successData.activationStatus)}`}>
          <span className="text-sm font-medium">
            Status: {getActivationStatusText(successData.activationStatus)}
          </span>
        </div>
      </motion.div>

      {/* Navigation Tabs */}
      <div className="mb-8">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {[
            { id: 'CONFIRMATION', label: 'Konfirmasi', icon: '✅' },
            { id: 'ACCOUNT', label: 'Akun & Login', icon: '👤' },
            { id: 'NEXT_STEPS', label: 'Langkah Selanjutnya', icon: '📋' },
            { id: 'SUPPORT', label: 'Bantuan', icon: '💬' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as 'CONFIRMATION' | 'ACCOUNT' | 'NEXT_STEPS' | 'SUPPORT')}
              className={`
                flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-colors
                ${activeSection === tab.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
                }
              `}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content Sections */}
      <motion.div
        key={activeSection}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeSection === 'CONFIRMATION' && (
          <div className="space-y-6">
            {/* Subscription Details */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Detail Langganan</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-700 mb-3">Informasi Paket</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Paket:</span>
                      <span className="font-medium">{successData.packageName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Max Penerima:</span>
                      <span className="font-medium">{selectedPackage?.maxRecipients?.toLocaleString() || 'N/A'} orang</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Max Staff:</span>
                      <span className="font-medium">{selectedPackage?.maxStaff || 'N/A'} orang</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Titik Distribusi:</span>
                      <span className="font-medium">{selectedPackage?.maxDistributionPoints || 'N/A'} lokasi</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-700 mb-3">Informasi Pembayaran</h4>
                  {successData.invoice && (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Invoice:</span>
                        <span className="font-medium">{successData.invoice.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Jumlah:</span>
                        <span className="font-medium">{formatCurrency(successData.invoice.amount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Metode:</span>
                        <span className="font-medium">{successData.invoice.paymentMethod}</span>
                      </div>
                      {successData.invoice.paidAt && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Dibayar:</span>
                          <span className="font-medium">{formatDate(successData.invoice.paidAt)}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Welcome Packet Download */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-blue-900 mb-2">Paket Selamat Datang</h4>
                  <p className="text-blue-700 text-sm">
                    Download panduan lengkap, template dokumen, dan materi training untuk memulai operasional SPPG Anda.
                  </p>
                </div>
                <button
                  onClick={handleDownloadWelcomePacket}
                  disabled={isDownloadingPacket}
                  className={`
                    px-6 py-3 rounded-lg font-medium transition-colors
                    ${isDownloadingPacket
                      ? 'bg-blue-300 text-blue-700 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                    }
                  `}
                >
                  {isDownloadingPacket ? 'Mengunduh...' : 'Download Paket'}
                </button>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'ACCOUNT' && successData.account && (
          <div className="space-y-6">
            {/* Login Credentials */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Informasi Akun Administrator</h3>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <span className="text-yellow-500 text-xl">⚠️</span>
                  <div>
                    <h4 className="font-medium text-yellow-800 mb-1">Penting: Segera Ganti Password!</h4>
                    <p className="text-yellow-700 text-sm">
                      Untuk keamanan akun Anda, segera login dan ganti password temporary di bawah ini.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Admin:</label>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-mono text-sm">{successData.account.adminEmail}</span>
                      <button
                        onClick={() => navigator.clipboard.writeText(successData.account!.adminEmail)}
                        className="text-blue-600 hover:text-blue-700 text-sm"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password Temporary:</label>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-mono text-sm">{successData.account.tempPassword}</span>
                      <button
                        onClick={() => navigator.clipboard.writeText(successData.account!.tempPassword!)}
                        className="text-blue-600 hover:text-blue-700 text-sm"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">URL Login:</label>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <a
                        href={successData.account.loginUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 text-sm break-all"
                      >
                        {successData.account.loginUrl}
                      </a>
                    </div>
                  </div>

                  <button
                    onClick={handleStartOnboarding}
                    className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors"
                  >
                    🚀 Mulai Login & Setup
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Setup Guide */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Panduan Setup Cepat</h3>
              
              <div className="space-y-3">
                {[
                  '1. Klik tombol "Mulai Login & Setup" di atas',
                  '2. Login dengan email dan password temporary',
                  '3. Ganti password menjadi yang lebih aman',
                  '4. Lengkapi profil organisasi Anda',
                  '5. Undang anggota tim untuk bergabung',
                  '6. Mulai setup menu dan operasional harian'
                ].map((step, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-blue-600">{index + 1}</span>
                    </div>
                    <span className="text-gray-700">{step.substring(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeSection === 'NEXT_STEPS' && (
          <div className="space-y-6">
            {/* Immediate Action Items */}
            {successData.nextSteps && successData.nextSteps.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Action Items</h3>
                
                <div className="space-y-4">
                  {successData.nextSteps.map((step, index) => (
                    <div
                      key={index}
                      className={`
                        p-4 rounded-lg border
                        ${step.actionRequired
                          ? 'border-red-200 bg-red-50'
                          : 'border-gray-200 bg-gray-50'
                        }
                      `}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-medium text-gray-900">{step.title}</h4>
                            {step.actionRequired && (
                              <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                                Wajib
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{step.description}</p>
                          {step.dueDate && (
                            <p className="text-xs text-gray-500">
                              Deadline: {formatDate(step.dueDate)}
                            </p>
                          )}
                        </div>
                        
                        <div className="flex-shrink-0 ml-4">
                          {step.actionRequired ? (
                            <span className="text-red-500 text-xl">⚠️</span>
                          ) : (
                            <span className="text-blue-500 text-xl">ℹ️</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Onboarding Progress */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Proses Onboarding</h3>
              
              <div className="space-y-4">
                {onboardingSteps.map((step, index) => (
                  <div key={step.id} className="flex items-center space-x-4">
                    <div className={`
                      flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                      ${step.status === 'COMPLETED'
                        ? 'bg-green-500 text-white'
                        : step.status === 'IN_PROGRESS'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-600'
                      }
                    `}>
                      {step.status === 'COMPLETED' ? '✓' : index + 1}
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{step.title}</h4>
                      <p className="text-sm text-gray-600">{step.description}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-xs text-gray-500">
                          ~{step.estimatedTime} menit
                        </span>
                        <span className={`
                          text-xs px-2 py-1 rounded
                          ${step.category === 'SETUP' ? 'bg-blue-100 text-blue-600' :
                            step.category === 'CONFIGURATION' ? 'bg-purple-100 text-purple-600' :
                            step.category === 'TRAINING' ? 'bg-orange-100 text-orange-600' :
                            'bg-green-100 text-green-600'
                          }
                        `}>
                          {step.category}
                        </span>
                        {step.isOptional && (
                          <span className="text-xs text-gray-400">(Opsional)</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex-shrink-0">
                      {step.status === 'COMPLETED' && (
                        <span className="text-green-500">✅</span>
                      )}
                      {step.status === 'IN_PROGRESS' && (
                        <span className="text-blue-500">🔄</span>
                      )}
                      {step.status === 'PENDING' && (
                        <span className="text-gray-400">⏳</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">
                    Progress: {onboardingSteps.filter(s => s.status === 'COMPLETED').length} / {onboardingSteps.length}
                  </span>
                  <span className="text-gray-600">
                    Estimasi total: {onboardingSteps.reduce((acc, step) => acc + step.estimatedTime, 0)} menit
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'SUPPORT' && (
          <div className="space-y-6">
            {/* Contact Support */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Hubungi Tim Support</h3>
              
              {successData.support && (
                <div className="grid md:grid-cols-3 gap-4">
                  <button
                    onClick={() => handleContactSupport('email')}
                    className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-center"
                  >
                    <div className="text-2xl mb-2">📧</div>
                    <h4 className="font-medium text-gray-900 mb-1">Email Support</h4>
                    <p className="text-sm text-gray-600">{successData.support.email}</p>
                  </button>
                  
                  <button
                    onClick={() => handleContactSupport('phone')}
                    className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-center"
                  >
                    <div className="text-2xl mb-2">📞</div>
                    <h4 className="font-medium text-gray-900 mb-1">Telepon</h4>
                    <p className="text-sm text-gray-600">{successData.support.phone}</p>
                  </button>
                  
                  <button
                    onClick={() => handleContactSupport('whatsapp')}
                    className="p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors text-center"
                  >
                    <div className="text-2xl mb-2">💬</div>
                    <h4 className="font-medium text-gray-900 mb-1">WhatsApp</h4>
                    <p className="text-sm text-gray-600">{successData.support.whatsapp}</p>
                  </button>
                </div>
              )}
            </div>

            {/* Helpful Resources */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Sumber Daya Helpful</h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Panduan Pengguna',
                    description: 'Dokumentasi lengkap fitur platform',
                    icon: '📚',
                    link: '/docs/user-guide'
                  },
                  {
                    title: 'Video Tutorial',
                    description: 'Tutorial video step-by-step',
                    icon: '🎥',
                    link: '/docs/video-tutorials'
                  },
                  {
                    title: 'FAQ',
                    description: 'Pertanyaan yang sering diajukan',
                    icon: '❓',
                    link: '/docs/faq'
                  },
                  {
                    title: 'Best Practices',
                    description: 'Tips dan trik operasional SPPG',
                    icon: '💡',
                    link: '/docs/best-practices'
                  }
                ].map((resource, index) => (
                  <a
                    key={index}
                    href={resource.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                  >
                    <div className="flex items-start space-x-3">
                      <span className="text-2xl">{resource.icon}</span>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">{resource.title}</h4>
                        <p className="text-sm text-gray-600">{resource.description}</p>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Feedback */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Berikan Feedback</h3>
              <p className="text-blue-700 text-sm mb-4">
                Bantu kami meningkatkan pengalaman pendaftaran dengan memberikan feedback Anda.
              </p>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm transition-colors">
                Berikan Feedback
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Footer Actions */}
      <div className="mt-12 pt-6 border-t border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-center md:text-left">
            <p className="text-gray-600 text-sm">
              Terima kasih telah bergabung dengan SPPG Platform! 🎉
            </p>
            <p className="text-gray-500 text-xs mt-1">
              Subscription ID: {subscriptionId}
            </p>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={() => resetState()}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm transition-colors"
            >
              Daftar SPPG Lain
            </button>
            
            {successData.account?.loginUrl && (
              <button
                onClick={handleStartOnboarding}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-sm transition-colors"
              >
                Mulai Menggunakan Platform →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}