import { z } from 'zod';
import { FirestoreIdSchema } from '../Common/FirestoreSchemas';

export const CategorySchema = z.object({
    id: FirestoreIdSchema,
    name: z.string().min(1),
    icon: z.string().min(1),
    type: z.enum(['INCOME', 'EXPENSE']),
});

export type CategoryType = z.infer<typeof CategorySchema>;