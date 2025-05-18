import { z } from 'zod';

export const CategoryRequestDTOSchema = z.object({
    name: z.string().min(1),
    icon: z.string().min(1),
    type: z.enum(['INCOME', 'EXPENSE']),
});