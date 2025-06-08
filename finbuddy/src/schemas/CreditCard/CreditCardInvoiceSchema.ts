import { z } from "zod";
import { firestoreIdSchema } from "../Common/FirestoreSchemas";
import { InvoiceStatus } from "../../enums/InvoiceStatus";

export const CreditCardSchema = z.object({
    id: firestoreIdSchema,
    status: z.nativeEnum(InvoiceStatus),
    total: z.number(),
    month : z.number(),
    year : z.number(),
    bankAccountId: firestoreIdSchema.nullable(),
});