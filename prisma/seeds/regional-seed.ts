import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Sample Regional Data Indonesia (subset untuk testing)
const SAMPLE_PROVINCES = [
  { id: '11', name: 'Aceh', code: 'AC' },
  { id: '12', name: 'Sumatera Utara', code: 'SU' },
  { id: '13', name: 'Sumatera Barat', code: 'SB' },
  { id: '31', name: 'DKI Jakarta', code: 'JK' },
  { id: '32', name: 'Jawa Barat', code: 'JB' },
  { id: '33', name: 'Jawa Tengah', code: 'JT' },
  { id: '34', name: 'DI Yogyakarta', code: 'YO' },
  { id: '35', name: 'Jawa Timur', code: 'JI' },
  { id: '61', name: 'Kalimantan Barat', code: 'KB' },
  { id: '73', name: 'Sulawesi Selatan', code: 'SN' }
]

const SAMPLE_REGENCIES = [
  // DKI Jakarta
  { id: '3101', provinceId: '31', name: 'Jakarta Selatan', code: 'JS', type: 'KOTA' },
  { id: '3102', provinceId: '31', name: 'Jakarta Timur', code: 'JT', type: 'KOTA' },
  { id: '3103', provinceId: '31', name: 'Jakarta Pusat', code: 'JP', type: 'KOTA' },
  { id: '3104', provinceId: '31', name: 'Jakarta Barat', code: 'JB', type: 'KOTA' },
  { id: '3105', provinceId: '31', name: 'Jakarta Utara', code: 'JU', type: 'KOTA' },
  
  // Jawa Barat
  { id: '3201', provinceId: '32', name: 'Bogor', code: 'BGR', type: 'KABUPATEN' },
  { id: '3202', provinceId: '32', name: 'Sukabumi', code: 'SKB', type: 'KABUPATEN' },
  { id: '3273', provinceId: '32', name: 'Bandung', code: 'BDG', type: 'KOTA' },
  { id: '3276', provinceId: '32', name: 'Depok', code: 'DPK', type: 'KOTA' },
  
  // Jawa Tengah
  { id: '3301', provinceId: '33', name: 'Cilacap', code: 'CLP', type: 'KABUPATEN' },
  { id: '3371', provinceId: '33', name: 'Magelang', code: 'MGL', type: 'KOTA' },
  { id: '3372', provinceId: '33', name: 'Surakarta', code: 'SKA', type: 'KOTA' },
  { id: '3373', provinceId: '33', name: 'Salatiga', code: 'SLT', type: 'KOTA' },
  { id: '3374', provinceId: '33', name: 'Semarang', code: 'SMG', type: 'KOTA' },
  
  // Jawa Timur
  { id: '3501', provinceId: '35', name: 'Pacitan', code: 'PCT', type: 'KABUPATEN' },
  { id: '3571', provinceId: '35', name: 'Kediri', code: 'KDR', type: 'KOTA' },
  { id: '3572', provinceId: '35', name: 'Blitar', code: 'BLT', type: 'KOTA' },
  { id: '3573', provinceId: '35', name: 'Malang', code: 'MLG', type: 'KOTA' },
  { id: '3578', provinceId: '35', name: 'Surabaya', code: 'SBY', type: 'KOTA' }
]

const SAMPLE_DISTRICTS = [
  // Jakarta Selatan
  { id: '310101', regencyId: '3101', name: 'Jagakarsa', code: 'JGK' },
  { id: '310102', regencyId: '3101', name: 'Pasar Minggu', code: 'PSM' },
  { id: '310103', regencyId: '3101', name: 'Cilandak', code: 'CLD' },
  { id: '310104', regencyId: '3101', name: 'Pesanggrahan', code: 'PSG' },
  { id: '310105', regencyId: '3101', name: 'Kebayoran Lama', code: 'KBL' },
  
  // Bandung
  { id: '327301', regencyId: '3273', name: 'Sukasari', code: 'SKS' },
  { id: '327302', regencyId: '3273', name: 'Coblong', code: 'CBL' },
  { id: '327303', regencyId: '3273', name: 'Andir', code: 'ADR' },
  { id: '327304', regencyId: '3273', name: 'Cicendo', code: 'CCD' },
  { id: '327305', regencyId: '3273', name: 'Bandung Kulon', code: 'BKL' },
  
  // Surabaya
  { id: '357801', regencyId: '3578', name: 'Genteng', code: 'GTG' },
  { id: '357802', regencyId: '3578', name: 'Bubutan', code: 'BBT' },
  { id: '357803', regencyId: '3578', name: 'Simokerto', code: 'SMK' },
  { id: '357804', regencyId: '3578', name: 'Pabean Cantian', code: 'PBC' },
  { id: '357805', regencyId: '3578', name: 'Semampir', code: 'SMP' }
]

