import { z } from 'zod'

export const careLogSchema = z
  .object({
    eventType: z.enum(['WATER', 'FERTILIZE', 'REPOT']),
    occurredAt: z.string().min(1, '기록 일시를 입력해주세요.'),
    fertilizerName: z
      .string()
      .trim()
      .max(120, '비료 이름은 120자 이하')
      .optional()
      .or(z.literal('')),
    note: z.string().trim().max(500, '메모는 500자 이하').optional().or(z.literal('')),
  })
  .superRefine((values, ctx) => {
    if (values.eventType === 'FERTILIZE' && !values.fertilizerName?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['fertilizerName'],
        message: '비료 기록에는 비료 이름을 입력해주세요.',
      })
    }
  })

export type CareLogFormValues = z.infer<typeof careLogSchema>
