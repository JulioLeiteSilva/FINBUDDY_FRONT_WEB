import { z } from 'zod';
import { FirestoreIdSchema } from '../Common';
import { AccountType } from '../../enums/accountType'; // ajuste o path conforme seu projeto

export const BankAccountSchema = z.object({
    id: FirestoreIdSchema,
    name: z.string().min(1),
    type: z.nativeEnum(AccountType),
    bank: z.string().min(1),
    balance: z.number(),
    currency: z.string().min(1),
    createdAt: z.date(),
    updatedAt: z.date(),
    isActive: z.boolean(),
});

export type BankAccountType = z.infer<
    typeof BankAccountSchema
>;