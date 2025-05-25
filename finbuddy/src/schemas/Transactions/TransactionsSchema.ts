import { z } from 'zod';
import { TransactionFrequency } from '../../enums';
import { firestoreIdSchema } from '../Common/FirestoreSchemas';

export const TransactionSchema = z.object({
    id: firestoreIdSchema,
    name: z.string().min(1),
    category: z.string().min(1),
    value: z.number(),
    date: z.date(),
    type: z.enum(['INCOME', 'EXPENSE']),
    isRecurring: z.boolean(),
    frequency: z.nativeEnum(TransactionFrequency).nullable(),
    startDate: z.date().nullable(),
    endDate: z.date().nullable(),
    isPaid: z.boolean(),
    currency: z.string(),
    bankAccountId: firestoreIdSchema,
});