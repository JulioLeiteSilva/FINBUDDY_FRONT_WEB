import z from "zod";
import { FunctionsGenericResponseSchema } from "../../../Common";

export const DeleteBankAccountResponseSchema = FunctionsGenericResponseSchema.omit({
  data: true,
});

export type DeleteBankAccountResponseType = z.infer<typeof DeleteBankAccountResponseSchema>;