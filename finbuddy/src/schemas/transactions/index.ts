import { z } from 'zod';
import { TransactionSchema } from './transactionsSchema';
import { TransactionRequestDTOSchema } from './transactionRequestDTOSchema';
import { TransactionsResponseDTOSchema } from './transactionsResponseDTOSchema';

export { TransactionSchema, TransactionRequestDTOSchema, TransactionsResponseDTOSchema };

export type TransactionsResponseDTOSchemaType = z.infer<typeof TransactionsResponseDTOSchema>;
export type TransactionSchemaType = z.infer<typeof TransactionSchema>;
export type TransactionRequestDTOSchemaType = z.infer<typeof TransactionRequestDTOSchema>;