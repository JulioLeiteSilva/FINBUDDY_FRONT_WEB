import z from "zod";
import { CategorySchema } from "../../Category";

const DataSchema = CategorySchema
    .partial()
    .required({
        id: true,
    });

export const UpdateCategoryRequestSchema = DataSchema;

export type UpdateCategoryRequestType = z.infer<typeof UpdateCategoryRequestSchema>;