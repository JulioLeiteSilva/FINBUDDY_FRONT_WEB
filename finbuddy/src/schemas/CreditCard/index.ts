import z from "zod";
import { CreditCardRequestSchema } from "./CreditCardRequestDTOSchema";
import { CreditCardSchema } from "./CreditCardSchema";

export type CreditCardRequestDTOSchemaType = z.infer<typeof CreditCardRequestSchema>;
export type CreditCardSchemaType = z.infer<typeof CreditCardSchema>;

export { CreditCardRequestSchema, CreditCardSchema };