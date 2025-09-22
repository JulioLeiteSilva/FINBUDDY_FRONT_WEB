import z from "zod";
import { TransactionSchema } from "../../Transaction";

const DataSchema = TransactionSchema.partial().required({ id: true });

export const UpdateTransactionRequestSchema = DataSchema;
export type UpdateTransactionRequestType = z.infer<typeof UpdateTransactionRequestSchema>;