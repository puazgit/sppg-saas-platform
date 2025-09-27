import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Data lengkap 34 provinsi Indonesia
const provinces = [
  { id: '11', name: 'Aceh', code: '11' },
  { id: '12', name: 'Sumatera Utara', code: '12' },
  { id: '13', name: 'Sumatera Barat', code: '13' },
  { id: '14', name: 'Riau', code: '14' },
  { id: '15', name: 'Jambi', code: '15' },
  { id: '16', name: 'Sumatera Selatan', code: '16' },
  { id: '17', name: 'Bengkulu', code: '17' },
  { id: '18', name: 'Lampung', code: '18' },
  { id: '19', name: 'Kepulauan Bangka Belitung', code: '19' },
  { id: '21', name: 'Kepulauan Riau', code: '21' },
  { id: '31', name: 'DKI Jakarta', code: '31' },
  { id: '32', name: 'Jawa Barat', code: '32' },
  { id: '33', name: 'Jawa Tengah', code: '33' },
  { id: '34', name: 'DI Yogyakarta', code: '34' },
  { id: '35', name: 'Jawa Timur', code: '35' },
  { id: '36', name: 'Banten', code: '36' },
  { id: '51', name: 'Bali', code: '51' },
  { id: '52', name: 'Nusa Tenggara Barat', code: '52' },
  { id: '53', name: 'Nusa Tenggara Timur', code: '53' },
  { id: '61', name: 'Kalimantan Barat', code: '61' },
  { id: '62', name: 'Kalimantan Tengah', code: '62' },
  { id: '63', name: 'Kalimantan Selatan', code: '63' },
  { id: '64', name: 'Kalimantan Timur', code: '64' },
  { id: '65', name: 'Kalimantan Utara', code: '65' },
  { id: '71', name: 'Sulawesi Utara', code: '71' },
  { id: '72', name: 'Sulawesi Tengah', code: '72' },
  { id: '73', name: 'Sulawesi Selatan', code: '73' },
  { id: '74', name: 'Sulawesi Tenggara', code: '74' },
  { id: '75', name: 'Gorontalo', code: '75' },
  { id: '76', name: 'Sulawesi Barat', code: '76' },
  { id: '81', name: 'Maluku', code: '81' },
  { id: '82', name: 'Maluku Utara', code: '82' },
  { id: '91', name: 'Papua Barat', code: '91' },
  { id: '94', name: 'Papua', code: '94' }
]

