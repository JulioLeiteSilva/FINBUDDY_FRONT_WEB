import { z } from 'zod';

export const UpdateBankAccountBalanceDTOSchema = z.object({
    balance: z.number(),
});