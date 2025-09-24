-- CreateEnum
CREATE TYPE "public"."StatusSPPG" AS ENUM ('MENUNGGU_PERSETUJUAN', 'AKTIF', 'DITANGGUHKAN', 'DIHENTIKAN', 'NONAKTIF');

-- CreateEnum
CREATE TYPE "public"."StatusLangganan" AS ENUM ('UJI_COBA', 'AKTIF', 'TERLAMBAT_BAYAR', 'DIBATALKAN', 'DIJEDA', 'UPGRADE_PENDING');

-- CreateEnum
CREATE TYPE "public"."TierLangganan" AS ENUM ('BASIC', 'STANDARD', 'PRO', 'ENTERPRISE');

-- CreateEnum
CREATE TYPE "public"."StatusPembayaran" AS ENUM ('MENUNGGU', 'DIPROSES', 'BERHASIL', 'GAGAL', 'DIBATALKAN', 'DIKEMBALIKAN', 'REFUND');

-- CreateEnum
CREATE TYPE "public"."JenisKelamin" AS ENUM ('LAKI_LAKI', 'PEREMPUAN');

-- CreateEnum
CREATE TYPE "public"."StatusStaf" AS ENUM ('AKTIF', 'TIDAK_AKTIF', 'DIHENTIKAN', 'CUTI', 'SAKIT');

-- CreateEnum
CREATE TYPE "public"."PeranStaf" AS ENUM ('MANAJER_SPPG', 'SUPERVISOR_PRODUKSI', 'CHEF_KEPALA', 'ASISTEN_CHEF', 'KOORDINATOR_DISTRIBUSI', 'DRIVER', 'ADMIN_INVENTORY', 'QUALITY_CONTROL', 'STAFF_LAPANGAN');

-- CreateEnum
CREATE TYPE "public"."JenisTitikDistribusi" AS ENUM ('SEKOLAH_DASAR', 'SEKOLAH_MENENGAH_PERTAMA', 'SEKOLAH_MENENGAH_ATAS', 'SEKOLAH_KEJURUAN', 'SEKOLAH_BERKEBUTUHAN_KHUSUS', 'POSYANDU', 'PUSKESMAS', 'PUSAT_KOMUNITAS', 'PUSAT_LANSIA', 'DAYCARE', 'TEMPAT_IBADAH', 'LAINNYA');

-- CreateEnum
CREATE TYPE "public"."JenisMakanan" AS ENUM ('SARAPAN', 'MAKAN_SIANG', 'MAKAN_SORE', 'MAKANAN_RINGAN', 'MINUMAN', 'MAKANAN_KHUSUS');

-- CreateEnum
CREATE TYPE "public"."StatusDistribusi" AS ENUM ('DIRENCANAKAN', 'PERSIAPAN', 'DALAM_PERJALANAN', 'TERKIRIM', 'DIKEMBALIKAN', 'DIBATALKAN', 'DELAYED');

-- CreateEnum
CREATE TYPE "public"."StatusOperasi" AS ENUM ('DIRENCANAKAN', 'BERLANGSUNG', 'SELESAI', 'DIBATALKAN', 'TERTUNDA', 'EMERGENCY_STOP');

-- CreateEnum
CREATE TYPE "public"."StatusBahanBaku" AS ENUM ('TERSEDIA', 'HABIS', 'MENIPIS', 'EXPIRED', 'RUSAK', 'DIPESAN');

-- CreateEnum
CREATE TYPE "public"."StatusProcurement" AS ENUM ('DRAFT', 'MENUNGGU_PERSETUJUAN', 'DISETUJUI', 'DIPESAN', 'DITERIMA_SEBAGIAN', 'DITERIMA_LENGKAP', 'DIBATALKAN');

-- CreateEnum
CREATE TYPE "public"."SatuanUkuran" AS ENUM ('KG', 'GRAM', 'LITER', 'ML', 'PCS', 'PACK', 'BOX', 'KARTON');

