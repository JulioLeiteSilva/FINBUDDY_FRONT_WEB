import { z } from 'zod';
import { firestoreIdSchema } from '../Common/FirestoreSchemas';

export const CreditCardInvoiceRequestDTOSchema = z.object({
    creditCardId: firestoreIdSchema.refine((val) => val !== '', { 
        message: "O cartão de crédito é obrigatório" 
    }),
    dueDate: z.date({ required_error: "A data de vencimento é obrigatória" }),
    closingDate: z.date({ required_error: "A data de fechamento é obrigatória" }),
    totalAmount: z.number({ 
        required_error: "O valor total é obrigatório",
        invalid_type_error: "O valor total deve ser um número"
    }),
    isPaid: z.boolean({ required_error: "É necessário informar se a fatura está paga" }),
    paymentDate: z.date().nullable(),
}); 