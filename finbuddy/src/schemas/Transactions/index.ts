import { z } from 'zod';
import { TransactionSchema } from './TransactionsSchema';
import { TransactionRequestDTOSchema } from './TransactionRequestDTOSchema';
import { TransactionsResponseDTOSchema } from './TransactionsResponseDTOSchema';

export { TransactionSchema, TransactionRequestDTOSchema, TransactionsResponseDTOSchema };

export type TransactionsResponseDTOSchemaType = z.infer<typeof TransactionsResponseDTOSchema>;
export type TransactionSchemaType = z.infer<typeof TransactionSchema>;
export type TransactionRequestDTOSchemaType = z.infer<typeof TransactionRequestDTOSchema>;