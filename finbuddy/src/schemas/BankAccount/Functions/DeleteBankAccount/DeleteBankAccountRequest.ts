import z from "zod";
import { BankAccountSchema } from "../../BankAccount";

const DataSchema = BankAccountSchema.pick({
    id: true,
});

export const DeleteBankAccountRequestSchema = DataSchema;


export type DeleteBankAccountRequestType = z.infer<typeof DeleteBankAccountRequestSchema>;