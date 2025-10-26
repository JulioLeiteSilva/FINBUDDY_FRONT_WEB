import z from "zod";
import { TransactionSchema } from "../../Transaction";

const DataSchema = TransactionSchema.pick({
    name: true,
    category: true,
    value: true,
    date: true,
    type: true,
    isRecurring: true,
    isPaid: true,
    currency: true,
    bankAccountId: true,
});

export const CreateIncomeOrExpenseRequestSchema = DataSchema;
export type CreateIncomeOrExpenseRequestType = z.infer<typeof CreateIncomeOrExpenseRequestSchema>;