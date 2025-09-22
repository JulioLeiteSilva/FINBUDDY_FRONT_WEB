import { z } from "zod";
import { FirestoreIdSchema } from "../Common/FirestoreSchemas";
import { InvoiceStatus } from "../../enums/InvoiceStatus";

export const CreditCardInvoiceSchema = z.object({
    id: FirestoreIdSchema,
    status: z.nativeEnum(InvoiceStatus),
    total: z.number(),
    month : z.number(),
    year : z.number(),
    bankAccountId: FirestoreIdSchema.nullable(),
});

export type CreditCardInvoiceType = z.infer<typeof CreditCardInvoiceSchema>;