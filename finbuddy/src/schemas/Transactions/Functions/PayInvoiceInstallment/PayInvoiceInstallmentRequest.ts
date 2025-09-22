import z from "zod";
import { TransactionSchema } from "../../Transaction";

const DataSchema = TransactionSchema.pick({
    id: true,
})

export const PayInvoiceInstallmentRequestSchema = DataSchema;

export type PayInvoiceInstallmentRequestType = z.infer<typeof PayInvoiceInstallmentRequestSchema>;