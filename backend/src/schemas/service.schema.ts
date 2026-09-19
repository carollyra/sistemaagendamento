import { z } from 'zod';

export const createServiceSchema = z.object({
  name: z.string().trim().min(3, 'O nome deve ter pelo menos 3 caracteres').max(120),
  description: z.string().trim().max(500).optional(),
  durationMinutes: z
    .number()
    .int()
    .min(5, 'A duração mínima é de 5 minutos')
    .max(480, 'A duração máxima é de 480 minutos'),
  price: z.number().nonnegative('O preço não pode ser negativo').max(100000),
  active: z.boolean().optional(),
});

export const updateServiceSchema = createServiceSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Informe pelo menos um campo',
  });

export const listServicesQuerySchema = z.object({
  includeInactive: z
    .enum(['true', 'false'])
    .optional()
    .transform((value) => value === 'true'),
});

export const idParamSchema = z.object({
  id: z.uuid('Identificador inválido'),
});

export type CreateServiceInput = z.infer<typeof createServiceSchema>;
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>;
