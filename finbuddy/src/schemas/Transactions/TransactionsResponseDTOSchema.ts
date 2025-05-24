import { z } from 'zod';
import { TransactionSchema } from './TransactionsSchema';

export const TransactionsResponseDTOSchema = z.object({
    message: z.string(),
    transactions: z.array(TransactionSchema)
});