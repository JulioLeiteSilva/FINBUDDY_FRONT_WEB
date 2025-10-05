import z from "zod";
import { FunctionsGenericResponseSchema } from "../../../Common";
import { FinancialPlanningWithCategoriesSchema } from "../../FinancialPlanningWithCategories";

export const GetByMonthResponseSchema = FunctionsGenericResponseSchema.extend({
    data: FinancialPlanningWithCategoriesSchema,
});

export type GetByMonthResponseType = z.infer<typeof GetByMonthResponseSchema>;