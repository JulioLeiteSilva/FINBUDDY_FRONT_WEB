import { z } from "zod";

const DataSchema = z.object({
    monthlyIncome: z.number(),
    budgetAmount: z.number(),
    month: z.string(),
    categoryAllocations: z.array(z.object({
        categoryId: z.string(),
        value: z.number(),
    })),
})

export const CreateFinancialPlanningRequestSchema = DataSchema;

export type CreateFinancialPlanningRequestType = z.infer<typeof CreateFinancialPlanningRequestSchema>;