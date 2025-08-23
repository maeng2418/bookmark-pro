import { z } from 'zod'

// Auth schema
export const authSchema = z.object({
  email: z.string().min(1, '이메일을 입력하세요').email('올바른 이메일 형식이 아닙니다'),
  password: z
    .string()
    .min(6, '비밀번호는 6자 이상이어야 합니다')
    .max(128, '비밀번호는 128자 이하여야 합니다'),
})

export type AuthFormData = z.infer<typeof authSchema>
