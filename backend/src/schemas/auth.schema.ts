import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().trim().min(3, 'O nome deve ter pelo menos 3 caracteres').max(120),
  email: z.email('E-mail inválido').toLowerCase(),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres').max(72),
  phone: z
    .string()
    .trim()
    .min(8)
    .max(20)
    .optional()
    .or(z.literal('').transform(() => undefined)),
});

export const loginSchema = z.object({
  email: z.email('E-mail inválido').toLowerCase(),
  password: z.string().min(1, 'Informe a senha'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
