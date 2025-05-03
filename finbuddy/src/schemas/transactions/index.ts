import { z } from 'zod';
import { TransactionSchema } from './transactionsSchema';
import { TransactionRequestDTOSchema } from './transactionRequestDTOSchema';

export { TransactionSchema, TransactionRequestDTOSchema };

export type TransactionSchemaType = z.infer<typeof TransactionSchema>;
export type TransactionRequestDTOSchemaType = z.infer<typeof TransactionRequestDTOSchema>;