const SAMPLE_VILLAGES = [
  // Jagakarsa
  { id: '31010101', districtId: '310101', name: 'Jagakarsa', code: 'JGK001' },
  { id: '31010102', districtId: '310101', name: 'Tanjung Barat', code: 'JGK002' },
  { id: '31010103', districtId: '310101', name: 'Lenteng Agung', code: 'JGK003' },
  
  // Sukasari
  { id: '32730101', districtId: '327301', name: 'Geger Kalong', code: 'SKS001' },
  { id: '32730102', districtId: '327301', name: 'Isola', code: 'SKS002' },
  { id: '32730103', districtId: '327301', name: 'Sarijadi', code: 'SKS003' },
  
  // Genteng
  { id: '35780101', districtId: '357801', name: 'Genteng', code: 'GTG001' },
  { id: '35780102', districtId: '357801', name: 'Peneleh', code: 'GTG002' },
  { id: '35780103', districtId: '357801', name: 'Kapasari', code: 'GTG003' }
]

// Default Notification Templates
const NOTIFICATION_TEMPLATES = [
  {
    name: 'stock_low_warning',
    title: '⚠️ Stok Bahan Menipis',
    content: 'Stok bahan {{ingredient_name}} tinggal {{current_stock}} {{unit}}. Segera lakukan pengadaan.',
    type: 'WARNING',
    variables: ['ingredient_name', 'current_stock', 'unit']
  },
  {
    name: 'procurement_approval_needed',
    title: '📋 Pengadaan Menunggu Persetujuan',
    content: 'Pengadaan #{{procurement_number}} senilai Rp {{amount}} menunggu persetujuan Anda.',
    type: 'INFO',
    variables: ['procurement_number', 'amount']
  },
  {
    name: 'production_completed',
    title: '✅ Produksi Selesai',
    content: 'Produksi {{menu_name}} untuk {{date}} telah selesai. Total: {{quantity}} porsi.',
    type: 'SUCCESS',
    variables: ['menu_name', 'date', 'quantity']
  },
  {
    name: 'distribution_delay',
    title: '🚛 Keterlambatan Distribusi',
    content: 'Distribusi ke {{distribution_point}} mengalami keterlambatan. Estimasi: {{new_time}}.',
    type: 'WARNING',
    variables: ['distribution_point', 'new_time']
  },
  {
    name: 'subscription_expiring',
    title: '💳 Langganan Akan Berakhir',
    content: 'Langganan {{tier}} Anda akan berakhir pada {{expiry_date}}. Perpanjang sekarang.',
    type: 'REMINDER',
    variables: ['tier', 'expiry_date']
  },
  {
    name: 'daily_report_reminder',
    title: '📊 Pengingat Laporan Harian',
    content: 'Jangan lupa lengkapi laporan harian untuk tanggal {{date}}.',
    type: 'REMINDER',
    variables: ['date']
  },
  {
    name: 'new_feedback_received',
    title: '💬 Feedback Baru Diterima',
    content: 'Feedback baru dari {{distribution_point}} dengan rating {{rating}}/5.',
    type: 'INFO',
    variables: ['distribution_point', 'rating']
  },
  {
    name: 'staff_absent_alert',
    title: '👥 Peringatan Ketidakhadiran',
    content: '{{staff_count}} staff tidak hadir hari ini. Pastikan operasional tetap berjalan.',
    type: 'WARNING',
    variables: ['staff_count']
  }
]

export async function seedRegionalData() {
  console.log('🗺️ Seeding Regional Data...')

  // 1. Seed Provinces
  console.log('  Creating provinces...')
  for (const province of SAMPLE_PROVINCES) {
    await prisma.province.upsert({
      where: { id: province.id },
      update: {},
      create: province
    })
  }

  // 2. Seed Regencies
  console.log('  Creating regencies...')
  for (const regency of SAMPLE_REGENCIES) {
    await prisma.regency.upsert({
      where: { id: regency.id },
      update: {},
      create: regency
    })
  }

  // 3. Seed Districts
  console.log('  Creating districts...')
  for (const district of SAMPLE_DISTRICTS) {
    await prisma.district.upsert({
      where: { id: district.id },
      update: {},
      create: district
    })
  }

  // 4. Seed Villages
  console.log('  Creating villages...')
  for (const village of SAMPLE_VILLAGES) {
    await prisma.village.upsert({
      where: { id: village.id },
      update: {},
      create: village
    })
  }

  console.log('✅ Regional data seeded successfully!')
}

export async function seedNotificationTemplates() {
  console.log('📧 Seeding Notification Templates...')

  for (const template of NOTIFICATION_TEMPLATES) {
    await prisma.notificationTemplate.upsert({
      where: { name: template.name },
      update: {},
      create: {
        name: template.name,
        title: template.title,
        content: template.content,
        type: template.type as 'INFO' | 'WARNING' | 'SUCCESS' | 'REMINDER',
        variables: template.variables,
        isActive: true
      }
    })
  }

  console.log('✅ Notification templates seeded successfully!')
}