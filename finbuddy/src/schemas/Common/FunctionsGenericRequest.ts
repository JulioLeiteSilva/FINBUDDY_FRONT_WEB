import { z } from 'zod';

export const FunctionsGenericRequestSchema = z.object({
  data: z.object({}),
});

export type FunctionsGenericRequestType = z.infer<typeof FunctionsGenericRequestSchema>;