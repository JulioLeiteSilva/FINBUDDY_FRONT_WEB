import { z } from 'zod';
import { TransactionFrequency } from '../../enums';
import { FirestoreIdSchema } from '../Common';

export const TransactionSchema = z.object({
    id: FirestoreIdSchema,
    name: z.string().min(1),
    category: z.string().min(1),
    value: z.number(),
    date: z.date(),
    type: z.enum(['INCOME', 'EXPENSE', "INVOICE"]),
    isRecurring: z.boolean(),
    frequency: z.nativeEnum(TransactionFrequency).nullable(),
    startDate: z.date().nullable(),
    endDate: z.date().nullable(),
    isPaid: z.boolean(),
    currency: z.string(),
    bankAccountId: FirestoreIdSchema,
    invoiceId: FirestoreIdSchema.nullable(),
    creditCardId: FirestoreIdSchema.nullable(),
    primaryTransactionId: FirestoreIdSchema.nullable(),
});