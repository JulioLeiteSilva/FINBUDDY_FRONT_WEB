import { z } from 'zod';
import { CreditCardSchema } from './CreditCardSchema';
import { CreditCardRequestDTOSchema } from './CreditCardRequestDTOSchema';
import { CreditCardResponseDTOSchema } from './CreditCardResponseDTOSchema';
import { CreditCardInvoiceSchema } from './CreditCardInvoiceSchema';
import { CreditCardInvoiceRequestDTOSchema } from './CreditCardInvoiceRequestDTOSchema';
import { CreditCardInvoiceResponseDTOSchema } from './CreditCardInvoiceResponseDTOSchema';

export { 
    CreditCardSchema, 
    CreditCardRequestDTOSchema, 
    CreditCardResponseDTOSchema,
    CreditCardInvoiceSchema,
    CreditCardInvoiceRequestDTOSchema,
    CreditCardInvoiceResponseDTOSchema
};

export type CreditCardSchemaType = z.infer<typeof CreditCardSchema>;
export type CreditCardResponseDTOSchemaType = z.infer<typeof CreditCardResponseDTOSchema>;
export type CreditCardRequestDTOSchemaType = z.infer<typeof CreditCardRequestDTOSchema>;
export type CreditCardInvoiceSchemaType = z.infer<typeof CreditCardInvoiceSchema>;
export type CreditCardInvoiceResponseDTOSchemaType = z.infer<typeof CreditCardInvoiceResponseDTOSchema>;
export type CreditCardInvoiceRequestDTOSchemaType = z.infer<typeof CreditCardInvoiceRequestDTOSchema>;