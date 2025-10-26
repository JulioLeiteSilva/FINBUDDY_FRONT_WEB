import z from "zod";
import { FunctionsGenericRequestSchema } from "../../../Common";
import { UserSchema } from "../../User";

const DataSchema = UserSchema.pick({
  cellphone: true,
  address: true,
  birthDate: true,
  CPF: true,
  financialObjective: true,
});

export const CompleteUserProfileRequestSchema = FunctionsGenericRequestSchema.extend({
  data: DataSchema,
});

export type CompleteUserProfileRequestType = z.infer<typeof CompleteUserProfileRequestSchema>;