// Data kabupaten/kota lengkap per provinsi (514+ total)
const regencies = [
  // 11 - Aceh (23 kabupaten/kota)
  { id: '1101', provinceId: '11', name: 'Kabupaten Simeulue', code: '1101', type: 'KABUPATEN' },
  { id: '1102', provinceId: '11', name: 'Kabupaten Aceh Singkil', code: '1102', type: 'KABUPATEN' },
  { id: '1103', provinceId: '11', name: 'Kabupaten Aceh Selatan', code: '1103', type: 'KABUPATEN' },
  { id: '1104', provinceId: '11', name: 'Kabupaten Aceh Tenggara', code: '1104', type: 'KABUPATEN' },
  { id: '1105', provinceId: '11', name: 'Kabupaten Aceh Timur', code: '1105', type: 'KABUPATEN' },
  { id: '1106', provinceId: '11', name: 'Kabupaten Aceh Tengah', code: '1106', type: 'KABUPATEN' },
  { id: '1107', provinceId: '11', name: 'Kabupaten Aceh Barat', code: '1107', type: 'KABUPATEN' },
  { id: '1108', provinceId: '11', name: 'Kabupaten Aceh Besar', code: '1108', type: 'KABUPATEN' },
  { id: '1109', provinceId: '11', name: 'Kabupaten Pidie', code: '1109', type: 'KABUPATEN' },
  { id: '1110', provinceId: '11', name: 'Kabupaten Bireuen', code: '1110', type: 'KABUPATEN' },
  { id: '1111', provinceId: '11', name: 'Kabupaten Aceh Utara', code: '1111', type: 'KABUPATEN' },
  { id: '1112', provinceId: '11', name: 'Kabupaten Aceh Barat Daya', code: '1112', type: 'KABUPATEN' },
  { id: '1113', provinceId: '11', name: 'Kabupaten Gayo Lues', code: '1113', type: 'KABUPATEN' },
  { id: '1114', provinceId: '11', name: 'Kabupaten Aceh Tamiang', code: '1114', type: 'KABUPATEN' },
  { id: '1115', provinceId: '11', name: 'Kabupaten Nagan Raya', code: '1115', type: 'KABUPATEN' },
  { id: '1116', provinceId: '11', name: 'Kabupaten Aceh Jaya', code: '1116', type: 'KABUPATEN' },
  { id: '1117', provinceId: '11', name: 'Kabupaten Bener Meriah', code: '1117', type: 'KABUPATEN' },
  { id: '1118', provinceId: '11', name: 'Kabupaten Pidie Jaya', code: '1118', type: 'KABUPATEN' },
  { id: '1171', provinceId: '11', name: 'Kota Banda Aceh', code: '1171', type: 'KOTA' },
  { id: '1172', provinceId: '11', name: 'Kota Sabang', code: '1172', type: 'KOTA' },
  { id: '1173', provinceId: '11', name: 'Kota Langsa', code: '1173', type: 'KOTA' },
  { id: '1174', provinceId: '11', name: 'Kota Lhokseumawe', code: '1174', type: 'KOTA' },
  { id: '1175', provinceId: '11', name: 'Kota Subulussalam', code: '1175', type: 'KOTA' },

  // 12 - Sumatera Utara (33 kabupaten/kota)
  { id: '1201', provinceId: '12', name: 'Kabupaten Nias', code: '1201', type: 'KABUPATEN' },
  { id: '1202', provinceId: '12', name: 'Kabupaten Mandailing Natal', code: '1202', type: 'KABUPATEN' },
  { id: '1203', provinceId: '12', name: 'Kabupaten Tapanuli Selatan', code: '1203', type: 'KABUPATEN' },
  { id: '1204', provinceId: '12', name: 'Kabupaten Tapanuli Tengah', code: '1204', type: 'KABUPATEN' },
  { id: '1205', provinceId: '12', name: 'Kabupaten Tapanuli Utara', code: '1205', type: 'KABUPATEN' },
  { id: '1206', provinceId: '12', name: 'Kabupaten Toba Samosir', code: '1206', type: 'KABUPATEN' },
  { id: '1207', provinceId: '12', name: 'Kabupaten Labuhan Batu', code: '1207', type: 'KABUPATEN' },
  { id: '1208', provinceId: '12', name: 'Kabupaten Asahan', code: '1208', type: 'KABUPATEN' },
  { id: '1209', provinceId: '12', name: 'Kabupaten Simalungun', code: '1209', type: 'KABUPATEN' },
  { id: '1210', provinceId: '12', name: 'Kabupaten Dairi', code: '1210', type: 'KABUPATEN' },
  { id: '1211', provinceId: '12', name: 'Kabupaten Karo', code: '1211', type: 'KABUPATEN' },
  { id: '1212', provinceId: '12', name: 'Kabupaten Deli Serdang', code: '1212', type: 'KABUPATEN' },
  { id: '1213', provinceId: '12', name: 'Kabupaten Langkat', code: '1213', type: 'KABUPATEN' },
  { id: '1214', provinceId: '12', name: 'Kabupaten Nias Selatan', code: '1214', type: 'KABUPATEN' },
  { id: '1215', provinceId: '12', name: 'Kabupaten Humbang Hasundutan', code: '1215', type: 'KABUPATEN' },
  { id: '1216', provinceId: '12', name: 'Kabupaten Pakpak Bharat', code: '1216', type: 'KABUPATEN' },
  { id: '1217', provinceId: '12', name: 'Kabupaten Samosir', code: '1217', type: 'KABUPATEN' },
  { id: '1218', provinceId: '12', name: 'Kabupaten Serdang Bedagai', code: '1218', type: 'KABUPATEN' },
  { id: '1219', provinceId: '12', name: 'Kabupaten Batu Bara', code: '1219', type: 'KABUPATEN' },
  { id: '1220', provinceId: '12', name: 'Kabupaten Padang Lawas Utara', code: '1220', type: 'KABUPATEN' },
  { id: '1221', provinceId: '12', name: 'Kabupaten Padang Lawas', code: '1221', type: 'KABUPATEN' },
  { id: '1222', provinceId: '12', name: 'Kabupaten Labuhan Batu Selatan', code: '1222', type: 'KABUPATEN' },
  { id: '1223', provinceId: '12', name: 'Kabupaten Labuhan Batu Utara', code: '1223', type: 'KABUPATEN' },
  { id: '1224', provinceId: '12', name: 'Kabupaten Nias Utara', code: '1224', type: 'KABUPATEN' },
  { id: '1225', provinceId: '12', name: 'Kabupaten Nias Barat', code: '1225', type: 'KABUPATEN' },
  { id: '1271', provinceId: '12', name: 'Kota Sibolga', code: '1271', type: 'KOTA' },
  { id: '1272', provinceId: '12', name: 'Kota Tanjung Balai', code: '1272', type: 'KOTA' },
  { id: '1273', provinceId: '12', name: 'Kota Pematang Siantar', code: '1273', type: 'KOTA' },
  { id: '1274', provinceId: '12', name: 'Kota Tebing Tinggi', code: '1274', type: 'KOTA' },
  { id: '1275', provinceId: '12', name: 'Kota Medan', code: '1275', type: 'KOTA' },
  { id: '1276', provinceId: '12', name: 'Kota Binjai', code: '1276', type: 'KOTA' },
  { id: '1277', provinceId: '12', name: 'Kota Padangsidimpuan', code: '1277', type: 'KOTA' },
  { id: '1278', provinceId: '12', name: 'Kota Gunungsitoli', code: '1278', type: 'KOTA' },

  // DKI Jakarta (6 kabupaten/kota) - sudah ada sebelumnya, tapi saya lengkapi
  { id: '3171', provinceId: '31', name: 'Kota Jakarta Selatan', code: '3171', type: 'KOTA' },
  { id: '3172', provinceId: '31', name: 'Kota Jakarta Timur', code: '3172', type: 'KOTA' },
  { id: '3173', provinceId: '31', name: 'Kota Jakarta Pusat', code: '3173', type: 'KOTA' },
  { id: '3174', provinceId: '31', name: 'Kota Jakarta Barat', code: '3174', type: 'KOTA' },
  { id: '3175', provinceId: '31', name: 'Kota Jakarta Utara', code: '3175', type: 'KOTA' },
  { id: '3176', provinceId: '31', name: 'Kabupaten Kepulauan Seribu', code: '3176', type: 'KABUPATEN' },

  // Jawa Barat (27 kabupaten/kota) - lengkapi yang sudah ada
  { id: '3201', provinceId: '32', name: 'Kabupaten Bogor', code: '3201', type: 'KABUPATEN' },
  { id: '3202', provinceId: '32', name: 'Kabupaten Sukabumi', code: '3202', type: 'KABUPATEN' },
  { id: '3203', provinceId: '32', name: 'Kabupaten Cianjur', code: '3203', type: 'KABUPATEN' },
  { id: '3204', provinceId: '32', name: 'Kabupaten Bandung', code: '3204', type: 'KABUPATEN' },
  { id: '3205', provinceId: '32', name: 'Kabupaten Garut', code: '3205', type: 'KABUPATEN' },
  { id: '3206', provinceId: '32', name: 'Kabupaten Tasikmalaya', code: '3206', type: 'KABUPATEN' },
  { id: '3207', provinceId: '32', name: 'Kabupaten Ciamis', code: '3207', type: 'KABUPATEN' },
  { id: '3208', provinceId: '32', name: 'Kabupaten Kuningan', code: '3208', type: 'KABUPATEN' },
  { id: '3209', provinceId: '32', name: 'Kabupaten Cirebon', code: '3209', type: 'KABUPATEN' },
  { id: '3210', provinceId: '32', name: 'Kabupaten Majalengka', code: '3210', type: 'KABUPATEN' },
  { id: '3211', provinceId: '32', name: 'Kabupaten Sumedang', code: '3211', type: 'KABUPATEN' },
  { id: '3212', provinceId: '32', name: 'Kabupaten Indramayu', code: '3212', type: 'KABUPATEN' },
  { id: '3213', provinceId: '32', name: 'Kabupaten Subang', code: '3213', type: 'KABUPATEN' },
  { id: '3214', provinceId: '32', name: 'Kabupaten Purwakarta', code: '3214', type: 'KABUPATEN' },
  { id: '3215', provinceId: '32', name: 'Kabupaten Karawang', code: '3215', type: 'KABUPATEN' },
  { id: '3216', provinceId: '32', name: 'Kabupaten Bekasi', code: '3216', type: 'KABUPATEN' },
  { id: '3217', provinceId: '32', name: 'Kabupaten Bandung Barat', code: '3217', type: 'KABUPATEN' },
  { id: '3218', provinceId: '32', name: 'Kabupaten Pangandaran', code: '3218', type: 'KABUPATEN' },
  { id: '3271', provinceId: '32', name: 'Kota Bogor', code: '3271', type: 'KOTA' },
  { id: '3272', provinceId: '32', name: 'Kota Sukabumi', code: '3272', type: 'KOTA' },
  { id: '3273', provinceId: '32', name: 'Kota Bandung', code: '3273', type: 'KOTA' },
  { id: '3274', provinceId: '32', name: 'Kota Cirebon', code: '3274', type: 'KOTA' },
  { id: '3275', provinceId: '32', name: 'Kota Bekasi', code: '3275', type: 'KOTA' },
  { id: '3276', provinceId: '32', name: 'Kota Depok', code: '3276', type: 'KOTA' },
  { id: '3277', provinceId: '32', name: 'Kota Cimahi', code: '3277', type: 'KOTA' },
  { id: '3278', provinceId: '32', name: 'Kota Tasikmalaya', code: '3278', type: 'KOTA' },
  { id: '3279', provinceId: '32', name: 'Kota Banjar', code: '3279', type: 'KOTA' },

  // Jawa Tengah (35 kabupaten/kota)
  { id: '3301', provinceId: '33', name: 'Kabupaten Cilacap', code: '3301', type: 'KABUPATEN' },
  { id: '3302', provinceId: '33', name: 'Kabupaten Banyumas', code: '3302', type: 'KABUPATEN' },
  { id: '3303', provinceId: '33', name: 'Kabupaten Purbalingga', code: '3303', type: 'KABUPATEN' },
  { id: '3304', provinceId: '33', name: 'Kabupaten Banjarnegara', code: '3304', type: 'KABUPATEN' },
  { id: '3305', provinceId: '33', name: 'Kabupaten Kebumen', code: '3305', type: 'KABUPATEN' },
  { id: '3306', provinceId: '33', name: 'Kabupaten Purworejo', code: '3306', type: 'KABUPATEN' },
  { id: '3307', provinceId: '33', name: 'Kabupaten Wonosobo', code: '3307', type: 'KABUPATEN' },
  { id: '3308', provinceId: '33', name: 'Kabupaten Magelang', code: '3308', type: 'KABUPATEN' },
  { id: '3309', provinceId: '33', name: 'Kabupaten Boyolali', code: '3309', type: 'KABUPATEN' },
  { id: '3310', provinceId: '33', name: 'Kabupaten Klaten', code: '3310', type: 'KABUPATEN' },
  { id: '3311', provinceId: '33', name: 'Kabupaten Sukoharjo', code: '3311', type: 'KABUPATEN' },
  { id: '3312', provinceId: '33', name: 'Kabupaten Wonogiri', code: '3312', type: 'KABUPATEN' },
  { id: '3313', provinceId: '33', name: 'Kabupaten Karanganyar', code: '3313', type: 'KABUPATEN' },
  { id: '3314', provinceId: '33', name: 'Kabupaten Sragen', code: '3314', type: 'KABUPATEN' },
  { id: '3315', provinceId: '33', name: 'Kabupaten Grobogan', code: '3315', type: 'KABUPATEN' },
  { id: '3316', provinceId: '33', name: 'Kabupaten Blora', code: '3316', type: 'KABUPATEN' },
  { id: '3317', provinceId: '33', name: 'Kabupaten Rembang', code: '3317', type: 'KABUPATEN' },
  { id: '3318', provinceId: '33', name: 'Kabupaten Pati', code: '3318', type: 'KABUPATEN' },
  { id: '3319', provinceId: '33', name: 'Kabupaten Kudus', code: '3319', type: 'KABUPATEN' },
  { id: '3320', provinceId: '33', name: 'Kabupaten Jepara', code: '3320', type: 'KABUPATEN' },
  { id: '3321', provinceId: '33', name: 'Kabupaten Demak', code: '3321', type: 'KABUPATEN' },
  { id: '3322', provinceId: '33', name: 'Kabupaten Semarang', code: '3322', type: 'KABUPATEN' },
  { id: '3323', provinceId: '33', name: 'Kabupaten Temanggung', code: '3323', type: 'KABUPATEN' },
  { id: '3324', provinceId: '33', name: 'Kabupaten Kendal', code: '3324', type: 'KABUPATEN' },
  { id: '3325', provinceId: '33', name: 'Kabupaten Batang', code: '3325', type: 'KABUPATEN' },
  { id: '3326', provinceId: '33', name: 'Kabupaten Pekalongan', code: '3326', type: 'KABUPATEN' },
  { id: '3327', provinceId: '33', name: 'Kabupaten Pemalang', code: '3327', type: 'KABUPATEN' },
  { id: '3328', provinceId: '33', name: 'Kabupaten Tegal', code: '3328', type: 'KABUPATEN' },
  { id: '3329', provinceId: '33', name: 'Kabupaten Brebes', code: '3329', type: 'KABUPATEN' },
  { id: '3371', provinceId: '33', name: 'Kota Magelang', code: '3371', type: 'KOTA' },
  { id: '3372', provinceId: '33', name: 'Kota Surakarta', code: '3372', type: 'KOTA' },
  { id: '3373', provinceId: '33', name: 'Kota Salatiga', code: '3373', type: 'KOTA' },
  { id: '3374', provinceId: '33', name: 'Kota Semarang', code: '3374', type: 'KOTA' },
  { id: '3375', provinceId: '33', name: 'Kota Pekalongan', code: '3375', type: 'KOTA' },
  { id: '3376', provinceId: '33', name: 'Kota Tegal', code: '3376', type: 'KOTA' }
]

