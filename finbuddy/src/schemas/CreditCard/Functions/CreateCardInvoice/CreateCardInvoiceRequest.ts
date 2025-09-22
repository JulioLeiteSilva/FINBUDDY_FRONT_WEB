import z from "zod";
import { CreditCardInvoiceSchema } from "../../CreditCardInvoice";
import { FirestoreIdSchema } from "../../../Common";

const DataSchema = z.object({
    cardId: FirestoreIdSchema,
    invoice: CreditCardInvoiceSchema.pick({
        id: true,
        status: true,
        total: true,
        month: true,
        year: true,
        bankAccountId: true,
    })
});

export const CreateCardInvoiceRequestSchema = DataSchema

export type CreateCardInvoiceRequestType = z.infer<typeof CreateCardInvoiceRequestSchema>;