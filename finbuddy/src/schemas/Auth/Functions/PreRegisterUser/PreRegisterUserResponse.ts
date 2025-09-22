import z from "zod";
import { FunctionsGenericResponseSchema } from "../../../Common";
import { UserSchema } from "../../User";

const DataSchema = UserSchema.pick({
    id: true,
    name: true,
    email: true,
    status: true,
    createdAt: true,
});

export const PreRegisterUserResponseSchema = FunctionsGenericResponseSchema.extend({
    data: DataSchema,
});

export type PreRegisterUserResponseType = z.infer<typeof PreRegisterUserResponseSchema>;