import z from "zod";
import { FunctionsGenericResponseSchema } from "../../../Common";
import { UserSchema } from "../../User";

const DataSchema = UserSchema.pick({
    id: true,
    name: true,
    status: true,
});

export const CompleteUserProfileResponseSchema = FunctionsGenericResponseSchema.extend({
    data: DataSchema,
});

export type CompleteUserProfileResponseType = z.infer<typeof CompleteUserProfileResponseSchema>;