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
    primaryTransactionId: true
})

export const GetAllInvoicesResponseSchema = FunctionsGenericResponseSchema.extend({
    data: z.array(DataSchema),
});

export type GetAllInvoicesResponseType = z.infer<typeof GetAllInvoicesResponseSchema>;