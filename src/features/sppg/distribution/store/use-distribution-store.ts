import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { 
  DistributionPoint, 
  DistributionLog, 
  Beneficiary, 
  DistributionStats 
} from '../types'

interface DistributionState {
  // Data State
  distributionPoints: DistributionPoint[]
  distributionLogs: DistributionLog[]
  beneficiaries: Beneficiary[]
  stats: DistributionStats | null
  
  // UI State
  isPointsLoading: boolean
  isLogsLoading: boolean
  isBeneficiariesLoading: boolean
  isStatsLoading: boolean
  
  // Filter & View State
  selectedPointId: string | null
  selectedLogId: string | null
  dateFilter: string // YYYY-MM-DD
  statusFilter: string | null
  viewMode: 'map' | 'list'
  
  // Modal States
  isCreatePointModalOpen: boolean
  isCreateBeneficiaryModalOpen: boolean
  isStartDistributionModalOpen: boolean
  isCompleteDistributionModalOpen: boolean
}

interface DistributionActions {
  // Distribution Points Actions
  setDistributionPoints: (points: DistributionPoint[]) => void
  setPointsLoading: (loading: boolean) => void
  addDistributionPoint: (point: DistributionPoint) => void
  updateDistributionPoint: (point: DistributionPoint) => void
  removeDistributionPoint: (pointId: string) => void
  
  // Distribution Logs Actions
  setDistributionLogs: (logs: DistributionLog[]) => void
  setLogsLoading: (loading: boolean) => void
  addDistributionLog: (log: DistributionLog) => void
  updateDistributionLog: (log: DistributionLog) => void
  
  // Beneficiaries Actions
  setBeneficiaries: (beneficiaries: Beneficiary[]) => void
  setBeneficiariesLoading: (loading: boolean) => void
  addBeneficiary: (beneficiary: Beneficiary) => void
  updateBeneficiary: (beneficiary: Beneficiary) => void
  removeBeneficiary: (beneficiaryId: string) => void
  
  // Stats Actions
  setStats: (stats: DistributionStats) => void
  setStatsLoading: (loading: boolean) => void
  
  // Filter Actions
  setSelectedPointId: (pointId: string | null) => void
  setSelectedLogId: (logId: string | null) => void
  setDateFilter: (date: string) => void
  setStatusFilter: (status: string | null) => void
  setViewMode: (mode: 'map' | 'list') => void
  
  // Modal Actions
  setCreatePointModalOpen: (open: boolean) => void
  setCreateBeneficiaryModalOpen: (open: boolean) => void
  setStartDistributionModalOpen: (open: boolean) => void
  setCompleteDistributionModalOpen: (open: boolean) => void
  
  // Reset Actions
  resetDistributionState: () => void
}

const initialState: DistributionState = {
  distributionPoints: [],
  distributionLogs: [],
  beneficiaries: [],
  stats: null,
  isPointsLoading: false,
  isLogsLoading: false,
  isBeneficiariesLoading: false,
  isStatsLoading: false,
  selectedPointId: null,
  selectedLogId: null,
  dateFilter: new Date().toISOString().split('T')[0], // Today
  statusFilter: null,
  viewMode: 'list',
  isCreatePointModalOpen: false,
  isCreateBeneficiaryModalOpen: false,
  isStartDistributionModalOpen: false,
  isCompleteDistributionModalOpen: false
}

export const useDistributionStore = create<DistributionState & DistributionActions>()(
  devtools(
    (set) => ({
      ...initialState,
      
      // Distribution Points Actions
      setDistributionPoints: (distributionPoints) => set({ distributionPoints }, false, 'setDistributionPoints'),
      setPointsLoading: (isPointsLoading) => set({ isPointsLoading }, false, 'setPointsLoading'),
      addDistributionPoint: (newPoint) => set((state) => ({
        distributionPoints: [newPoint, ...state.distributionPoints]
      }), false, 'addDistributionPoint'),
      updateDistributionPoint: (updatedPoint) => set((state) => ({
        distributionPoints: state.distributionPoints.map(point => 
          point.id === updatedPoint.id ? updatedPoint : point
        )
      }), false, 'updateDistributionPoint'),
      removeDistributionPoint: (pointId) => set((state) => ({
        distributionPoints: state.distributionPoints.filter(point => point.id !== pointId)
      }), false, 'removeDistributionPoint'),
      
      // Distribution Logs Actions
      setDistributionLogs: (distributionLogs) => set({ distributionLogs }, false, 'setDistributionLogs'),
      setLogsLoading: (isLogsLoading) => set({ isLogsLoading }, false, 'setLogsLoading'),
      addDistributionLog: (newLog) => set((state) => ({
        distributionLogs: [newLog, ...state.distributionLogs]
      }), false, 'addDistributionLog'),
      updateDistributionLog: (updatedLog) => set((state) => ({
        distributionLogs: state.distributionLogs.map(log => 
          log.id === updatedLog.id ? updatedLog : log
        )
      }), false, 'updateDistributionLog'),
      
      // Beneficiaries Actions
      setBeneficiaries: (beneficiaries) => set({ beneficiaries }, false, 'setBeneficiaries'),
      setBeneficiariesLoading: (isBeneficiariesLoading) => set({ isBeneficiariesLoading }, false, 'setBeneficiariesLoading'),
      addBeneficiary: (newBeneficiary) => set((state) => ({
        beneficiaries: [newBeneficiary, ...state.beneficiaries]
      }), false, 'addBeneficiary'),
      updateBeneficiary: (updatedBeneficiary) => set((state) => ({
        beneficiaries: state.beneficiaries.map(beneficiary => 
          beneficiary.id === updatedBeneficiary.id ? updatedBeneficiary : beneficiary
        )
      }), false, 'updateBeneficiary'),
      removeBeneficiary: (beneficiaryId) => set((state) => ({
        beneficiaries: state.beneficiaries.filter(beneficiary => beneficiary.id !== beneficiaryId)
      }), false, 'removeBeneficiary'),
      
      // Stats Actions
      setStats: (stats) => set({ stats }, false, 'setStats'),
      setStatsLoading: (isStatsLoading) => set({ isStatsLoading }, false, 'setStatsLoading'),
      
      // Filter Actions
      setSelectedPointId: (selectedPointId) => set({ selectedPointId }, false, 'setSelectedPointId'),
      setSelectedLogId: (selectedLogId) => set({ selectedLogId }, false, 'setSelectedLogId'),
      setDateFilter: (dateFilter) => set({ dateFilter }, false, 'setDateFilter'),
      setStatusFilter: (statusFilter) => set({ statusFilter }, false, 'setStatusFilter'),
      setViewMode: (viewMode) => set({ viewMode }, false, 'setViewMode'),
      
      // Modal Actions
      setCreatePointModalOpen: (isCreatePointModalOpen) => set({ isCreatePointModalOpen }, false, 'setCreatePointModalOpen'),
      setCreateBeneficiaryModalOpen: (isCreateBeneficiaryModalOpen) => set({ isCreateBeneficiaryModalOpen }, false, 'setCreateBeneficiaryModalOpen'),
      setStartDistributionModalOpen: (isStartDistributionModalOpen) => set({ isStartDistributionModalOpen }, false, 'setStartDistributionModalOpen'),
      setCompleteDistributionModalOpen: (isCompleteDistributionModalOpen) => set({ isCompleteDistributionModalOpen }, false, 'setCompleteDistributionModalOpen'),
      
      // Reset Actions
      resetDistributionState: () => set(initialState, false, 'resetDistributionState')
    }),
    {
      name: 'distribution-store',
      enabled: process.env.NODE_ENV === 'development'
    }
  )
)