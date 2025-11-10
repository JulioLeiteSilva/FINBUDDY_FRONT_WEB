import z from "zod";
import { anyPatrimonialItemSchema } from "../../PatrimonialItem";
import { FunctionsGenericResponseSchema } from "../../../Common";

const DataSchema = anyPatrimonialItemSchema;

export const GetAllPatrimonialManagementResponseSchema = FunctionsGenericResponseSchema.extend({
    data: z.object({
        data: z.array(DataSchema)
    }),
});

export type GetAllPatrimonialManagementResponseType = z.infer<typeof GetAllPatrimonialManagementResponseSchema>;