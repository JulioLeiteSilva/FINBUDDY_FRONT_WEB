import { z } from "zod";
import { FirestoreIdSchema } from "../Common";

export const FinancialPlanningSchema = z.object({
    id: FirestoreIdSchema,
    monthlyIncome: z.number(),
    budgetAmount: z.number(),
    allocatedAmount: z.number(),
    categoryAllocations: z.array(z.object({
        categoryId: FirestoreIdSchema,
        value: z.number(),
    })),
    month: z.date(),
    createdAt: z.date(),
    updatedAt: z.date(),
})

export type FinancialPlanningType = z.infer<
    typeof FinancialPlanningSchema
>;