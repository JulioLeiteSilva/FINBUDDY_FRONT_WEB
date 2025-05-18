import { z } from 'zod';
import { firestoreIdSchema } from '../common/firestoreSchemas';

export const CategorySchema = z.object({
    id: firestoreIdSchema,
    name: z.string().min(1),
    icon: z.string().min(1),
    type: z.enum(['INCOME', 'EXPENSE']),
});