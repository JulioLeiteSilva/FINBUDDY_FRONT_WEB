import { z } from 'zod';
import { TransactionFrequency } from '../../../enums';
import { FirestoreIdSchema } from '../../Common/FirestoreSchemas';

export const CreateTransactionSchema = z.object({
    name: z.string().min(1, { message: "O nome da transação é obrigatório" }),
    category: z.string().min(1, { message: "A categoria é obrigatória" }),
    value: z.number({ message: "O valor deve ser maior que zero" }).gt(0, { message: "O valor deve ser maior que zero" }),
    date: z.date({ required_error: "A data é obrigatória" }),
    type: z.enum(['INCOME', 'EXPENSE', 'INVOICE'], { 
        required_error: "O tipo da transação é obrigatório",
        invalid_type_error: "Tipo de transação inválido"
    }),
    invoiceId: z.string().optional(),
    creditCardId: z.string().optional(),
    isRecurring: z.boolean({ required_error: "É necessário informar se a transação é recorrente" }),
    frequency: z.nativeEnum(TransactionFrequency, { 
        required_error: "A frequência é obrigatória para transações recorrentes",
        invalid_type_error: "Frequência inválida"
    }).nullable(),
    startDate: z.date({ 
        required_error: "A data de início é obrigatória para transações recorrentes",
        invalid_type_error: "Data de início inválida"
    }).nullable(),
    endDate: z.date({ 
        required_error: "A data de término é obrigatória para transações recorrentes",
        invalid_type_error: "Data de término inválida"
    }).nullable(),
    isPaid: z.boolean({ required_error: "É necessário informar se a transação está paga" }),
    currency: z.string().min(1, { message: "A moeda é obrigatória" }),
    bankAccountId: FirestoreIdSchema.refine((val) => val !== '', { 
        message: "A conta bancária é obrigatória" 
    }),
    primaryTransactionId: z.string().nullable().optional(),
});

export type CreateTransactionType = z.infer<typeof CreateTransactionSchema>;