import z from "zod";
import { FunctionsGenericResponseSchema } from "../../../Common";
import { CreditCardInvoiceSchema } from "../../CreditCardInvoice";

const DataSchema = CreditCardInvoiceSchema.pick({
    id: true,
    status: true,
    total: true,
    month: true,
    year: true,
    bankAccountId: true,
})

export const GetAllCardInvoicesResponseSchema = FunctionsGenericResponseSchema.extend({
    data: z.object({
        invoices: z.array(DataSchema)
    }),
});

export type GetAllCardInvoicesResponseType = z.infer<typeof GetAllCardInvoicesResponseSchema>;