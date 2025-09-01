import z from "zod";
import { BankAccountSchema } from "../../BankAccount";
import { FunctionsGenericRequestSchema } from "../../../Common";

const DataSchema = BankAccountSchema
    .partial()
    .required({
        id: true,
    });

export const UpdateBankAccountRequestSchema = FunctionsGenericRequestSchema.extend({
    data: DataSchema,
});

export type UpdateBankAccountRequestType = z.infer<typeof UpdateBankAccountRequestSchema>;