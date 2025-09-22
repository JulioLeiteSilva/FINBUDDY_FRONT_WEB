import z from "zod";
import { CategorySchema } from "../../Category";

const DataSchema = CategorySchema.pick({
    id: true,
});

export const DeleteCategoryRequestSchema = DataSchema;


export type DeleteCategoryRequestType = z.infer<typeof DeleteCategoryRequestSchema>;