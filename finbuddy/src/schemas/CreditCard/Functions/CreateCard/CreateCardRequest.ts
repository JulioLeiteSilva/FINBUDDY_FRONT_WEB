import z from "zod";
import { CreditCardSchema } from "../../CreditCard";

const DataSchema = CreditCardSchema.pick({
    name: true,
    flag: true,
    closingDay: true,
    dueDate: true,
    limit: true,
    bankAccountId: true,
});

export const CreateCreditCardRequestSchema = DataSchema

export type CreateCreditCardRequestType = z.infer<typeof CreateCreditCardRequestSchema>;