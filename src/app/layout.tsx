import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from '@/providers/providers'
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SPPG SaaS Platform",
  description: "Platform SaaS untuk manajemen SPPG (Satuan Pelayanan Gizi Gratis)",
};

/**
 * Root Layout - Global Application Wrapper
 * 
 * Layout ini hanya menyediakan:
 * - HTML struktur dasar
 * - Font loading (Geist Sans & Mono)
 * - Global providers (Themes, TanStack Query, etc.)
 * - Global CSS
 * 
 * Tidak termasuk navigation/footer karena setiap route group memiliki layout sendiri:
 * - Root (/) → Marketing layout dengan NavigationHeader + Footer
 * - /sppg → SPPG dashboard layout dengan sidebar
 * - /superadmin → SuperAdmin layout dengan admin navigation
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
