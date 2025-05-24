import { z } from 'zod';
import { BankAccountSchema } from './BankAccountSchema';

export const BankAccountResponseDTOSchema = z.object({
    message: z.string(),
    accounts: z.array(BankAccountSchema)
});