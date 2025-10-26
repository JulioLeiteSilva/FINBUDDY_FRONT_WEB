import z from "zod";
import { FunctionsGenericResponseSchema } from "../../../Common";
import { CreditCardSchema } from "../../CreditCard";

const DataSchema = CreditCardSchema.pick({
    id: true,
    name: true,
    flag: true,
    closingDay: true,
    dueDate: true,
    limit: true,
    usedLimit: true,
    bankAccountId: true
});

export const CreateCardResponseSchema = FunctionsGenericResponseSchema.extend({
    data: DataSchema,
});

export type CreateCardResponseType = z.infer<typeof CreateCardResponseSchema>;