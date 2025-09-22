import z from "zod";
import { CategorySchema } from "../../Category";

const DataSchema = CategorySchema.pick({
    id: true,
    name: true,
    icon: true,
    type: true,
});

export const CreateCategoryResponseSchema = DataSchema;
export type CreateCategoryResponseType = z.infer<typeof CreateCategoryResponseSchema>;