import z from "zod";
import { FunctionsGenericResponseSchema } from "../../../Common";

export const DeleteInvoiceTransactionResponseSchema = FunctionsGenericResponseSchema;

export type DeleteInvoiceTransactionResponseType = z.infer<typeof DeleteInvoiceTransactionResponseSchema>;