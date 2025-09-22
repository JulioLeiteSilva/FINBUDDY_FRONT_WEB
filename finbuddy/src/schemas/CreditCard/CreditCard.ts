import { z } from "zod";
import { CreditCardFlag } from "../../enums/CreditCardFlag";
import { FirestoreIdSchema } from "../Common/FirestoreSchemas";

export const CreditCardSchema = z.object({
  id: FirestoreIdSchema,
  name: z.string().min(3).max(100),
  flag: z.nativeEnum(CreditCardFlag),
  closingDay: z.number().int().min(1).max(31),
  dueDate: z.number().int().min(1).max(31),
  limit: z.number(),
  usedLimit: z.number(),
  bankAccountId: FirestoreIdSchema,
});

export type CreditCardType = z.infer<typeof CreditCardSchema>;