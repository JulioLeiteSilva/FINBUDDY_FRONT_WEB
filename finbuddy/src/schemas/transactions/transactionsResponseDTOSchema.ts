import { z } from 'zod';
import { TransactionSchema } from './transactionsSchema';

export const TransactionsResponseDTOSchema = z.object({
    message: z.string(),
    transactions: z.array(TransactionSchema)
});