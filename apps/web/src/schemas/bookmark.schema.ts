import { z } from 'zod'
import type { Category } from '../supabase/categories'

// Category schema based on Category type
const categorySchema = z.object({
  id: z.string(),
  name: z.string().min(1, '카테고리를 선택하세요'),
  color: z.string().min(1, '카테고리를 선택하세요'),
  user_id: z.string().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
})

// Bookmark schema
export const bookmarkSchema = z.object({
  url: z.string().min(1, 'URL을 입력하세요').url('올바른 URL 형식이 아닙니다'),
  title: z.string().min(1, '제목을 입력하세요').max(100, '제목은 100자 이하여야 합니다'),
  description: z.string().max(200, '설명은 200자 이하여야 합니다').optional(),
  category: categorySchema,
  tags: z.array(z.string()).default([]),
})

export type BookmarkFormData = z.infer<typeof bookmarkSchema>
