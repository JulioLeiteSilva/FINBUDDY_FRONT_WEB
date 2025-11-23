import z from "zod";
import { FinancialPlanningWithCategoriesSchema } from "../../FinancialPlanningWithCategories";

const DataSchema = FinancialPlanningWithCategoriesSchema.pick({
    id: true,
});

export const DeleteFinancialPlanningRequestSchema = DataSchema;


export type DeleteFinancialPlanningRequestType = z.infer<typeof DeleteFinancialPlanningRequestSchema>;