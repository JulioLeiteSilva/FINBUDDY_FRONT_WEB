import { z } from 'zod';

export const FunctionsGenericRequestSchema = z.object({
  data: z.unknown(),
});

export type FunctionsGenericRequestType = z.infer<typeof FunctionsGenericRequestSchema>;