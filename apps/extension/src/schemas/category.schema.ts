import { z } from 'zod'

// Category schema
export const categorySchema = z.object({
  name: z
    .string()
    .min(1, '카테고리 이름을 입력하세요')
    .max(20, '카테고리 이름은 20자 이하여야 합니다'),
  color: z.string().min(1, '색상을 선택하세요'),
})

export type CategoryFormData = z.infer<typeof categorySchema>
