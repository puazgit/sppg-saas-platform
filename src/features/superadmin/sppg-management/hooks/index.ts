import { useQuery } from '@tanstack/react-query'

// Temporary hook until real implementation
export function useSppgList() {
  return useQuery({
    queryKey: ['sppg-list'],
    queryFn: async () => {
      // Mock data for now
      return {
        stats: {
          total: 5,
          active: 3,
          totalBeneficiaries: 1200,
          totalMonthlyBudget: 50000000
        },
        data: []
      }
    }
  })
}