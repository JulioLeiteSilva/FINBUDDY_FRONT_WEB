import z from "zod";
import { FunctionsGenericResponseSchema } from "../../../Common";
import { FinancialPlanningWithCategoriesSchema } from "../../FinancialPlanningWithCategories";

export const CreateFinancialPlanningResponseSchema = FunctionsGenericResponseSchema.extend({
    data: FinancialPlanningWithCategoriesSchema,
});

export type CreateFinancialPlanningResponseType = z.infer<typeof CreateFinancialPlanningResponseSchema>;