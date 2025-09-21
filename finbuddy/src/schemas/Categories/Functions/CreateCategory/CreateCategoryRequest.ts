import z from "zod";
import { CategorySchema } from "../../Category";

const DataSchema = CategorySchema.pick({
    name: true,
    icon: true,
    type: true,
});

export const CreateCategoryRequestSchema = DataSchema;
export type CreateCategoryRequestType = z.infer<typeof CreateCategoryRequestSchema>;