import z from "zod";
import { FunctionsGenericResponseSchema } from "../../../Common";

export const UpdateInvoiceTransactionsResponseSchema = FunctionsGenericResponseSchema;

export type UpdateInvoiceTransactionsResponseType = z.infer<typeof UpdateInvoiceTransactionsResponseSchema>;