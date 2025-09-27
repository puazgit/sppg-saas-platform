import { NavigationHeader } from '@/components/navigation-header'
import { Footer } from '@/components/footer'
import { Toaster } from '@/components/ui/sonner'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'SPPG SaaS Platform - Sistem Manajemen SPPG Terdepan',
  description: 'Platform SaaS untuk manajemen SPPG (Satuan Pelayanan Gizi Gratis) dengan fitur lengkap menu planning, inventory, dan reporting.',
  keywords: 'SPPG, SaaS, manajemen gizi, menu planning, inventory management',
}

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <NavigationHeader />
      <div className="pt-20">
        {children}
      </div>
      <Footer />
      <Toaster position="top-right" />
    </>
  )
}