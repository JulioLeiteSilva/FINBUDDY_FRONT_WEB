import z from "zod";
import { BankAccountSchema } from "../../BankAccount";

const DataSchema = BankAccountSchema
    .partial()
    .required({
        id: true,
    });

export const UpdateBankAccountRequestSchema = DataSchema;

export type UpdateBankAccountRequestType = z.infer<typeof UpdateBankAccountRequestSchema>;