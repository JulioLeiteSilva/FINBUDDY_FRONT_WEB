import z from "zod";
import { BankAccountSchema } from "../../BankAccount";

const DataSchema = BankAccountSchema.pick({
    id: true,
});

export const GetBankAccountRequestSchema = DataSchema;

export type GetBankAccountRequestType = z.infer<typeof GetBankAccountRequestSchema>;