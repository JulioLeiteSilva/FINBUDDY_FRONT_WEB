import { z } from 'zod';
import { TransactionFrequency } from '../../enums';
import { firestoreIdSchema } from '../Common/FirestoreSchemas';

export const TransactionRequestDTOSchema = z.object({
    name: z.string().min(1),
    category: z.string().min(1),
    value: z.number().gt(0, { message: "O valor deve ser maior que zero" }),
    date: z.date(),
    type: z.enum(['INCOME', 'EXPENSE', 'INVOICE']),
    isRecurring: z.boolean(),
    frequency: z.nativeEnum(TransactionFrequency).nullable(),
    startDate: z.date().nullable(),
    endDate: z.date().nullable(),
    isPaid: z.boolean(),
    currency: z.string(),
    bankAccountId: firestoreIdSchema,
});