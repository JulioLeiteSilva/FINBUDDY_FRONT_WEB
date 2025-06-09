import { z } from 'zod';
import { CreditCardSchema } from './CreditCardSchema';

export const CreditCardResponseDTOSchema = z.object({
    message: z.string(),
    cards: z.array(CreditCardSchema)
}); 