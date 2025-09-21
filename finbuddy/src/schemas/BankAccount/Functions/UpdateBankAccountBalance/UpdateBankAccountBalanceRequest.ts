import z from "zod";
import { BankAccountSchema } from "../../BankAccount";

const DataSchema = BankAccountSchema.pick({
    id: true,
    balance: true,
});

export const UpdateBankAccountBalanceRequestSchema = DataSchema;

export type UpdateBankAccountBalanceRequestType = z.infer<typeof UpdateBankAccountBalanceRequestSchema>;