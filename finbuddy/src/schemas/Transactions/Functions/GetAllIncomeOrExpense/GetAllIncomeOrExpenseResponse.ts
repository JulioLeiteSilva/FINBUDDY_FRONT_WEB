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
    isRecurring: true,
    isPaid: true,
    currency: true,
    bankAccountId: true,
    primaryTransactionId: true
})

export const GetAllIncomeOrExpenseResponseSchema = FunctionsGenericResponseSchema.extend({
    data: z.object({
        transactions: z.array(DataSchema),
    }),
});

export type GetAllIncomeOrExpenseResponseType = z.infer<typeof GetAllIncomeOrExpenseResponseSchema>;