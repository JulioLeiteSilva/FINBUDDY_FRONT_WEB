import z from "zod";
import { BankAccountSchema } from "../../BankAccount";
import { FunctionsGenericRequestSchema } from "../../../Common";

const DataSchema = BankAccountSchema.pick({
    id: true,
});

export const GetBankAccountRequestSchema = FunctionsGenericRequestSchema.extend({
    data: DataSchema,
});

export type GetBankAccountRequestType = z.infer<typeof GetBankAccountRequestSchema>;