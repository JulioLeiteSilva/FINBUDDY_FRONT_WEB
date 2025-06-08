import { z } from 'zod';
import { CreditCardInvoiceSchema } from './CreditCardInvoiceSchema';

export const CreditCardInvoiceResponseDTOSchema = z.object({
    message: z.string(),
    invoices: z.array(CreditCardInvoiceSchema)
}); 