import z from "zod";
import { FunctionsGenericResponseSchema } from "../../../Common";

export const UpdateTransactionResponseSchema = FunctionsGenericResponseSchema;

export type UpdateTransactionResponseType = z.infer<typeof UpdateTransactionResponseSchema>;