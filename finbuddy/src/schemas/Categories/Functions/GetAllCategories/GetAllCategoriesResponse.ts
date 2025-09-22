import z from "zod";
import { FunctionsGenericResponseSchema } from "../../../Common";
import { CategorySchema } from "../../Category";

const DataSchema = CategorySchema.pick({
    id: true,
    name: true,
    type: true,
    icon: true,
});

export const GetAllCategoriesResponseSchema = FunctionsGenericResponseSchema.extend({
    data: DataSchema
});

export type GetAllCategoriesResponseType = z.infer<typeof GetAllCategoriesResponseSchema>;