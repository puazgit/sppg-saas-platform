// SPPG Distribution Module Types
// Domain: Food distribution, delivery points, beneficiaries management

export interface DistributionPoint {
  id: string
  name: string
  type: DistributionPointType
  address: string
  location: string
  capacity: number
  currentRecipients: number
  isActive: boolean
  contactPerson: string
  contactPhone: string
  schedule: DistributionSchedule[]
  coordinates?: {
    lat: number
    lng: number
  }
  createdAt: string
}

export interface DistributionSchedule {
  id: string
  distributionPointId: string
  dayOfWeek: number // 0-6, Sunday = 0
  startTime: string // HH:mm format
  endTime: string // HH:mm format
  menuType: MenuType
  expectedRecipients: number
  isActive: boolean
}

export interface DistributionLog {
  id: string
  distributionPointId: string
  distributionPointName: string
  date: string
  status: DistributionStatus
  scheduledTime: string
  actualStartTime?: string
  actualEndTime?: string
  plannedRecipients: number
  actualRecipients: number
  menusDistributed: DistributedMenu[]
  staff: StaffAssignment[]
  vehicleUsed?: string
  fuelCost?: number
  notes?: string
  weatherCondition?: WeatherCondition
  createdAt: string
}

export interface DistributedMenu {
  id: string
  menuName: string
  recipeId: string
  portionsDistributed: number
  portionsLeftover?: number
  qualityRating?: number // 1-5 stars
  recipientFeedback?: string
}

export interface StaffAssignment {
  id: string
  staffId: string
  staffName: string
  role: DistributionRole
  assignedTime: string
}

export interface Beneficiary {
  id: string
  name: string
  idNumber: string // NIK/KTP
  category: BeneficiaryCategory
  age?: number
  gender?: Gender
  address: string
  phone?: string
  distributionPointId: string
  registrationDate: string
  isActive: boolean
  specialNeeds?: SpecialNeeds[]
  lastDistribution?: string
  totalReceived: number
}

export interface DistributionStats {
  todayDistributions: number
  completedDistributions: number
  pendingDistributions: number
  totalRecipients: number
  totalPortionsDistributed: number
  averageDeliveryTime: number // minutes
  onTimeDeliveryRate: number // percentage
  beneficiarySatisfaction: number // 1-5 stars
}

export interface Route {
  id: string
  name: string
  distributionPoints: string[] // array of distribution point IDs
  estimatedDuration: number // minutes
  estimatedDistance: number // kilometers
  vehicleRequired: VehicleType
  isOptimized: boolean
  createdAt: string
}

// Enums
export type DistributionPointType = 
  | 'SCHOOL'           // Sekolah
  | 'POSYANDU'         // Posyandu
  | 'COMMUNITY_CENTER' // Balai warga
  | 'MOSQUE'           // Masjid
  | 'CHURCH'           // Gereja
  | 'GOVERNMENT_OFFICE'// Kantor pemerintahan
  | 'OTHERS'           // Lainnya

export type DistributionStatus = 
  | 'SCHEDULED'        // Terjadwal
  | 'IN_TRANSIT'       // Dalam perjalanan
  | 'DISTRIBUTING'     // Sedang distribusi
  | 'COMPLETED'        // Selesai
  | 'DELAYED'          // Terlambat
  | 'CANCELLED'        // Dibatalkan

export type MenuType = 
  | 'BREAKFAST'        // Sarapan
  | 'LUNCH'            // Makan siang
  | 'DINNER'           // Makan malam
  | 'SNACK'            // Camilan

export type DistributionRole = 
  | 'DRIVER'           // Sopir
  | 'DISTRIBUTOR'      // Pembagi makanan
  | 'COORDINATOR'      // Koordinator
  | 'HELPER'           // Pembantu

export type BeneficiaryCategory = 
  | 'STUDENT'          // Siswa
  | 'ELDERLY'          // Lansia
  | 'PREGNANT_MOTHER'  // Ibu hamil
  | 'TODDLER'          // Balita
  | 'DISABLED'         // Disabilitas
  | 'POOR_FAMILY'      // Keluarga kurang mampu
  | 'OTHERS'           // Lainnya

export type Gender = 
  | 'MALE'     // Laki-laki
  | 'FEMALE'   // Perempuan

export type SpecialNeeds = 
  | 'DIABETIC'         // Diabetes
  | 'HYPERTENSION'     // Hipertensi
  | 'FOOD_ALLERGY'     // Alergi makanan
  | 'VEGETARIAN'       // Vegetarian
  | 'SOFT_FOOD'        // Makanan lunak
  | 'LOW_SALT'         // Rendah garam
  | 'LOW_SUGAR'        // Rendah gula

export type WeatherCondition = 
  | 'SUNNY'    // Cerah
  | 'CLOUDY'   // Berawan
  | 'RAINY'    // Hujan
  | 'STORMY'   // Badai

export type VehicleType = 
  | 'MOTORCYCLE'       // Motor
  | 'CAR'              // Mobil
  | 'VAN'              // Van
  | 'TRUCK'            // Truk
  | 'BICYCLE'          // Sepeda

// API Data types (for mutations)
export type CreateDistributionPointData = Omit<DistributionPoint, 'id' | 'createdAt' | 'updatedAt' | 'isActive'>
export type UpdateDistributionPointData = Partial<Omit<DistributionPoint, 'id' | 'createdAt' | 'updatedAt'>>
export type CreateBeneficiaryData = Omit<Beneficiary, 'id' | 'registrationDate' | 'lastDistribution' | 'isActive'>
export type UpdateBeneficiaryData = Partial<Omit<Beneficiary, 'id' | 'registrationDate'>>
export type StartDistributionData = Omit<DistributionLog, 'id' | 'startTime' | 'endTime' | 'actualBeneficiaries' | 'status' | 'createdAt' | 'updatedAt'>
export type CompleteDistributionData = Pick<DistributionLog, 'actualRecipients' | 'notes' | 'weatherCondition'>