// Distribution feature barrel exports
export * from './components'
export * from './hooks'
export * from './store'

// Export types and schemas explicitly to avoid conflicts
export type {
  DistributionPoint,
  DistributionLog,
  Beneficiary,
  DistributionStats,
  CreateDistributionPointData,
  UpdateDistributionPointData,
  CreateBeneficiaryData,
  UpdateBeneficiaryData,
  StartDistributionData,
  CompleteDistributionData
} from './types'

export {
  distributionPointSchema,
  distributionLogSchema,
  beneficiarySchema,
  createDistributionPointSchema,
  createBeneficiarySchema,
  startDistributionSchema,
  completeDistributionSchema
} from './schemas'