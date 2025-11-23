import z from "zod";
import { FunctionsGenericResponseSchema } from "../../../Common";
import { FinancialPlanningWithCategoriesSchema } from "../../FinancialPlanningWithCategories";

export const UpdateFinancialPlanningResponseSchema = FunctionsGenericResponseSchema.extend({
    data: FinancialPlanningWithCategoriesSchema,
});

export type UpdateFinancialPlanningResponseType = z.infer<typeof UpdateFinancialPlanningResponseSchema>;