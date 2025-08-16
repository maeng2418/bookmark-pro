import { z } from "zod";

// Tag schema
export const tagSchema = z.object({
  tag: z
    .string()
    .min(1, "태그를 입력하세요")
    .max(20, "태그는 20자 이하여야 합니다")
    .regex(
      /^[a-zA-Z0-9가-힣_-]+$/,
      "태그는 영문, 한글, 숫자, -, _만 사용 가능합니다"
    ),
});

export type TagFormData = z.infer<typeof tagSchema>;
