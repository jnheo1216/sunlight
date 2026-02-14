import { z } from 'zod'

export const careProfileSchema = z.object({
  wateringIntervalDays: z
    .number()
    .int('정수로 입력해주세요.')
    .min(1, '최소 1일')
    .max(365, '최대 365일'),
  fertilizingIntervalDays: z
    .number()
    .int('정수로 입력해주세요.')
    .min(1, '최소 1일')
    .max(365, '최대 365일'),
  nextWateringOverrideAt: z.string().optional().or(z.literal('')),
  nextFertilizingOverrideAt: z.string().optional().or(z.literal('')),
})

export type CareProfileFormValues = z.infer<typeof careProfileSchema>
