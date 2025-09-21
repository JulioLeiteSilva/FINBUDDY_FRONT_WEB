import z from "zod";
import { FirestoreIdSchema, FunctionsGenericResponseSchema } from "../../../Common";

const DataSchema = z.object({
    transactionId: FirestoreIdSchema,
    paidAt: z.date(),
    remainingInstallments: z.number()
})

export const PayInvoiceInstallmentResponseSchema = FunctionsGenericResponseSchema.extend({
    data: DataSchema,
});

export type PayInvoiceInstallmentResponseType = z.infer<typeof PayInvoiceInstallmentResponseSchema>;