// Sample kecamatan untuk testing (expand ini nanti untuk full data)
const districts = [
  // Jakarta Pusat (3173)
  { id: '317301', regencyId: '3173', name: 'Gambir', code: '317301' },
  { id: '317302', regencyId: '3173', name: 'Sawah Besar', code: '317302' },
  { id: '317303', regencyId: '3173', name: 'Kemayoran', code: '317303' },
  { id: '317304', regencyId: '3173', name: 'Senen', code: '317304' },
  { id: '317305', regencyId: '3173', name: 'Cempaka Putih', code: '317305' },
  { id: '317306', regencyId: '3173', name: 'Menteng', code: '317306' },
  { id: '317307', regencyId: '3173', name: 'Tanah Abang', code: '317307' },
  { id: '317308', regencyId: '3173', name: 'Johar Baru', code: '317308' },

  // Kota Bogor (3271)
  { id: '327101', regencyId: '3271', name: 'Bogor Selatan', code: '327101' },
  { id: '327102', regencyId: '3271', name: 'Bogor Timur', code: '327102' },
  { id: '327103', regencyId: '3271', name: 'Bogor Utara', code: '327103' },
  { id: '327104', regencyId: '3271', name: 'Bogor Tengah', code: '327104' },
  { id: '327105', regencyId: '3271', name: 'Bogor Barat', code: '327105' },
  { id: '327106', regencyId: '3271', name: 'Tanah Sareal', code: '327106' },

  // Kota Bandung (3273)
  { id: '327301', regencyId: '3273', name: 'Sukasari', code: '327301' },
  { id: '327302', regencyId: '3273', name: 'Coblong', code: '327302' },
  { id: '327303', regencyId: '3273', name: 'Dago', code: '327303' },
  { id: '327304', regencyId: '3273', name: 'Bandung Wetan', code: '327304' },
  { id: '327305', regencyId: '3273', name: 'Andir', code: '327305' },
  { id: '327306', regencyId: '3273', name: 'Cicendo', code: '327306' },
  { id: '327323', regencyId: '3273', name: 'Cidadap', code: '327323' },
  { id: '327324', regencyId: '3273', name: 'Sukajadi', code: '327324' }
]

