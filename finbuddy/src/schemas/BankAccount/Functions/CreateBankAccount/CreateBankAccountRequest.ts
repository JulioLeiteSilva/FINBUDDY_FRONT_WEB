import z from "zod";
import { BankAccountSchema } from "../../BankAccount";

const DataSchema = BankAccountSchema.pick({
    name: true,
    type: true,
    bank: true,
    balance: true,
    currency: true,
});

export const CreateBankAccountRequestSchema = DataSchema

export type CreateBankAccountRequestType = z.infer<typeof CreateBankAccountRequestSchema>;