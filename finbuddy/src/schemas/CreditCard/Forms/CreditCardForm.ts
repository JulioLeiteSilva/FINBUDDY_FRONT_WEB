import { z } from "zod";
import { CreditCardFlag } from "../../../enums/CreditCardFlag";
import { FirestoreIdSchema } from "../../Common/FirestoreSchemas";

export const CreditCardFormSchema = z.object({
  name: z.string().min(3).max(100),
  flag: z.nativeEnum(CreditCardFlag),
  closingDay: z.number().int().min(1).max(31),
  dueDate: z.number().int().min(1).max(31),
  limit: z.number().min(0),
  bankAccountId: FirestoreIdSchema,
});

export type CreditCardFormType = z.infer<typeof CreditCardFormSchema>;