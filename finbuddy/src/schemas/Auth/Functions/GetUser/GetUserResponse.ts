import z from "zod";
import { FunctionsGenericResponseSchema } from "../../../Common";
import { UserSchema } from "../../User";

export const GetUserResponseSchema = FunctionsGenericResponseSchema.extend({
    data: UserSchema,
});

export type GetUserResponseType = z.infer<typeof GetUserResponseSchema>;