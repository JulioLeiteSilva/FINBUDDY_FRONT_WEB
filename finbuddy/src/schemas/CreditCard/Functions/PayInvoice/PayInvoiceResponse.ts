import z from "zod";
import { FirestoreIdSchema } from "../../../Common";

const DataSchema = z.object({
    invoiceid: FirestoreIdSchema,
    paidAt: z.string().datetime(),
    paymentTransactionId: FirestoreIdSchema,
    bankAccountId: FirestoreIdSchema,
});

export const PayInvoiceResponseSchema = DataSchema

export type PayInvoiceResponseType = z.infer<typeof PayInvoiceResponseSchema>;