import { z } from 'zod'

export const plantFormSchema = z.object({
  name: z.string().trim().min(1, '식물 이름을 입력해주세요.').max(80, '이름은 80자 이하로 입력해주세요.'),
  species: z.string().trim().max(120, '종류는 120자 이하로 입력해주세요.').optional().or(z.literal('')),
  location: z.string().trim().max(120, '위치는 120자 이하로 입력해주세요.').optional().or(z.literal('')),
  acquiredOn: z.string().optional().or(z.literal('')),
  note: z.string().trim().max(1000, '메모는 1000자 이하로 입력해주세요.').optional().or(z.literal('')),
})

export type PlantFormValues = z.infer<typeof plantFormSchema>
