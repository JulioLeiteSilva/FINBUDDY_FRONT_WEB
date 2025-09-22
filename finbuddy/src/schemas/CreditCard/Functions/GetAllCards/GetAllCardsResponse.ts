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
    bankAccountId: true,
});

export const GetAllCardsResponseSchema = FunctionsGenericResponseSchema.extend({
    data: z.array(DataSchema)
});

export type GetAllCardsResponseType = z.infer<typeof GetAllCardsResponseSchema>;