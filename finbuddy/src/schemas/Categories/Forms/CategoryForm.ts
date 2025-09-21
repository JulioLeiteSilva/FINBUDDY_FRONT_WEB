import { z } from 'zod';

export const CategoryFormSchema = z.object({
    name: z.string().min(1, { message: "O nome da categoria é obrigatório" }),
    icon: z.string().min(1, { message: "O ícone da categoria é obrigatório" }),
    type: z.enum(['INCOME', 'EXPENSE'], { 
        required_error: "O tipo da categoria é obrigatório",
        invalid_type_error: "Tipo de categoria inválido"
    }),
});

export type CategoryFormType = z.infer<typeof CategoryFormSchema>;