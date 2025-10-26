import z from "zod";
import { FirestoreIdSchema } from "../../../Common";

const DataSchema = z.object({
    cardId: FirestoreIdSchema,
    invoiceid: FirestoreIdSchema,
    bankAccountId: FirestoreIdSchema,
});

export const PayInvoiceRequestSchema = DataSchema

export type PayInvoiceRequestType = z.infer<typeof PayInvoiceRequestSchema>;