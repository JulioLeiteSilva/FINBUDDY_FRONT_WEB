import z from "zod";
import { FirestoreIdSchema } from "../../../Common";

const DataSchema = z.object({
    cardId: FirestoreIdSchema,
});

export const GetAllCardInvoicesRequestSchema = DataSchema

export type GetAllCardInvoicesRequestType = z.infer<typeof GetAllCardInvoicesRequestSchema>;