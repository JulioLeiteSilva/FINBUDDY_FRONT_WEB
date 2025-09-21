import z from "zod";
import { TransactionSchema } from "../../Transaction";

const DataSchema = TransactionSchema.pick({
    id: true,
})

export const DeleteInvoiceTransactionRequestSchema = DataSchema;

export type DeleteInvoiceTransactionRequestType = z.infer<typeof DeleteInvoiceTransactionRequestSchema>;