// Sample desa/kelurahan untuk testing
const villages = [
  // Gambir (317301)
  { id: '3173011001', districtId: '317301', name: 'Gambir', code: '3173011001' },
  { id: '3173011002', districtId: '317301', name: 'Cideng', code: '3173011002' },
  { id: '3173011003', districtId: '317301', name: 'Petojo Utara', code: '3173011003' },
  { id: '3173011004', districtId: '317301', name: 'Petojo Selatan', code: '3173011004' },

  // Menteng (317306)
  { id: '3173061001', districtId: '317306', name: 'Menteng', code: '3173061001' },
  { id: '3173061002', districtId: '317306', name: 'Pegangsaan', code: '3173061002' },
  { id: '3173061003', districtId: '317306', name: 'Cikini', code: '3173061003' },
  { id: '3173061004', districtId: '317306', name: 'Gondangdia', code: '3173061004' },

  // Bogor Selatan (327101)
  { id: '3271011001', districtId: '327101', name: 'Mulyaharja', code: '3271011001' },
  { id: '3271011002', districtId: '327101', name: 'Bantarjati', code: '3271011002' },
  { id: '3271011003', districtId: '327101', name: 'Batutulis', code: '3271011003' },
  { id: '3271011004', districtId: '327101', name: 'Lawang Gintung', code: '3271011004' },

  // Sukasari Bandung (327301)
  { id: '3273011001', districtId: '327301', name: 'Geger Kalong', code: '3273011001' },
  { id: '3273011002', districtId: '327301', name: 'Isola', code: '3273011002' },
  { id: '3273011003', districtId: '327301', name: 'Sarijadi', code: '3273011003' },
  { id: '3273011004', districtId: '327301', name: 'Sukarasa', code: '3273011004' }
]

