import { z } from 'zod';
import { FirestoreIdSchema } from '../Common';
import { UserStatus } from '../../enums/userStatus';
import { FinancialObjective } from '../../enums/FinancialObjective';

export const UserSchema = z.object({
  id: FirestoreIdSchema,
  name: z.string(),
  email: z.string(),
  status: z.nativeEnum(UserStatus),
  createdAt: z.date(),
  cellphone: z.string(),
  address: z.string(),
  birthDate: z.string(),
  CPF: z.string(),
  financialObjective: z.nativeEnum(FinancialObjective),
});

export type UserType = z.infer<typeof UserSchema>;