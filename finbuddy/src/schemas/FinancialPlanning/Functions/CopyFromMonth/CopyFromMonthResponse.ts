import z from "zod";
import { FunctionsGenericResponseSchema } from "../../../Common";
import { FinancialPlanningWithCategoriesSchema } from "../../FinancialPlanningWithCategories";

export const CopyFromMonthResponseSchema = FunctionsGenericResponseSchema.extend({
    data: FinancialPlanningWithCategoriesSchema,
});

export type CopyFromMonthResponseType = z.infer<typeof CopyFromMonthResponseSchema>;