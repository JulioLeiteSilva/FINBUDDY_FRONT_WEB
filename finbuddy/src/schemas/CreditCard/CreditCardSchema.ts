import { z } from "zod";
import { CreditCardFlag } from "../../enums/CreditCardFlag";
import { firestoreIdSchema } from "../Common/FirestoreSchemas";

export const CreditCardSchema = z.object({
  id: firestoreIdSchema,
  name: z.string().min(3).max(100),
  flag: z.nativeEnum(CreditCardFlag),
  closingDay: z.number().int().min(1).max(31),
  dueDate: z.number().int().min(1).max(31),
  limit: z.number(),
  bankAccountId: firestoreIdSchema,
});