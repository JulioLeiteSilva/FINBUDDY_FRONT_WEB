import z from "zod";
import { FinancialPlanningWithCategoriesSchema } from "../../FinancialPlanningWithCategories";

const DataSchema = FinancialPlanningWithCategoriesSchema
    .partial()
    .required({
        id: true,
    });

export const UpdateFinancialPlanningRequestSchema = DataSchema;

export type UpdateFinancialPlanningRequestType = z.infer<typeof UpdateFinancialPlanningRequestSchema>;