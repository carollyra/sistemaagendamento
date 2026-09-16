import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().trim().min(3, 'Name must have at least 3 characters').max(120),
  email: z.email('Invalid email').toLowerCase(),
  password: z.string().min(6, 'Password must have at least 6 characters').max(72),
  phone: z
    .string()
    .trim()
    .min(8)
    .max(20)
    .optional()
    .or(z.literal('').transform(() => undefined)),
});

export const loginSchema = z.object({
  email: z.email('Invalid email').toLowerCase(),
  password: z.string().min(1, 'Password is required'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
