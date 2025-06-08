import { z } from 'zod';
import { CreditCardSchema } from './CreditCardSchema';

export const CreditCardResponseDTOSchema = z.object({
    message: z.string(),
    creditCards: z.array(CreditCardSchema)
}); 