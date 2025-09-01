import z from "zod";
import { BankAccountSchema } from "../../BankAccount";
import { FunctionsGenericRequestSchema } from "../../../Common";

const DataSchema = BankAccountSchema.pick({
    id: true,
});

export const DeleteBankAccountRequestSchema = FunctionsGenericRequestSchema.extend({
    data: DataSchema,
});

export type DeleteBankAccountRequestType = z.infer<typeof DeleteBankAccountRequestSchema>;