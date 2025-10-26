import z from "zod";
import { TransactionSchema } from "../../Transaction";
import { FunctionsGenericResponseSchema } from "../../../Common";

const DataSchema = TransactionSchema.pick({
    id: true,
    name: true,
    category: true,
    value: true,
    date: true,
    type: true,
    invoiceId: true,
    creditCardId: true,
    isRecurring: true,
    isPaid: true,
    currency: true,
    bankAccountId: true,
})

export const CreateInvoiceResponseSchema = FunctionsGenericResponseSchema.extend({
    data: DataSchema,
});

export type CreateInvoiceResponseType = z.infer<typeof CreateInvoiceResponseSchema>;