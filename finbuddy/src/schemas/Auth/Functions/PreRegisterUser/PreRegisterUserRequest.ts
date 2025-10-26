import z from "zod";
import { FunctionsGenericRequestSchema } from "../../../Common";
import { UserSchema } from "../../User";

const DataSchema = UserSchema.pick({
  name: true,
});

export const PreRegisterUserRequestSchema = FunctionsGenericRequestSchema.extend({
  data: DataSchema,
});

export type PreRegisterUserRequestType = z.infer<typeof PreRegisterUserRequestSchema>;