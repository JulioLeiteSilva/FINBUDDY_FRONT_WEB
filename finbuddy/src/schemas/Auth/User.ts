import { z } from 'zod';

export const UserSchema = z.object({
  data: z.unknown(),
});

export type UserType = z.infer<typeof UserSchema>;