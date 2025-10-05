import { z } from "zod";

// Schema auxiliar para a categoria, espelhando a estrutura do seu app
const CategorySchema = z.object({
    id: z.string(),
    name: z.string(),
    // Adicione outros campos que seu objeto CategoryType tenha, se necessário
    // ex: icon: z.string().optional(),
});

export const CreatFinancialPlanningSchema = z.object({
    monthlyIncome: z.number({
        required_error: "A receita mensal é obrigatória.",
        invalid_type_error: "A receita mensal deve ser um número.",
    }).min(0, "A receita mensal não pode ser negativa."),

    budgetAmount: z.number({
        required_error: "A meta de gastos é obrigatória.",
        invalid_type_error: "A meta de gastos deve ser um número.",
    }).min(0, "A meta de gastos não pode ser negativa."),

    month: z.string()
        .regex(/^\d{4}-(0[1-9]|1[0-2])$/, {
            message: "O mês deve estar no formato AAAA-MM (ex: 2025-10).",
        }),

    categoryAllocations: z.array(
        z.object({
            // Agora esperamos o objeto 'category' inteiro, alinhado com o formulário
            category: CategorySchema,
            value: z.number({
                required_error: "O valor da alocação é obrigatório.",
                invalid_type_error: "O valor da alocação deve ser um número.",
            }).positive("O valor da alocação deve ser um número positivo."),
        })
    ).min(1, "É necessário alocar o orçamento para pelo menos uma categoria."),
})
    .refine(
        (data) => {
            // Validação 1: A meta de gastos não deve exceder a receita
            return data.budgetAmount <= data.monthlyIncome;
        },
        {
            message: "Sua meta de gastos não pode ser maior que sua receita mensal.",
            path: ["budgetAmount"], // Erro será associado ao campo budgetAmount
        }
    )
    .refine(
        (data) => {
            // Validação 2: A soma das alocações não deve exceder a meta de gastos
            const totalAllocated = data.categoryAllocations.reduce(
                (sum, alloc) => sum + alloc.value,
                0
            );
            return totalAllocated <= data.budgetAmount;
        },
        {
            message: "A soma dos orçamentos por categoria excede a sua meta total de gastos.",
            // O erro será associado ao campo 'categoryAllocations' como um todo
            path: ["categoryAllocations"],
        }
    );

// O tipo inferido continua funcionando perfeitamente
export type CreatFinancialPlanningType = z.infer<typeof CreatFinancialPlanningSchema>;