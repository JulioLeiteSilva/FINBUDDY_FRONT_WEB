import z from "zod";
import { TransactionSchema } from "../../Transaction";

const DataSchema = TransactionSchema.partial().required({ id: true });

export const UpdateInvoiceTransactionsRequestSchema = DataSchema;
export type UpdateInvoiceTransactionsRequestType = z.infer<typeof UpdateInvoiceTransactionsRequestSchema>;