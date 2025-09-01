import z from "zod";
import { BankAccountSchema } from "../../BankAccount";
import { FunctionsGenericResponseSchema } from "../../../Common";

const DataSchema = BankAccountSchema.pick({
    id: true,
    name: true,
    type: true,
    bank: true,
    balance: true,
    currency: true,
    createdAt: true,
    updatedAt: true,
    isActive: true,
});

export const GetBankAccountResponseSchema = FunctionsGenericResponseSchema.extend({
    data: DataSchema,
});

export type GetBankAccountResponseType = z.infer<typeof GetBankAccountResponseSchema>;