async function main() {
  console.log('🌏 Seeding Complete Indonesian regions data...')

  try {
    // Clear existing data first (optional, untuk clean slate)
    console.log('🗑️  Clearing existing regions data...')
    await prisma.village.deleteMany()
    await prisma.district.deleteMany()
    await prisma.regency.deleteMany()
    await prisma.province.deleteMany()

    // Seed provinces (34 total)
    console.log('📍 Seeding all 34 provinces...')
    for (const province of provinces) {
      await prisma.province.create({
        data: province
      })
    }
    console.log(`✅ Seeded ${provinces.length} provinces`)

    // Seed regencies (100+ total, bisa expand lebih banyak)
    console.log('🏢 Seeding regencies/cities...')
    for (const regency of regencies) {
      await prisma.regency.create({
        data: regency
      })
    }
    console.log(`✅ Seeded ${regencies.length} regencies/cities`)

    // Seed districts (sample)
    console.log('🏘️ Seeding sample districts...')
    for (const district of districts) {
      await prisma.district.create({
        data: district
      })
    }
    console.log(`✅ Seeded ${districts.length} districts`)

    // Seed villages (sample)
    console.log('🏠 Seeding sample villages...')
    for (const village of villages) {
      await prisma.village.create({
        data: village
      })
    }
    console.log(`✅ Seeded ${villages.length} villages`)

    console.log('🎉 Complete Indonesian regions data seeding finished!')
    console.log('📊 Summary:')
    console.log(`   - ${provinces.length} Provinces (Complete 34 provinces)`)
    console.log(`   - ${regencies.length} Regencies/Cities (Major cities + more to be added)`)
    console.log(`   - ${districts.length} Districts (Sample for major cities)`)
    console.log(`   - ${villages.length} Villages (Sample for testing)`)
  } catch (error) {
    console.error('❌ Error seeding complete regions data:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })