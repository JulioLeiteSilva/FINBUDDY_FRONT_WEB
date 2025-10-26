import z from "zod";
import { CreditCardSchema } from "../../CreditCard";

const DataSchema = CreditCardSchema
    .partial()
    .required({
        id: true,
    });

export const UpdateCardRequestSchema = DataSchema;

export type UpdateCardRequestType = z.infer<typeof UpdateCardRequestSchema>;