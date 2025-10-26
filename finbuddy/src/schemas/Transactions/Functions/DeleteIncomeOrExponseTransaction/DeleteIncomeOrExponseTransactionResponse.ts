import z from "zod";
import { FunctionsGenericResponseSchema } from "../../../Common";

export const DeleteIncomeOrExpenseTransactionResponseSchema = FunctionsGenericResponseSchema;

export type DeleteIncomeOrExpenseTransactionResponseType = z.infer<typeof DeleteIncomeOrExpenseTransactionResponseSchema>;