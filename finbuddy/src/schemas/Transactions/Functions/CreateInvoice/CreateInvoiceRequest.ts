import z from "zod";
import { TransactionSchema } from "../../Transaction";

const DataSchema = TransactionSchema.pick({
    name: true,
    category: true,
    value: true,
    date: true,
    type: true,
    invoiceId: true,
    creditCardId:true,
    isRecurring: true,
    isPaid: true,
    currency: true,
    bankAccountId: true,
});

export const CreateInvoiceRequestSchema = DataSchema;
export type CreateInvoiceRequestType = z.infer<typeof CreateInvoiceRequestSchema>;