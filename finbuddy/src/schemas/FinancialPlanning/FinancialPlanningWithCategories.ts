import z from "zod";
import { CategorySchema } from "../Categories";
import { FinancialPlanningSchema } from "./FinancialPlanning";

export const CategoryAllocationSchema = z.object({
  category: CategorySchema,
  value: z.number(),
  spent: z.number().optional(),
  paidSpent: z.number().optional(),
  unpaidSpent: z.number().optional(),
  remaining: z.number().optional(),
  percentUsed: z.number().optional(),
  percentPaidUsed: z.number().optional(),
  percentUnpaidUsed: z.number().optional(),
});

export const FinancialPlanningWithCategoriesSchema =
  FinancialPlanningSchema.omit({ categoryAllocations: true }).extend({
    categoryAllocations: z.array(CategoryAllocationSchema),
    totalSpent: z.number().optional(),
    totalPaidSpent: z.number().optional(),
    totalUnpaidSpent: z.number().optional(),
    remainingBudget: z.number().optional(),
    percentUsed: z.number().optional(),
    percentPaidUsed: z.number().optional(),
    percentUnpaidUsed: z.number().optional(),
    unallocatedAmount: z.number().optional(),
  });

export type CategoryAllocationType = z.infer<typeof CategoryAllocationSchema>;
export type FinancialPlanningWithCategoriesType = z.infer<
  typeof FinancialPlanningWithCategoriesSchema
>;
