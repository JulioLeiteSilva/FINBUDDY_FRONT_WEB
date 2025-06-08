import { z } from 'zod';
import { AccountType } from '../../enums/accountType';

export const CreateBankAccountDTOSchema = z.object({
    name: z.string().min(1, { message: "O nome da conta é obrigatório" }),
    type: z.nativeEnum(AccountType, { 
        required_error: "O tipo da conta é obrigatório",
        invalid_type_error: "Tipo de conta inválido"
    }),
    bank: z.string().min(1, { message: "O nome do banco é obrigatório" }),
    balance: z.number({ 
        required_error: "O saldo inicial é obrigatório",
        invalid_type_error: "O saldo deve ser um número"
    }),
    currency: z.string().min(1, { message: "A moeda é obrigatória" }),
});