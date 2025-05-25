import { z } from 'zod';
import { AccountType } from '../../enums/accountType';

export const UpdateBankAccountDTOSchema = z.object({
    name: z.string().min(1),
    type: z.nativeEnum(AccountType),
    bank: z.string().min(1),
    currency: z.string().min(1),
});