-- CreateEnum
CREATE TYPE "public"."KategoriMenu" AS ENUM ('MAKANAN_POKOK', 'LAUK_PAUK', 'SAYUR_MAYUR', 'BUAH_BUAHAN', 'MINUMAN', 'MAKANAN_PENUTUP');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "kataSandi" TEXT,
    "nama" TEXT NOT NULL,
    "telepon" TEXT,
    "gambarProfil" TEXT,
    "isSuperAdmin" BOOLEAN NOT NULL DEFAULT false,
    "sppgId" TEXT,
    "peran" TEXT[],
    "emailTerverifikasi" TIMESTAMP(3),
    "statusAktif" BOOLEAN NOT NULL DEFAULT true,
    "terakhirLogin" TIMESTAMP(3),
    "dibuat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "diperbarui" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."sppg" (
    "id" TEXT NOT NULL,
    "kode" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "deskripsi" TEXT,
    "alamat" TEXT NOT NULL,
    "telepon" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "targetPenerima" INTEGER NOT NULL,
    "radiusMaksimal" DOUBLE PRECISION NOT NULL,
    "waktuTempuhMaks" INTEGER NOT NULL,
    "tanggalMulaiOps" TIMESTAMP(3) NOT NULL,
    "tanggalBerakhirOps" TIMESTAMP(3),
    "status" "public"."StatusSPPG" NOT NULL DEFAULT 'AKTIF',
    "provinsiId" TEXT NOT NULL,
    "kabupatenId" TEXT NOT NULL,
    "kecamatanId" TEXT NOT NULL,
    "desaId" TEXT NOT NULL,
    "dibuat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "diperbarui" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sppg_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."langganan_sppg" (
    "id" TEXT NOT NULL,
    "sppgId" TEXT NOT NULL,
    "tier" "public"."TierLangganan" NOT NULL,
    "status" "public"."StatusLangganan" NOT NULL DEFAULT 'AKTIF',
    "tanggalMulai" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tanggalBerakhir" TIMESTAMP(3),
    "tanggalTagihan" TIMESTAMP(3) NOT NULL,
    "maksPenerima" INTEGER NOT NULL,
    "maksStaf" INTEGER NOT NULL,
    "maksTitikDistribusi" INTEGER NOT NULL,
    "storageGb" INTEGER NOT NULL,
    "dibuat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "diperbarui" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "langganan_sppg_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."staf" (
    "id" TEXT NOT NULL,
    "sppgId" TEXT NOT NULL,
    "nip" TEXT,
    "nama" TEXT NOT NULL,
    "email" TEXT,
    "telepon" TEXT NOT NULL,
    "alamat" TEXT,
    "tanggalLahir" TIMESTAMP(3),
    "jenisKelamin" "public"."JenisKelamin" NOT NULL,
    "peran" "public"."PeranStaf" NOT NULL,
    "departemen" TEXT,
    "tanggalMasuk" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tanggalKeluar" TIMESTAMP(3),
    "status" "public"."StatusStaf" NOT NULL DEFAULT 'AKTIF',
    "gaji" DOUBLE PRECISION,
    "sertifikasiHACCP" BOOLEAN NOT NULL DEFAULT false,
    "sertifikasiHalal" BOOLEAN NOT NULL DEFAULT false,
    "skillKhusus" TEXT[],
    "dibuat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "diperbarui" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "staf_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."titik_distribusi" (
    "id" TEXT NOT NULL,
    "sppgId" TEXT NOT NULL,
    "kode" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "jenis" "public"."JenisTitikDistribusi" NOT NULL,
    "alamat" TEXT NOT NULL,
    "koordinatLat" DOUBLE PRECISION,
    "koordinatLng" DOUBLE PRECISION,
    "picNama" TEXT NOT NULL,
    "picTelepon" TEXT NOT NULL,
    "picEmail" TEXT,
    "porsiHarian" INTEGER NOT NULL,
    "hariOperasional" TEXT NOT NULL,
    "jamPengiriman" TEXT NOT NULL,
    "kebutuhanKhusus" TEXT,
    "catatanAkses" TEXT,
    "statusAktif" BOOLEAN NOT NULL DEFAULT true,
    "tanggalMulai" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tanggalBerhenti" TIMESTAMP(3),
    "dibuat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "diperbarui" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "titik_distribusi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."menu" (
    "id" TEXT NOT NULL,
    "sppgId" TEXT NOT NULL,
    "kode" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "deskripsi" TEXT,
    "jenis" "public"."JenisMakanan" NOT NULL,
    "kategori" "public"."KategoriMenu" NOT NULL,
    "kaloriPerPorsi" DOUBLE PRECISION NOT NULL,
    "proteinGram" DOUBLE PRECISION NOT NULL,
    "lemakGram" DOUBLE PRECISION NOT NULL,
    "karbohidratGram" DOUBLE PRECISION NOT NULL,
    "seratGram" DOUBLE PRECISION NOT NULL,
    "natriumMg" DOUBLE PRECISION,
    "gulaMg" DOUBLE PRECISION,
    "lemakJenuhGram" DOUBLE PRECISION,
    "biayaPerPorsi" DOUBLE PRECISION NOT NULL,
    "waktuPersiapan" INTEGER NOT NULL,
    "porsiPerBatch" INTEGER NOT NULL,
    "tingkatKesulitan" TEXT,
    "halal" BOOLEAN NOT NULL DEFAULT true,
    "vegetarian" BOOLEAN NOT NULL DEFAULT false,
    "bebasGluten" BOOLEAN NOT NULL DEFAULT false,
    "alergenInfo" TEXT,
    "statusAktif" BOOLEAN NOT NULL DEFAULT true,
    "instruksiKhusus" TEXT,
    "tipsPresenting" TEXT,
    "dibuat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "diperbarui" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "menu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."operasi_harian" (
    "id" TEXT NOT NULL,
    "sppgId" TEXT NOT NULL,
    "tanggal" DATE NOT NULL,
    "status" "public"."StatusOperasi" NOT NULL,
    "porsiDirencanakan" INTEGER NOT NULL,
    "porsiDiproduksi" INTEGER NOT NULL,
    "porsiTerdistribusi" INTEGER NOT NULL,
    "stafHadir" INTEGER NOT NULL,
    "menuDisajikan" TEXT[],
    "cuaca" TEXT,
    "catatan" TEXT,
    "biayaPerPorsi" DOUBLE PRECISION,
    "totalBiaya" DOUBLE PRECISION,
    "supervisorId" TEXT,
    "dibuat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "diperbarui" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "operasi_harian_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."produksi" (
    "id" TEXT NOT NULL,
    "operasiId" TEXT NOT NULL,
    "menuId" TEXT NOT NULL,
    "jumlahBatch" INTEGER NOT NULL,
    "porsiPerBatch" INTEGER NOT NULL,
    "totalPorsi" INTEGER NOT NULL,
    "waktuMulai" TIMESTAMP(3),
    "waktuSelesai" TIMESTAMP(3),
    "kualitasCek" TEXT,
    "catatan" TEXT,
    "dibuat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "diperbarui" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "produksi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."distribusi" (
    "id" TEXT NOT NULL,
    "operasiId" TEXT NOT NULL,
    "menuId" TEXT NOT NULL,
    "kendaraanId" TEXT,
    "driverId" TEXT,
    "jumlahDirencanakan" INTEGER NOT NULL,
    "jumlahTerkirim" INTEGER NOT NULL,
    "waktuBerangkat" TIMESTAMP(3),
    "waktuSampai" TIMESTAMP(3),
    "status" "public"."StatusDistribusi" NOT NULL,
    "diterimaPIC" TEXT,
    "suhuPengiriman" DOUBLE PRECISION,
    "catatanKualitas" TEXT,
    "catatanDistribusi" TEXT,
    "jumlahDikembalikan" INTEGER NOT NULL DEFAULT 0,
    "dibuat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "diperbarui" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "distribusi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."distribusi_titik" (
    "id" TEXT NOT NULL,
    "distribusiId" TEXT NOT NULL,
    "titikDistribusiId" TEXT NOT NULL,
    "jumlahPorsi" INTEGER NOT NULL,
    "waktuPengiriman" TIMESTAMP(3),
    "statusPenerimaan" TEXT NOT NULL,
    "catatanPenerima" TEXT,

    CONSTRAINT "distribusi_titik_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."bahan_baku" (
    "id" TEXT NOT NULL,
    "sppgId" TEXT NOT NULL,
    "kode" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "kategori" TEXT NOT NULL,
    "satuanUtama" "public"."SatuanUkuran" NOT NULL,
    "satuanPembelian" "public"."SatuanUkuran" NOT NULL,
    "konversiFaktor" DOUBLE PRECISION NOT NULL,
    "stokMinimal" INTEGER NOT NULL,
    "stokMaksimal" INTEGER NOT NULL,
    "stokSaatIni" INTEGER NOT NULL DEFAULT 0,
    "status" "public"."StatusBahanBaku" NOT NULL DEFAULT 'TERSEDIA',
    "hargaRatarata" DOUBLE PRECISION,
    "hargaTerakhir" DOUBLE PRECISION,
    "supplierUtama" TEXT,
    "masaBerlaku" INTEGER,
    "persyaratanKhusus" TEXT,
    "catatanPenyimpanan" TEXT,
    "dibuat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "diperbarui" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bahan_baku_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."resep_detail" (
    "id" TEXT NOT NULL,
    "menuId" TEXT NOT NULL,
    "bahanBakuId" TEXT NOT NULL,
    "jumlah" DOUBLE PRECISION NOT NULL,
    "satuan" "public"."SatuanUkuran" NOT NULL,
    "catatan" TEXT,
    "dibuat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "diperbarui" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "resep_detail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."procurement" (
    "id" TEXT NOT NULL,
    "sppgId" TEXT NOT NULL,
    "nomorPO" TEXT NOT NULL,
    "tanggalPO" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tanggalDibutuhkan" TIMESTAMP(3) NOT NULL,
    "supplierNama" TEXT NOT NULL,
    "supplierKontak" TEXT NOT NULL,
    "status" "public"."StatusProcurement" NOT NULL DEFAULT 'DRAFT',
    "totalEstimasi" DOUBLE PRECISION,
    "totalAktual" DOUBLE PRECISION,
    "diskon" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "pajak" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "disetujuiOleh" TEXT,
    "tanggalSetuju" TIMESTAMP(3),
    "catatanPersetujuan" TEXT,
    "tanggalKirim" TIMESTAMP(3),
    "tanggalTerima" TIMESTAMP(3),
    "catatanPenerimaan" TEXT,
    "dibuat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "diperbarui" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "procurement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."procurement_detail" (
    "id" TEXT NOT NULL,
    "procurementId" TEXT NOT NULL,
    "bahanBakuId" TEXT NOT NULL,
    "jumlahDipesan" DOUBLE PRECISION NOT NULL,
    "jumlahDiterima" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "satuan" "public"."SatuanUkuran" NOT NULL,
    "hargaSatuan" DOUBLE PRECISION NOT NULL,
    "totalHarga" DOUBLE PRECISION NOT NULL,
    "tanggalExpired" TIMESTAMP(3),
    "nomorBatch" TEXT,
    "kualitasCheck" TEXT,
    "catatan" TEXT,
    "dibuat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "diperbarui" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "procurement_detail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."stok_log" (
    "id" TEXT NOT NULL,
    "sppgId" TEXT NOT NULL,
    "bahanBakuId" TEXT NOT NULL,
    "jenisTransaksi" TEXT NOT NULL,
    "jumlah" DOUBLE PRECISION NOT NULL,
    "satuan" "public"."SatuanUkuran" NOT NULL,
    "stokSebelum" DOUBLE PRECISION NOT NULL,
    "stokSesudah" DOUBLE PRECISION NOT NULL,
    "referensiId" TEXT,
    "referensiTipe" TEXT,
    "catatan" TEXT,
    "dibuatOleh" TEXT,
    "dibuat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stok_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."planning_menu" (
    "id" TEXT NOT NULL,
    "sppgId" TEXT NOT NULL,
    "mingguKe" INTEGER NOT NULL,
    "bulan" INTEGER NOT NULL,
    "tahun" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "targetKalori" DOUBLE PRECISION,
    "targetProtein" DOUBLE PRECISION,
    "budgetPerPorsi" DOUBLE PRECISION,
    "catatanKhusus" TEXT,
    "disetujuiOleh" TEXT,
    "tanggalSetuju" TIMESTAMP(3),
    "dibuat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "diperbarui" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "planning_menu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."planning_menu_detail" (
    "id" TEXT NOT NULL,
    "planningId" TEXT NOT NULL,
    "hari" INTEGER NOT NULL,
    "waktuMakan" "public"."JenisMakanan" NOT NULL,
    "menuId" TEXT NOT NULL,
    "jumlahPorsi" INTEGER NOT NULL,

    CONSTRAINT "planning_menu_detail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."tagihan_sppg" (
    "id" TEXT NOT NULL,
    "sppgId" TEXT NOT NULL,
    "nomorTagihan" TEXT NOT NULL,
    "periode" TEXT NOT NULL,
    "jumlahPokok" DOUBLE PRECISION NOT NULL,
    "pajak" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "diskon" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalTagihan" DOUBLE PRECISION NOT NULL,
    "status" "public"."StatusPembayaran" NOT NULL DEFAULT 'MENUNGGU',
    "tanggalTagihan" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tanggalJatuhTempo" TIMESTAMP(3) NOT NULL,
    "tanggalBayar" TIMESTAMP(3),
    "metodePembayaran" TEXT,
    "referensiPembayaran" TEXT,
    "catatanPembayaran" TEXT,
    "dibuat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "diperbarui" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tagihan_sppg_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."laporan_harian" (
    "id" TEXT NOT NULL,
    "sppgId" TEXT NOT NULL,
    "tanggal" DATE NOT NULL,
    "totalMenuDiproduksi" INTEGER NOT NULL,
    "totalPorsiDiproduksi" INTEGER NOT NULL,
    "totalBiayaProduksi" DOUBLE PRECISION NOT NULL,
    "efisiensiProduksi" DOUBLE PRECISION,
    "totalTitikDistribusi" INTEGER NOT NULL,
    "totalPorsiTerdistribusi" INTEGER NOT NULL,
    "persentaseKeberhasilan" DOUBLE PRECISION,
    "jumlahStafHadir" INTEGER NOT NULL,
    "jamOperasional" DOUBLE PRECISION NOT NULL,
    "catatanKhusus" TEXT,
    "cuacaHari" TEXT,
    "complaintCount" INTEGER NOT NULL DEFAULT 0,
    "ratingKepuasan" DOUBLE PRECISION,
    "dibuat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "diperbarui" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "laporan_harian_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "public"."users"("email");

-- CreateIndex
CREATE INDEX "users_sppgId_idx" ON "public"."users"("sppgId");

-- CreateIndex
CREATE UNIQUE INDEX "sppg_kode_key" ON "public"."sppg"("kode");

-- CreateIndex
CREATE INDEX "sppg_status_idx" ON "public"."sppg"("status");

-- CreateIndex
CREATE INDEX "sppg_provinsiId_kabupatenId_idx" ON "public"."sppg"("provinsiId", "kabupatenId");

-- CreateIndex
CREATE UNIQUE INDEX "langganan_sppg_sppgId_key" ON "public"."langganan_sppg"("sppgId");

-- CreateIndex
CREATE UNIQUE INDEX "staf_email_key" ON "public"."staf"("email");

-- CreateIndex
CREATE INDEX "staf_sppgId_status_idx" ON "public"."staf"("sppgId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "staf_sppgId_nip_key" ON "public"."staf"("sppgId", "nip");

-- CreateIndex
CREATE INDEX "titik_distribusi_sppgId_jenis_statusAktif_idx" ON "public"."titik_distribusi"("sppgId", "jenis", "statusAktif");

-- CreateIndex
CREATE UNIQUE INDEX "titik_distribusi_sppgId_kode_key" ON "public"."titik_distribusi"("sppgId", "kode");

-- CreateIndex
CREATE INDEX "menu_sppgId_jenis_statusAktif_idx" ON "public"."menu"("sppgId", "jenis", "statusAktif");

-- CreateIndex
CREATE UNIQUE INDEX "menu_sppgId_kode_key" ON "public"."menu"("sppgId", "kode");

-- CreateIndex
CREATE UNIQUE INDEX "operasi_harian_sppgId_tanggal_key" ON "public"."operasi_harian"("sppgId", "tanggal");

-- CreateIndex
CREATE UNIQUE INDEX "distribusi_titik_distribusiId_titikDistribusiId_key" ON "public"."distribusi_titik"("distribusiId", "titikDistribusiId");

-- CreateIndex
CREATE INDEX "bahan_baku_sppgId_status_idx" ON "public"."bahan_baku"("sppgId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "bahan_baku_sppgId_kode_key" ON "public"."bahan_baku"("sppgId", "kode");

-- CreateIndex
CREATE UNIQUE INDEX "resep_detail_menuId_bahanBakuId_key" ON "public"."resep_detail"("menuId", "bahanBakuId");

-- CreateIndex
CREATE INDEX "procurement_sppgId_status_idx" ON "public"."procurement"("sppgId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "procurement_sppgId_nomorPO_key" ON "public"."procurement"("sppgId", "nomorPO");

-- CreateIndex
CREATE INDEX "stok_log_sppgId_bahanBakuId_idx" ON "public"."stok_log"("sppgId", "bahanBakuId");

-- CreateIndex
CREATE INDEX "stok_log_dibuat_idx" ON "public"."stok_log"("dibuat");

-- CreateIndex
CREATE UNIQUE INDEX "planning_menu_sppgId_mingguKe_bulan_tahun_key" ON "public"."planning_menu"("sppgId", "mingguKe", "bulan", "tahun");

-- CreateIndex
CREATE UNIQUE INDEX "planning_menu_detail_planningId_hari_waktuMakan_key" ON "public"."planning_menu_detail"("planningId", "hari", "waktuMakan");

-- CreateIndex
CREATE UNIQUE INDEX "tagihan_sppg_nomorTagihan_key" ON "public"."tagihan_sppg"("nomorTagihan");

-- CreateIndex
CREATE INDEX "tagihan_sppg_sppgId_periode_idx" ON "public"."tagihan_sppg"("sppgId", "periode");

-- CreateIndex
CREATE INDEX "tagihan_sppg_status_tanggalJatuhTempo_idx" ON "public"."tagihan_sppg"("status", "tanggalJatuhTempo");

-- CreateIndex
CREATE UNIQUE INDEX "laporan_harian_sppgId_tanggal_key" ON "public"."laporan_harian"("sppgId", "tanggal");

-- AddForeignKey
ALTER TABLE "public"."users" ADD CONSTRAINT "users_sppgId_fkey" FOREIGN KEY ("sppgId") REFERENCES "public"."sppg"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."langganan_sppg" ADD CONSTRAINT "langganan_sppg_sppgId_fkey" FOREIGN KEY ("sppgId") REFERENCES "public"."sppg"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."staf" ADD CONSTRAINT "staf_sppgId_fkey" FOREIGN KEY ("sppgId") REFERENCES "public"."sppg"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."titik_distribusi" ADD CONSTRAINT "titik_distribusi_sppgId_fkey" FOREIGN KEY ("sppgId") REFERENCES "public"."sppg"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."menu" ADD CONSTRAINT "menu_sppgId_fkey" FOREIGN KEY ("sppgId") REFERENCES "public"."sppg"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."operasi_harian" ADD CONSTRAINT "operasi_harian_sppgId_fkey" FOREIGN KEY ("sppgId") REFERENCES "public"."sppg"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."operasi_harian" ADD CONSTRAINT "operasi_harian_supervisorId_fkey" FOREIGN KEY ("supervisorId") REFERENCES "public"."staf"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."produksi" ADD CONSTRAINT "produksi_operasiId_fkey" FOREIGN KEY ("operasiId") REFERENCES "public"."operasi_harian"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."produksi" ADD CONSTRAINT "produksi_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "public"."menu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."distribusi" ADD CONSTRAINT "distribusi_operasiId_fkey" FOREIGN KEY ("operasiId") REFERENCES "public"."operasi_harian"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."distribusi" ADD CONSTRAINT "distribusi_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "public"."menu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."distribusi_titik" ADD CONSTRAINT "distribusi_titik_distribusiId_fkey" FOREIGN KEY ("distribusiId") REFERENCES "public"."distribusi"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."distribusi_titik" ADD CONSTRAINT "distribusi_titik_titikDistribusiId_fkey" FOREIGN KEY ("titikDistribusiId") REFERENCES "public"."titik_distribusi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."bahan_baku" ADD CONSTRAINT "bahan_baku_sppgId_fkey" FOREIGN KEY ("sppgId") REFERENCES "public"."sppg"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."resep_detail" ADD CONSTRAINT "resep_detail_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "public"."menu"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."resep_detail" ADD CONSTRAINT "resep_detail_bahanBakuId_fkey" FOREIGN KEY ("bahanBakuId") REFERENCES "public"."bahan_baku"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."procurement" ADD CONSTRAINT "procurement_sppgId_fkey" FOREIGN KEY ("sppgId") REFERENCES "public"."sppg"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."procurement_detail" ADD CONSTRAINT "procurement_detail_procurementId_fkey" FOREIGN KEY ("procurementId") REFERENCES "public"."procurement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."procurement_detail" ADD CONSTRAINT "procurement_detail_bahanBakuId_fkey" FOREIGN KEY ("bahanBakuId") REFERENCES "public"."bahan_baku"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."stok_log" ADD CONSTRAINT "stok_log_sppgId_fkey" FOREIGN KEY ("sppgId") REFERENCES "public"."sppg"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."stok_log" ADD CONSTRAINT "stok_log_bahanBakuId_fkey" FOREIGN KEY ("bahanBakuId") REFERENCES "public"."bahan_baku"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."planning_menu" ADD CONSTRAINT "planning_menu_sppgId_fkey" FOREIGN KEY ("sppgId") REFERENCES "public"."sppg"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."planning_menu_detail" ADD CONSTRAINT "planning_menu_detail_planningId_fkey" FOREIGN KEY ("planningId") REFERENCES "public"."planning_menu"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."planning_menu_detail" ADD CONSTRAINT "planning_menu_detail_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "public"."menu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tagihan_sppg" ADD CONSTRAINT "tagihan_sppg_sppgId_fkey" FOREIGN KEY ("sppgId") REFERENCES "public"."sppg"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."laporan_harian" ADD CONSTRAINT "laporan_harian_sppgId_fkey" FOREIGN KEY ("sppgId") REFERENCES "public"."sppg"("id") ON DELETE CASCADE ON UPDATE CASCADE;
