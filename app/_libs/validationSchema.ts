import { z } from "zod";

export const validationSchema = z.object({
  email: z
    .string()
    .min(1, { message: "メールアドレスは必須です"})
    .email({ message: "正しいメールアドレスを入力してください" }),

  password: z
    .string()
    .min(1, { message: "パスワードは必須です"})
    .min(6, { message: "パスワードは6文字以上で設定してください"}),
})