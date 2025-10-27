import { z } from "zod";
import { assetItemSchema, liabilityItemSchema, tangibleGoodsItemSchema } from "../../PatrimonialItem";

const DataSchema = z.union([
    assetItemSchema.omit({id: true}),
    tangibleGoodsItemSchema.omit({id: true}),
    liabilityItemSchema.omit({id: true}),
])

export const CreatePatrimonialItemRequestSchema = DataSchema;

export type CreatePatrimonialItemRequestType = z.infer<typeof CreatePatrimonialItemRequestSchema>;