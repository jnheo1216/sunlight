import { z } from 'zod'

export const careLogSchema = z.object({
  eventType: z.enum(['WATER', 'FERTILIZE', 'REPOT']),
  occurredAt: z.string().min(1, '기록 일시를 입력해주세요.'),
  note: z.string().trim().max(500, '메모는 500자 이하').optional().or(z.literal('')),
})

export type CareLogFormValues = z.infer<typeof careLogSchema>
