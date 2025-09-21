import z from "zod";
import { TransactionSchema } from "../../Transaction";

const DataSchema = TransactionSchema.pick({
    id: true,
})

export const DeleteIncomeOrExpenseTransactionRequestSchema = DataSchema;

export type DeleteIncomeOrExpenseTransactionRequestType = z.infer<typeof DeleteIncomeOrExpenseTransactionRequestSchema>;