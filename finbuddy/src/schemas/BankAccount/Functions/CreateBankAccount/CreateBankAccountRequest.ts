import z from "zod";
import { BankAccountSchema } from "../../BankAccount";
import { FunctionsGenericRequestSchema } from "../../../Common";

const DataSchema = BankAccountSchema.pick({
    name: true,
    type: true,
    bank: true,
    balance: true,
    currency: true,
});

export const CreateBankAccountRequestSchema = FunctionsGenericRequestSchema.extend({
    data: DataSchema,
});

export type CreateBankAccountRequestType = z.infer<typeof CreateBankAccountRequestSchema>;