import z from "zod";
import { BankAccountSchema } from "../../BankAccount";
import { FunctionsGenericRequestSchema } from "../../../Common";

const DataSchema = BankAccountSchema.pick({
    id: true,
    balance: true,
});

export const UpdateBankAccountBalanceRequestSchema = FunctionsGenericRequestSchema.extend({
    data: DataSchema,
});

export type UpdateBankAccountBalanceRequestType = z.infer<typeof UpdateBankAccountBalanceRequestSchema>;