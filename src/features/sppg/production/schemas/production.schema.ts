import { z } from 'zod'

// Production schemas - placeholder
export const productionSchema = z.object({
  id: z.string(),
  menuId: z.string(),
  batchCount: z.number(),
  servingsPerBatch: z.number(),
  totalServings: z.number(),
  startTime: z.string().optional(),
  endTime: z.string().optional()
})

export type Production = z.infer<typeof productionSchema>