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
    bankAccountId: true
})

export const CreateIncomeOrExpenseResponseSchema = FunctionsGenericResponseSchema.extend({
    data: DataSchema,
});

export type CreateIncomeOrExpenseResponseType = z.infer<typeof CreateIncomeOrExpenseResponseSchema>;