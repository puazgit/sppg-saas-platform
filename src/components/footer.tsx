import Link from 'next/link'
import { ChefHat, Mail, Phone, MapPin } from 'lucide-react'

export function Footer() {
  const footerNavigation = {
    produk: [
      { name: 'Fitur Lengkap', href: '/#features' },
      { name: 'Harga & Paket', href: '/#pricing' },
      { name: 'Demo Gratis', href: '/#contact' },
      { name: 'Integrasi API', href: '/#features' }, // Redirect to features section
    ],
    perusahaan: [
      { name: 'Tentang Kami', href: '/#home' }, // Redirect to hero section
      { name: 'Blog', href: '/#case-studies' }, // Redirect to case studies
      { name: 'Karir', href: '/#contact' }, // Redirect to contact for career inquiries
      { name: 'Kontak', href: '/#contact' },
    ],
    dukungan: [
      { name: 'Dokumentasi', href: '/#features' }, // Redirect to features section
      { name: 'Panduan', href: '/#roi-calculator' }, // Redirect to ROI calculator
      { name: 'Status Sistem', href: '/#home' }, // Redirect to hero section
      { name: 'Support', href: '/#contact' }, // Direct to contact form
    ],
    legal: [
      { name: 'Kebijakan Privasi', href: '/#contact' }, // Contact for privacy inquiries
      { name: 'Syarat Layanan', href: '/#contact' }, // Contact for terms inquiries
      { name: 'Keamanan', href: '/#features' }, // Redirect to features for security info
    ],
  }

  return (
    <footer className="bg-gray-900 dark:bg-gray-950" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="mx-auto max-w-7xl px-6 pb-8 pt-16 sm:pt-24 lg:px-8 lg:pt-32">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          {/* Company Info */}
          <div className="space-y-8">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                <ChefHat className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-xl font-bold text-white">SPPG Platform</div>
                <div className="text-sm text-gray-400">Sistem Manajemen Gizi</div>
              </div>
            </div>
            <p className="text-sm leading-6 text-gray-300">
              Platform SaaS terdepan untuk manajemen Satuan Pelayanan Gizi Gratis (SPPG). 
              Tingkatkan efisiensi operasional dan kualitas layanan gizi dengan teknologi modern.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-3 text-sm text-gray-300">
                <Mail className="h-4 w-4" />
                <span>hello@sppg-platform.com</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-300">
                <Phone className="h-4 w-4" />
                <span>+62 21 1234 5678</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-300">
                <MapPin className="h-4 w-4" />
                <span>Jakarta Selatan, Indonesia</span>
              </div>
            </div>
          </div>
          
          {/* Navigation Links */}
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-white">Produk</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {footerNavigation.produk.map((item) => (
                    <li key={item.name}>
                      <Link href={item.href} className="text-sm leading-6 text-gray-300 hover:text-white transition-colors">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-white">Perusahaan</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {footerNavigation.perusahaan.map((item) => (
                    <li key={item.name}>
                      <Link href={item.href} className="text-sm leading-6 text-gray-300 hover:text-white transition-colors">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-white">Dukungan</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {footerNavigation.dukungan.map((item) => (
                    <li key={item.name}>
                      <Link href={item.href} className="text-sm leading-6 text-gray-300 hover:text-white transition-colors">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-white">Legal</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {footerNavigation.legal.map((item) => (
                    <li key={item.name}>
                      <Link href={item.href} className="text-sm leading-6 text-gray-300 hover:text-white transition-colors">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="mt-16 border-t border-white/10 pt-8 sm:mt-20 lg:mt-24">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <p className="text-xs leading-5 text-gray-400">
              &copy; 2025 SPPG Platform. Hak cipta dilindungi undang-undang.
            </p>
            <div className="mt-4 md:mt-0">
              <p className="text-xs leading-5 text-gray-400">
                Dibuat dengan ❤️ untuk SPPG Indonesia
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}