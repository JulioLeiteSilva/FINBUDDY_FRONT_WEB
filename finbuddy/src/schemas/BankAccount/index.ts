
import { z } from 'zod';
import { BankAccountSchema } from './bankAccount';

export type BankAccountSchemaType = z.infer<typeof BankAccountSchema>;
export { BankAccountSchema };