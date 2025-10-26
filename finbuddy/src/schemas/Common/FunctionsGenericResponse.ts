import { z } from 'zod';

export const FunctionsGenericResponseSchema = z.object({
  message: z.string(),
  data: z.unknown(),
});

export type FunctionsGenericResponseType = z.infer<typeof FunctionsGenericResponseSchema>;