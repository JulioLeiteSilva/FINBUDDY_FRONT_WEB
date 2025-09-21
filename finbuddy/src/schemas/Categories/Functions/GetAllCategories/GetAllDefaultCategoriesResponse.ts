import z from "zod";
import { FunctionsGenericResponseSchema } from "../../../Common";
import { CategorySchema } from "../../Category";

const DataSchema = CategorySchema.pick({
    id: true,
    name: true,
    type: true,
    icon: true,
});

export const GetAllDefaultCategoriesResponseSchema = FunctionsGenericResponseSchema.extend({
    data: z.object({
        categories: z.array(DataSchema)
    }),
});

export type GetAllDefaultCategoriesResponseType = z.infer<typeof GetAllDefaultCategoriesResponseSchema>;