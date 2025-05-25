import { z } from 'zod';
import { TransactionSchema } from '../Transactions';
import { firestoreIdSchema } from '../Common/FirestoreSchemas';
import { AccountType } from '../../enums/accountType'; // ajuste o path conforme seu projeto

export const BankAccountSchema = z.object({
    id: firestoreIdSchema,
    name: z.string().min(1),
    type: z.nativeEnum(AccountType),
    bank: z.string().min(1),
    balance: z.number(),
    transactions: z.array(TransactionSchema),
    currency: z.string().min(1),
});