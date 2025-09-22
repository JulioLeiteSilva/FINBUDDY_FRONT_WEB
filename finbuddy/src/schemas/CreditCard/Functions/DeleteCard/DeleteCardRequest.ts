import z from "zod";
import { CreditCardSchema } from "../../CreditCard";

const DataSchema = CreditCardSchema.pick({
    id: true,
});

export const DeleteCardRequestSchema = DataSchema;


export type DeleteCardRequestType = z.infer<typeof DeleteCardRequestSchema>;